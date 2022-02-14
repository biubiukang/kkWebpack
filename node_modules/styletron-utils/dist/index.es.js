import prefixAll from 'inline-style-prefixer/static';

const uppercasePattern = /[A-Z]/g;
const msPattern = /^ms-/;
const cache = {};
function hyphenateStyleName(prop) {
  return prop in cache ? cache[prop] : cache[prop] = prop.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-');
}

function injectStyle(styletron, styles, media, pseudo) {
  let classString = '';

  for (const key in styles) {
    const val = styles[key];
    const valType = typeof val;

    if (valType === 'string' || valType === 'number') {
      classString += ' ' + styletron.injectRawDeclaration({
        block: `${hyphenateStyleName(key)}:${val}`,
        media,
        pseudo
      });
      continue;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) {
        continue;
      }

      const hyphenated = hyphenateStyleName(key);
      let block = `${hyphenated}:${val[0]}`;

      for (let i = 1; i < val.length; i++) {
        block += `;${hyphenated}:${val[i]}`;
      }

      classString += ' ' + styletron.injectRawDeclaration({
        block,
        media,
        pseudo
      });
      continue;
    }

    if (valType === 'object') {
      if (key[0] === ':') {
        classString += ' ' + injectStyle(styletron, val, media, key);
        continue;
      }

      if (key.substring(0, 6) === '@media') {
        classString += ' ' + injectStyle(styletron, val, key.substr(7), pseudo);
        continue;
      }
    }
  } // remove leading space on way out


  return classString.slice(1);
}

const prefixedBlockCache = {};
function injectStylePrefixed(styletron, styles, media, pseudo, cache = prefixedBlockCache) {
  let classString = '';

  for (const originalKey in styles) {
    const originalVal = styles[originalKey];
    const originalValType = typeof originalVal;
    const isPrimitiveVal = originalValType === 'string' || originalValType === 'number';

    if (isPrimitiveVal || Array.isArray(originalVal)) {
      let block = '';

      if (isPrimitiveVal && cache.hasOwnProperty(originalKey) && cache[originalKey].hasOwnProperty(originalVal)) {
        block = cache[originalKey][originalVal];
      } else {
        const prefixed = prefixAll({
          [originalKey]: originalVal
        });

        for (const prefixedKey in prefixed) {
          const prefixedVal = prefixed[prefixedKey];
          const prefixedValType = typeof prefixedVal;

          if (prefixedValType === 'string' || prefixedValType === 'number') {
            block += `${hyphenateStyleName(prefixedKey)}:${prefixedVal};`;
            continue;
          }

          if (Array.isArray(prefixedVal)) {
            const hyphenated = hyphenateStyleName(prefixedKey);

            for (let i = 0; i < prefixedVal.length; i++) {
              block += `${hyphenated}:${prefixedVal[i]};`;
            }

            continue;
          }
        }

        block = block.slice(0, -1); // Remove trailing semicolon

        if (isPrimitiveVal) {
          if (!cache.hasOwnProperty(originalKey)) {
            cache[originalKey] = {};
          }

          cache[originalKey][originalVal] = block;
        }
      }

      classString += ' ' + styletron.injectRawDeclaration({
        block,
        media,
        pseudo
      });
    }

    if (originalValType === 'object') {
      if (originalKey[0] === ':') {
        classString += ' ' + injectStylePrefixed(styletron, originalVal, media, originalKey, cache);
        continue;
      }

      if (originalKey.substring(0, 6) === '@media') {
        classString += ' ' + injectStylePrefixed(styletron, originalVal, originalKey.substr(7), pseudo, cache);
        continue;
      }
    }
  } // remove leading space on way out


  return classString.slice(1);
}

export { injectStyle, injectStylePrefixed };
//# sourceMappingURL=index.es.js.map
