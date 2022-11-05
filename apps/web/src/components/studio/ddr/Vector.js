class Vector {
  constructor(lst) {
    // eslint-disable-next-line no-underscore-dangle
    this._values = lst;
  }

  toString() {
    // eslint-disable-next-line no-underscore-dangle
    return `Vector(${this._values.join(', ')})`;
  }

  get length() {
    // eslint-disable-next-line no-underscore-dangle
    return this._values.length;
  }

  dot(vector) {
    if (vector instanceof Vector && this.length === vector.length) {
      // eslint-disable-next-line no-underscore-dangle,max-len
      return this._values.map((item, index) => item * vector._values[index]).reduce((a, b) => a + b);
    }
    throw Error('The param `vector` must instance of Vector');
  }

  get(index) {
    // eslint-disable-next-line no-underscore-dangle
    return this._values[index];
  }
}

export default Vector;
