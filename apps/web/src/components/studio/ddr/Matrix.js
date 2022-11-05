import Vector from './Vector';

class Matrix {
  constructor(values) {
    // eslint-disable-next-line no-underscore-dangle
    this._values = values;
  }

  static zeros(shape) {
    return new Matrix(new Array(shape[0]).fill(null).map(() => new Array(shape[1]).fill(0)));
  }

  valueOf() {
    // eslint-disable-next-line no-underscore-dangle
    return JSON.parse(JSON.stringify(this._values));
  }

  toString() {
    // eslint-disable-next-line no-underscore-dangle
    return `Matrix ( ${this._values.map(item => item.join(' ')).join(', ')})`;
  }

  rows() {
    // eslint-disable-next-line no-underscore-dangle
    return this._values.length;
  }

  cols() {
    // eslint-disable-next-line no-underscore-dangle
    return this._values[0].length;
  }

  rowVector(row) {
    // eslint-disable-next-line no-underscore-dangle
    return new Vector(this._values[row].slice(0));
  }

  colVector(col) {
    const v = new Array(this.rows()).fill(0);
    // eslint-disable-next-line no-underscore-dangle
    this._values.forEach((item, index) => {
      v[index] = item[col];
    });
    return new Vector(v);
  }

  dot(v) {
    if (v instanceof Vector && this.cols() === v.length) {
      return new Vector(new Array(v.length).fill(null).map(
        (item, index) => this.rowVector(index).dot(v)),
      );
    }
    if (v instanceof Matrix && this.cols() === v.rows()) {
      // eslint-disable-next-line one-var,prefer-const,one-var-declaration-per-line
      let cols = v.cols(), rows = v.rows();
      const newMatrix = Matrix.zeros([rows, cols]);
      let v1;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < cols; i++) {
        v1 = this.dot(v.colVector(i));
        // eslint-disable-next-line no-plusplus
        for (let j = 0; j < rows; j++) {
          // eslint-disable-next-line no-underscore-dangle
          newMatrix._values[j][i] = v1.get(j);
        }
      }
      return newMatrix;
    }
    throw new Error(`expected a Vector or Matrix but got ${typeof v}`);
  }

  get(row, col) {
    // eslint-disable-next-line no-underscore-dangle
    return this._values[row][col];
  }

  T() {
    return new Matrix(new Array(this.cols()).fill(null).map((_, colIndex) =>
      // eslint-disable-next-line no-shadow
      new Array(this.rows()).fill(0).map((_, rowIndex) => this.get(rowIndex, colIndex)),
    ));
  }
}

export default Matrix;
