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
        const [a11, a21, a31] = otherMatrix.m1;
        const [a12, a22, a32] = otherMatrix.m2;
        const [a13, a23, a33] = otherMatrix.m3;

        const [b11, b12, b13] = this.m1;
        const [b21, b22, b23] = this.m2;
        const [b31, b32, b33] = this.m3;

        const c11 = b11 * a11 + b21 * a21 + b31 * a31
        const c12 = b11 * a12 + b21 * a22 + b31 * a32
        const c13 = b11 * a13 + b21 * a23 + b31 * a33
        const c21 = b12 * a11 + b22 * a21 + b32 * a31
        const c22 = b12 * a12 + b22 * a22 + b32 * a32
        const c23 = b12 * a13 + b22 * a23 + b32 * a33
        const c31 = b13 * a11 + b23 * a21 + b33 * a31
        const c32 = b13 * a12 + b23 * a22 + b33 * a32
        const c33 = b13 * a13 + b23 * a23 + b33 * a33

        const matrix = new Matrix([c11, c21, c31], [c12, c22, c32], [c13, c23, c33]);
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