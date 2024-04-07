import Transformation from "Main/Operations/Transformation";
import Renderable from "./Interfaces/renderable.interface";
import Transformable from "./Interfaces/transformable.interface";
import Shape from "./shape";
import Type from "./type.enum";
import Point from "Main/Base/point";

class Polygon extends Shape implements Renderable, Transformable {
    public type: Type.Polygon;
    public arrayOfPoints: Point[];

    public center: Point;
    public tx: number;
    public ty: number;
    public degree: number;
    public sx: number;
    public sy: number;
    public kx: number;
    public ky: number;

    public constructor(id: number, arrayOfPoints: Point[]) {
        super(id, arrayOfPoints.length, Type.Polygon);

        this.type = Type.Polygon;
        this.arrayOfPoints = arrayOfPoints;

        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;

    }

    public getCenter(): Point {
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const [x, y] = this.arrayOfPoints[i].getPair();
            sumX += x;
            sumY += y;
        }

        const centerX = sumX / this.arrayOfPoints.length;
        const centerY = sumY / this.arrayOfPoints.length;

        return new Point([centerX, centerY], [0, 0, 0, 0]);
    }

    public isDrawable(): boolean {
        return this.arrayOfPoints.length >= 3;
    }

    public draw (point: Point): void {
        this.arrayOfPoints.push(point);
    }

    public drawMethod(gl: WebGLRenderingContext): number {
        return this.isDrawable() ? gl.TRIANGLE_FAN : gl.LINES;
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return this.arrayOfPoints.length + 1;
    }

    public addPosition(gl: WebGLRenderingContext): void {
        const vertices = new Float32Array(this.arrayOfPoints.length * 2);

        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const [x, y] = this.arrayOfPoints[i].getPair();
            vertices[i * 2] = x;
            vertices[i * 2 + 1] = y;
        }

        const [pInitialX, pInitialY] = this.arrayOfPoints[0].getPair();
        vertices[this.arrayOfPoints.length * 2] = pInitialX;
        vertices[this.arrayOfPoints.length * 2 + 1] = pInitialY;

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    public addColor(gl: WebGLRenderingContext): void {
        const colors = new Float32Array(this.arrayOfPoints.length * 4);

        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const [r, g, b, a] = this.arrayOfPoints[i].getColor();
            colors[i * 4] = r;
            colors[i * 4 + 1] = g;
            colors[i * 4 + 2] = b;
            colors[i * 4 + 3] = a;
        }

        const [rInitial, gInitial, bInitial, aInitial] = this.arrayOfPoints[0].getColor();
        colors[this.arrayOfPoints.length * 4] = rInitial;
        colors[this.arrayOfPoints.length * 4 + 1] = gInitial;
        colors[this.arrayOfPoints.length * 4 + 2] = bInitial;
        colors[this.arrayOfPoints.length * 4 + 3] = aInitial;

        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
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
    
}

export default Polygon;