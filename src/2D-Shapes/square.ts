import Renderable from "./Interfaces/renderable.interface";
import Shape from "./shape";
import Transformation from "Main/Operations/Transformation";
import Transformable from "./Interfaces/transformable.interface";
import Point from "../Base/point";
import Type from "./type.enum";

class Square extends Shape implements Renderable, Transformable {
    public center: Point;
    public arrayOfPoints: Point[];
    public tx: number;
    public ty: number;
    public degree: number;
    public sx: number;
    public sy: number;
    public kx: number;
    public ky: number;

    public constructor(id: number, centerPoint: Point) {
        super(id, 4, Type.Square);
        this.center = centerPoint;
        this.arrayOfPoints = [];
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }

    // Transformable Methods
    public getCenter(): Point {
        return this.center;
    }
    
    public addMatrix(gl: WebGLRenderingContext, matrixLocation: WebGLUniformLocation): void {
        const matrix = Transformation.transformationMatrix(
            gl.canvas.width,
            gl.canvas.height,
            this.tx,
            this.ty,
            this.degree,
            this.sx,
            this.sy,
            this.kx,
            this.ky,
            this.center
        ).flatten();

        gl.uniformMatrix3fv(matrixLocation, false, matrix);
    }

    // Renderable Methods
    public drawMethod(gl: WebGLRenderingContext): number {
        return gl.TRIANGLE_FAN;
    }

    public isDrawable(): boolean {
        return this.arrayOfPoints.length === 4;
    }

    public draw(p1: Point): void {
        this.arrayOfPoints[0] = p1;

        for (let i = 1; i <= 3; i++) {
            const angle = (i * Math.PI) / 2;
            const rotationMatrix = Transformation.translation(this.center.getX(), this.center.getY())
                .multiplyMatrix(Transformation.rotation(angle))
                .multiplyMatrix(Transformation.translation(-this.center.getX(), -this.center.getY()));
            const rotatedPoint = rotationMatrix.multiplyPoint(p1);
            this.arrayOfPoints[i] = rotatedPoint;
        }
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return 5;
    }

    public addPosition(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
              ...this.arrayOfPoints[0].getPair(),
              ...this.arrayOfPoints[1].getPair(),
              ...this.arrayOfPoints[2].getPair(),
              ...this.arrayOfPoints[3].getPair(),
              ...this.arrayOfPoints[0].getPair(),
            ]),
            gl.STATIC_DRAW
          );
    }

    public addColor(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
              ...this.arrayOfPoints[0].getColor(),
              ...this.arrayOfPoints[1].getColor(),
              ...this.arrayOfPoints[2].getColor(),
              ...this.arrayOfPoints[3].getColor(),
              ...this.arrayOfPoints[0].getColor(),
            ]),
            gl.STATIC_DRAW
          );
    }

    public setSquareAttributes(tx: number, ty: number, degree: number, sx: number, sy: number, kx: number, ky: number, arrayOfPoints: Point[]): void {
        this.arrayOfPoints = arrayOfPoints;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
    }
}

export default Square;
