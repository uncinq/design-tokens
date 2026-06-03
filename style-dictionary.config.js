import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
import path from 'node:path';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function getTokenFiles(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name.startsWith('$')) return [];
    const fullPath = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return getTokenFiles(fullPath, rel);
    if (entry.name.endsWith('.json')) {
      return [{ filePath: fullPath, rel: rel.replace(/\.json$/, '') }];
    }
    return [];
  });
}

function pathToKebab(parts) {
  return parts
    .filter(p => p !== 'default')
    .map(p => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-');
}

function refToVar(ref) {
  return ref.replace(/\{([^}]+)\}/g, (_, p) => `var(--${pathToKebab(p.split('.'))})`);
}

function compositeLayerToCSS(obj) {
  const { inset, ...props } = obj;
  const values = Object.values(props).map(v => refToVar(String(v)));
  return `${inset ? 'inset ' : ''}${values.join(' ')}`;
}

// Serialize a DTCG color object ({ colorSpace, components, alpha? }) to a CSS
// color. Style Dictionary core does not yet serialize this stable-spec shape
// (style-dictionary#1507), so we handle it here.
// https://tr.designtokens.org/color/
function colorObjectToCss({ colorSpace, components, alpha }) {
  const value = `${components.join(' ')}${alpha !== undefined && alpha !== 1 ? ` / ${alpha}` : ''}`;
  return colorSpace === 'oklch' ? `oklch(${value})` : `color(${colorSpace} ${value})`;
}

const indent = (text, n) =>
  text.split('\n').map(line => ' '.repeat(n) + line).join('\n');

// -------------------------------------------------------
// Transforms
// -------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'name/kebab/strip-default',
  type: 'name',
  transform: token => pathToKebab(token.path),
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: ['name/kebab/strip-default'],
});

// -------------------------------------------------------
// Format — @layer tokens, one or more rules (selector + optional @media)
// -------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/layer-tokens',
  format({ dictionary, file, options }) {
    const rules = options?.rules ?? [{ selector: ':root' }];

    const decls = dictionary.allTokens.map(t => {
      const name = pathToKebab(t.path);
      const orig = t.original?.$value ?? t.original?.value;
      const type = t.$type ?? t.type;
      let value;
      if (type === 'cubicBezier' && Array.isArray(orig))   value = `cubic-bezier(${orig.join(', ')})`;
      else if (type === 'color' && orig && typeof orig === 'object' && Array.isArray(orig.components))
                                                           value = colorObjectToCss(orig);
      else if (Array.isArray(orig))                        value = orig.map(compositeLayerToCSS).join(', ');
      else if (orig !== null && typeof orig === 'object')  value = compositeLayerToCSS(orig);
      else                                                 value = refToVar(String(orig ?? t.$value ?? t.value));
      return `--${name}: ${value};`;
    }).join('\n');

    const blocks = rules
      .map(({ selector, media }) => {
        const rule = `${selector} {\n${indent(decls, 2)}\n}`;
        return media ? `@media ${media} {\n${indent(rule, 2)}\n}` : rule;
      })
      .map(block => indent(block, 2))
      .join('\n');

    return `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n/* ${file.destination} */\n@layer tokens {\n${blocks}\n}\n`;
  },
});

// -------------------------------------------------------
// Config
// -------------------------------------------------------

// The dark override is applied automatically when the OS prefers dark, unless
// the page has forced light via [data-color-scheme="light"] (the :not guard
// then falls back to the :root defaults — no light token set needed). Forcing
// dark against a light OS is intentionally not supported.
const RULES = {
  'themes/dark': [
    { selector: ':root:not([data-color-scheme="light"])', media: '(prefers-color-scheme: dark)' },
  ],
};

const tokenFiles = getTokenFiles('./tokens');
const baseFiles = tokenFiles.filter(f => f.rel !== 'themes/dark');
const darkFile = tokenFiles.find(f => f.rel === 'themes/dark');

// Base build — primitives + semantic (defaults = light), each on :root.
await new StyleDictionary({
  usesDtcg: true,
  log: { warnings: 'disabled' },
  source: baseFiles.map(f => f.filePath),
  platforms: {
    css: {
      transformGroup: 'custom/css',
      buildPath: 'dist/css/',
      files: baseFiles.map(f => ({
        destination: `${f.rel}.css`,
        format: 'css/layer-tokens',
        filter: t => t.filePath === f.filePath,
        options: { rules: RULES[f.rel] ?? [{ selector: ':root' }] },
      })),
    },
  },
}).buildAllPlatforms();

// Dark build — primitives + semantic + dark override, so the dark var()
// references resolve against the base tokens.
await new StyleDictionary({
  usesDtcg: true,
  log: { warnings: 'disabled' },
  source: [...baseFiles.map(f => f.filePath), darkFile.filePath],
  platforms: {
    css: {
      transformGroup: 'custom/css',
      buildPath: 'dist/css/',
      files: [{
        destination: `${darkFile.rel}.css`,
        format: 'css/layer-tokens',
        filter: t => t.filePath === darkFile.filePath,
        options: { rules: RULES[darkFile.rel] },
      }],
    },
  },
}).buildAllPlatforms();

// Each generated CSS file declares its own cascade layer (@layer tokens { … }),
// so barrels and index use a plain @import — no layer() function on the import.
// That form (`@import "x" layer(tokens)`) is not handled by every asset pipeline
// (e.g. Hugo's postcss-import / Sass), and is redundant here anyway.
fs.mkdirSync('./dist/css', { recursive: true });

// Group barrels — dist/css/primitive.css, dist/css/semantic.css.
const groups = {};
for (const f of baseFiles) {
  const [group] = f.rel.split('/');
  (groups[group] ??= []).push(f.rel);
}
for (const [group, rels] of Object.entries(groups)) {
  fs.writeFileSync(
    `./dist/css/${group}.css`,
    `/* ${group}.css — barrel, do not edit */\n` +
      rels.map(rel => `@import "./${rel}.css";`).join('\n') + '\n',
  );
}

// index.css — barrels first (primitive → semantic), then the dark override last.
fs.writeFileSync(
  './dist/css/index.css',
  [...Object.keys(groups).map(g => `${g}.css`), `${darkFile.rel}.css`]
    .map(file => `@import "./${file}";`).join('\n') + '\n',
);
