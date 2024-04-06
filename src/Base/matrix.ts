import Coordinate from 'Base/coordinate';
import Point from 'Base/point';

class Matrix {
    public m1: [number, number, number];
    public m2: [number, number, number];
    public m3: [number, number, number];

    public constructor(m1: [number, number, number], m2: [number, number, number], m3: [number, number, number]) {
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
    }

    public flatten() : number[] {
        return [...this.m1, ...this.m2, ...this.m3]
    }

    public multiplyMatrix(otherMatrix: Matrix): Matrix {
        const [a11, a12, a13] = this.m1;
        const [a21, a22, a23] = this.m2;
        const [a31, a32, a33] = this.m3;

        const [b11, b12, b13] = otherMatrix.m1;
        const [b21, b22, b23] = otherMatrix.m2;
        const [b31, b32, b33] = otherMatrix.m3;

        const c11 = a11 * b11 + a12 * b21 + a13 * b31;
        const c12 = a11 * b12 + a12 * b22 + a13 * b32;
        const c13 = a11 * b13 + a12 * b23 + a13 * b33;
        const c21 = a21 * b11 + a22 * b21 + a23 * b31;
        const c22 = a21 * b12 + a22 * b22 + a23 * b32;
        const c23 = a21 * b13 + a22 * b23 + a23 * b33;
        const c31 = a31 * b11 + a32 * b21 + a33 * b31;
        const c32 = a31 * b12 + a32 * b22 + a33 * b32;
        const c33 = a31 * b13 + a32 * b23 + a33 * b33;

        const matrix = new Matrix([c11, c12, c13], [c21, c22, c23], [c31, c32, c33]);
        return matrix;
    }


    public multiplyPoint(point: Point): Point {
        const [a11, a21, a31] = this.m1;
        const [a12, a22, a32] = this.m2;
        const [a13, a23, a33] = this.m3;

        const x1 = a11 * point.x + a12 * point.y + a13 * point.w;
        const y1 = a21 * point.x + a22 * point.y + a23 * point.w;
        
        const newPoint = new Point([x1, y1]);

        return newPoint;
    }
}

export default Matrix;