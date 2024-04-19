import Shape from "Shapes/shape";
import Point from "Base/point";
import Type from "Shapes/type.enum";
import Renderable from "Interfaces/renderable.interface";
import Transformable from "Interfaces/transformable.interface";
import Transformation from "Operations/Transformation";

class Rectangle extends Shape implements Renderable, Transformable {
    public arrayOfPoints: Point[];
    public center: Point;
    public tx: number;
    public ty: number;
    public degree: number;
    public sx: number;
    public sy: number;
    public kx: number;
    public ky: number;

    public constructor(id: number,  p1: Point){
        super(id, 4, Type.Rectangle);
        this.arrayOfPoints = [p1, null, null, null];
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
        const [p1x, p1y] = this.arrayOfPoints[0].getPair();
        const [p2x, p2y] = this.arrayOfPoints[1].getPair();
        const [p3x, p3y] = this.arrayOfPoints[2].getPair();
        const [p4x, p4y] = this.arrayOfPoints[3].getPair();

        const centerX = (p1x + p2x + p3x + p4x) / 4;
        const centerY = (p1y + p2y + p3y + p4y) / 4;
        
        return new Point([centerX, centerY]);
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
        // return this.arrayOfPoints.filter(point => point !== null).length === 4;
        return this.arrayOfPoints[2] !== null;
    }

    public draw(point: Point): void {
        this.arrayOfPoints[1] = new Point([this.arrayOfPoints[0].x, point.y]);
        this.arrayOfPoints[2] = point;
        this.arrayOfPoints[3] = new Point([point.x, this.arrayOfPoints[0].y]);
        this.center = this.getCenter();
    }

    public reDraw(point: Point, info: String): void {
        switch(info){
            case "p1":
                this.arrayOfPoints[0] = new Point(point.getPair(), this.arrayOfPoints[0].getColor());
                this.arrayOfPoints[1] = new Point([point.x, this.arrayOfPoints[1].y], this.arrayOfPoints[1].getColor());
                this.arrayOfPoints[3] = new Point([this.arrayOfPoints[3].x, point.y], this.arrayOfPoints[3].getColor());
                break;
            case "p2":
                this.arrayOfPoints[0] = new Point([point.x, this.arrayOfPoints[0].y], this.arrayOfPoints[0].getColor());
                this.arrayOfPoints[1] = new Point(point.getPair(), this.arrayOfPoints[1].getColor());
                this.arrayOfPoints[2] = new Point([this.arrayOfPoints[2].x, point.y], this.arrayOfPoints[2].getColor());
                break;
            case "p3":
                this.arrayOfPoints[1] = new Point([this.arrayOfPoints[1].x, point.y], this.arrayOfPoints[1].getColor());
                this.arrayOfPoints[2] = new Point(point.getPair(), this.arrayOfPoints[2].getColor());
                this.arrayOfPoints[3] = new Point([point.x, this.arrayOfPoints[3].y], this.arrayOfPoints[3].getColor());
                break;
            case "p4":
                this.arrayOfPoints[0] = new Point([this.arrayOfPoints[0].x, point.y], this.arrayOfPoints[0].getColor());
                this.arrayOfPoints[2] = new Point([point.x, this.arrayOfPoints[2].y], this.arrayOfPoints[2].getColor());
                this.arrayOfPoints[3] = new Point(point.getPair(), this.arrayOfPoints[3].getColor());
                break;
        }
        this.center = this.getCenter();
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

    public setRectangleAttributes(tx: number, ty: number, degree: number, sx: number, sy: number, kx: number, ky: number, arrayOfPoints: Point[]): void {
        this.arrayOfPoints = arrayOfPoints;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
        this.center = this.getCenter();
    }
}

export default Rectangle;
