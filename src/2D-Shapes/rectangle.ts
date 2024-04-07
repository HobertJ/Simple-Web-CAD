import Shape from "2DShapes/shape";
import Point from "Base/point";
import Type from "2DShapes/type.enum";
import Renderable from "Main/2D-Shapes/Interfaces/renderable.interface";
import Transformable from "2DShapes/Interfaces/transformable.interface";
import Transformation from "Main/Operations/Transformation";

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

    public constructor(
        id: number, 
        center: Point, 
        tx: number, 
        ty: number, 
        degree: number, 
        sx: number, 
        sy: number, 
        kx: number, 
        ky: number, 
        p1: Point
    ){
        super(id, 4, Type.Rectangle);
        this.arrayOfPoints = [p1, null, null, null];
        this.center = center;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
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
        return this.arrayOfPoints[2] !== null;
    }

    public draw(point: Point): void {
        this.arrayOfPoints[1] = new Point([this.arrayOfPoints[0].x, point.y]);
        this.arrayOfPoints[2] = point;
        this.arrayOfPoints[3] = new Point([point.x, this.arrayOfPoints[0].y]);
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return 5;
    }

    public addPosition(gl: WebGLRenderingContext): void {
        const vertices = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getPair());
            return acc;
        }, [] as number[]));

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    public addColor(gl: WebGLRenderingContext): void {
        const colors = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getColor());
            return acc;
        }, [] as number[]));

        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
}

export default Rectangle;
