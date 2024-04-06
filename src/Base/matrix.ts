import Coordinate from './coordinate';
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
        const [m1, m2, m3] = this.getMatrix();
        const [o1, o2, o3] = otherMatrix.getMatrix();
        const newM1 = new Coordinate(
            m1.x * o1.x + m1.y * o2.x + m1.w * o3.x,
            m1.x * o1.y + m1.y * o2.y + m1.w * o3.y,
            m1.x * o1.w + m1.y * o2.w + m1.w * o3.w
        );
        const newM2 = new Coordinate(
            m2.x * o1.x + m2.y * o2.x + m2.w * o3.x,
            m2.x * o1.y + m2.y * o2.y + m2.w * o3.y,
            m2.x * o1.w + m2.y * o2.w + m2.w * o3.w
        );
        const newM3 = new Coordinate(
            m3.x * o1.x + m3.y * o2.x + m3.w * o3.x,
            m3.x * o1.y + m3.y * o2.y + m3.w * o3.y,
            m3.x * o1.w + m3.y * o2.w + m3.w * o3.w
        );
        return new Matrix(newM1, newM2, newM3);
    }
    
}