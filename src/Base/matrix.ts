import Coordinate from './coordinate';
import Point from './point';

class Matrix {
    public m1: Coordinate;
    public m2: Coordinate;
    public m3: Coordinate;

    public constructor(m1: Coordinate, m2: Coordinate, m3: Coordinate) {
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
    }

    public getMatrix(): [Coordinate, Coordinate, Coordinate] {
        return [this.m1, this.m2, this.m3];
    }

    public flatten() : number[] {
        return [...this.m1.getCoordinate(), ...this.m2.getCoordinate(), ...this.m3.getCoordinate()]
    }

    public multiplyMatrix(otherMatrix: Matrix): Matrix {
        const b11 = this.m1.getX() * otherMatrix.m1.getX() + this.m1.getY() * otherMatrix.m2.getX() + this.m1.getW() * otherMatrix.m3.getX();
        const b12 = this.m1.getX() * otherMatrix.m1.getY() + this.m1.getY() * otherMatrix.m2.getY() + this.m1.getW() * otherMatrix.m3.getY();
        const b13 = this.m1.getX() * otherMatrix.m1.getW() + this.m1.getY() * otherMatrix.m2.getW() + this.m1.getW() * otherMatrix.m3.getW();
        const b21 = this.m2.getX() * otherMatrix.m1.getX() + this.m2.getY() * otherMatrix.m2.getX() + this.m2.getW() * otherMatrix.m3.getX();
        const b22 = this.m2.getX() * otherMatrix.m1.getY() + this.m2.getY() * otherMatrix.m2.getY() + this.m2.getW() * otherMatrix.m3.getY();
        const b23 = this.m2.getX() * otherMatrix.m1.getW() + this.m2.getY() * otherMatrix.m2.getW() + this.m2.getW() * otherMatrix.m3.getW();
        const b31 = this.m3.getX() * otherMatrix.m1.getX() + this.m3.getY() * otherMatrix.m2.getX() + this.m3.getW() * otherMatrix.m3.getX();
        const b32 = this.m3.getX() * otherMatrix.m1.getY() + this.m3.getY() * otherMatrix.m2.getY() + this.m3.getW() * otherMatrix.m3.getY();
        const b33 = this.m3.getX() * otherMatrix.m1.getW() + this.m3.getY() * otherMatrix.m2.getW() + this.m3.getW() * otherMatrix.m3.getW();
        
        const b1 = new Coordinate(b11, b12, b13);
        const b2 = new Coordinate(b21, b22, b23);
        const b3 = new Coordinate(b31, b32, b33);

        const matrix = new Matrix(b1, b2, b3);
        return matrix;
    }

    
    public multiplyPoint(point: Point): Point {
        const [a11, a21, a31] = this.m1.getCoordinate();
        const [a12, a22, a32] = this.m2.getCoordinate();
        const [a13, a23, a33] = this.m3.getCoordinate();

        const x1 = a11 * point.x + a12 * point.y + a13 * point.w;
        const y1 = a21 * point.x + a22 * point.y + a23 * point.w;
        
        const newPoint = new Point([x1, y1]);

        return newPoint;
    }
}

export default Matrix;