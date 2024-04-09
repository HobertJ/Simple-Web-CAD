import Renderable from "./Interfaces/renderable.interface";
import Transformable from "./Interfaces/transformable.interface";
import Shape from "./shape";
import Type from "./type.enum";
import Point from "../Base/point";
import Transformation from "Main/Operations/Transformation";

class Line extends Shape implements Renderable, Transformable {

    public type: Type.Line;
    public arrayOfPoints: Point[];

    public center: Point;
    public tx: number;
    public ty: number;
    public degree: number;
    public sx: number;
    public sy: number;
    public kx: number;
    public ky: number;

    public constructor(id: number, p1: Point) {
        super(id, 2, Type.Line);
        this.arrayOfPoints = [p1];
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }

    // Transformable Methods
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
            this.getCenter()
          ).flatten();
      
          gl.uniformMatrix3fv(matrixLocation, false, matrix);
    }

    public getCenter(): Point {
        const numPoints = this.arrayOfPoints.length;
        let centerX = 0;
        let centerY = 0;
        for (const point of this.arrayOfPoints) {
            const [x, y] = point.getPair();
            centerX += x;
            centerY += y;
        }
        centerX /= numPoints;
        centerY /= numPoints;

        return new Point([centerX, centerY], [0, 0, 0, 0]);
    }

    public drawMethod(gl: WebGLRenderingContext): number {
        return gl.LINES;
    }

    public isDrawable(): boolean {
        return this.arrayOfPoints.length === 2;
    }

    public draw(point: Point): void {
        this.arrayOfPoints[1] = point;
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return 2;
    } 
    
    public addPosition(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([...this.arrayOfPoints[0].getPair(), ...this.arrayOfPoints[1].getPair()]),
            gl.STATIC_DRAW
          );
    }

    public addColor(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([...this.arrayOfPoints[0].getColor(), ...this.arrayOfPoints[1].getColor()]),
            gl.STATIC_DRAW
          );
    }  

    public setLineAttributes(tx: number, ty: number, degree: number, sx: number, sy: number, kx: number, ky: number, p2: Point): void {
        this.arrayOfPoints.push(p2);
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
    }
}

export default Line;
