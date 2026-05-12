import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
import path from 'node:path';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function getTokenFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getTokenFiles(fullPath);
    if (entry.name.endsWith('.json')) return [fullPath];
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
  return ref.replace(/\{([^}]+)\}/g, (_, path) => `var(--${pathToKebab(path.split('.'))})`);
}

function compositeLayerToCSS(obj) {
  const { inset, ...props } = obj;
  const values = Object.values(props).map(v => refToVar(String(v)));
  return `${inset ? 'inset ' : ''}${values.join(' ')}`;
}

// -------------------------------------------------------
// Transforms
// -------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'name/kebab/strip-default',
  type: 'name',
  transform(token) {
    return pathToKebab(token.path);
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: ['name/kebab/strip-default'],
});

// -------------------------------------------------------
// Format — @layer config + optional @media from $mods.dark
// -------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/layer-config',
  format({ dictionary, file }) {
    const allVars = dictionary.allTokens.map(t => {
      const name = pathToKebab(t.path);
      const orig = t.original?.$value ?? t.original?.value;
      let value;
      if (Array.isArray(orig))                               value = orig.map(compositeLayerToCSS).join(', ');
      else if (orig !== null && typeof orig === 'object')    value = compositeLayerToCSS(orig);
      else                                                   value = refToVar(String(orig ?? t.$value ?? t.value));
      return `    --${name}: ${value};`;
    }).join('\n');

    const darkTokens = dictionary.allTokens.filter(t => t.original?.$mods?.dark);

    const header = '/**\n * Do not edit directly, this file was auto-generated.\n */';

    let out = `${header}\n\n/* ${file.destination} */\n@layer config {\n`;
    out += `  :root {\n${allVars}\n  }`;

    if (darkTokens.length > 0) {
      const darkVars = darkTokens
        .map(t => `      --${t.name}: ${refToVar(t.original.$mods.dark)};`)
        .join('\n');
      out += `\n\n  @media (prefers-color-scheme: dark) {\n    :root:not([data-color-scheme="light"]) {\n${darkVars}\n    }\n  }`;
    }

    return out + '\n}\n';
  },
});

// -------------------------------------------------------
// Config
// -------------------------------------------------------

const tokenFiles = getTokenFiles('./tokens');

export default {
  usesDtcg: true,
  log: { warnings: 'disabled' },
  source: tokenFiles,

  platforms: {
    css: {
      transformGroup: 'custom/css',
      buildPath: 'dist/css/',
      files: tokenFiles.map(file => ({
        destination: path.relative('./tokens', file).replace(/\.json$/, '.css'),
        format: 'css/layer-config',
        filter: t => t.filePath === file,
      })),
    },
  },
};
