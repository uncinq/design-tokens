import StyleDictionary from 'style-dictionary';
import { formattedVariables } from 'style-dictionary/utils';
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
  return /^\{.+\}$/.test(ref)
    ? `var(--${pathToKebab(ref.slice(1, -1).split('.'))})`
    : ref;
}

function shadowLayerToCSS({ color = 'transparent', offsetX = '0', offsetY = '0', blur = '0', spread = '0', inset = false }) {
  return `${inset ? 'inset ' : ''}${offsetX} ${offsetY} ${blur} ${spread} ${refToVar(String(color))}`;
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

StyleDictionary.registerTransform({
  name: 'shadow/css/with-refs',
  type: 'value',
  filter: token => token.$type === 'shadow',
  transform(token) {
    const v = token.original?.$value ?? token.original?.value;
    if (Array.isArray(v))           return v.map(shadowLayerToCSS).join(', ');
    if (v && typeof v === 'object') return shadowLayerToCSS(v);
    return token.$value ?? token.value;
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: ['name/kebab/strip-default', 'shadow/css/with-refs'],
});

// -------------------------------------------------------
// Format — @layer config + optional @media from $mods.dark
// -------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/layer-config',
  format({ dictionary, file }) {
    const lightVars = formattedVariables({
      format: 'css',
      dictionary,
      outputReferences: true,
      usesDtcg: true,
      formatting: { indentation: '    ' },
    });

    const darkTokens = dictionary.allTokens.filter(t => t.original?.$mods?.dark);

    const header = '/**\n * Do not edit directly, this file was auto-generated.\n */';

    let out = `${header}\n\n/* ${file.destination} */\n@layer config {\n`;
    out += `  :root {\n${lightVars.trimEnd()}\n  }`;

    if (darkTokens.length > 0) {
      const darkVars = darkTokens
        .map(t => `      --${t.name}: ${refToVar(t.original.$mods.dark)};`)
        .join('\n');
      out += `\n\n  @media (prefers-color-scheme: dark) {\n    :root {\n${darkVars}\n    }\n  }`;
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
