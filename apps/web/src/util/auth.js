
export const toKebab = string => string.split('').map((letter) => {
  if (/[A-Z]/.test(letter)) {
    return ` ${letter.toLowerCase()}`;
  }
  return letter;
}).join('').trim()
  .replace(/[_\s]+/g, '-');

export const toTitle = string => toKebab(string)
  .split('-')
  .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
  .join(' ');
