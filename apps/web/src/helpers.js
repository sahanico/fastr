function toKebab(string) {
  return string
    .split('')
    .map((letter) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }
      return letter;
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-');
}

function toTitle(string) {
  return toKebab(string)
    .split('-')
    .map(word => word.slice(0, 1)
      .toUpperCase() + word.slice(1))
    .join(' ');
}


function toSentence(string) {
  const interim = toKebab(string)
    .replace(/-/g, ' ');
  return interim.slice(0, 1)
    .toUpperCase() + interim.slice(1);
}

function toCamel(string) {
  return toKebab(string)
    .split('-')
    .map((word, index) => {
      if (index === 0) return word;
      return word.slice(0, 1)
        .toUpperCase() + word.slice(1)
        .toLowerCase();
    })
    .join('');
}

function toSnake(string) {
  return toKebab(string)
    .replace(/-/g, '_');
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


module.exports = {
  toTitle,
  toKebab,
  toSentence,
  toCamel,
  toSnake,
  getBase64,

};
