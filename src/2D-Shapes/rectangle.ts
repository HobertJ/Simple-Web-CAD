import Shape from "2DShapes/shape";
import Point from "Base/point";
import Type from "2DShapes/type.enum";
import Renderable from "Main/2D-Shapes/Interfaces/renderable.interface";
import Transformable from "2DShapes/Interfaces/transformable.interface";
import Transformation from "Main/Operations/Transformation";

class Rectangle extends Shape implements Renderable, Transformable {
    public p1: Point;
    public p2: Point;
    public p3: Point;
    public p4: Point;
    public center: Point;
    public tx: number;
    public ty: number;
    public degree: number;
    public sx: number;
    public sy: number;
    public kx: number;
    public ky: number;
    

    public constructor(id: number, center: Point, tx: number, ty: number, degree: number, sx: number, sy: number, kx: number, ky: number, p1: Point){
        super(id, 4, Type.Rectangle);
        this.center = center;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
        this.p1 = p1;
        this.p2 = null;
        this.p3 = null;
        this.p4 = null;
    }

    // Transformable Methods
    public getCenter(): Point {
        const [p1x, p1y] = this.p1.getPair();
        const [p2x, p2y] = this.p2.getPair();
        const [p3x, p3y] = this.p3.getPair();
        const [p4x, p4y] = this.p4.getPair();

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
        return this.p3 != null;
    }

    public draw(point: Point): void {
        this.p3 = point;
        this.p2 = new Point([this.p1.x, this.p3.y]);
        this.p4 = new Point([this.p3.x, this.p1.y]);
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return 5;
    }

    public addPosition(gl: WebGLRenderingContext): void {
        const [p1x, p1y] = this.p1.getPair();
        const [p2x, p2y] = this.p2.getPair();
        const [p3x, p3y] = this.p3.getPair();
        const [p4x, p4y] = this.p4.getPair();

        const vertices = new Float32Array([
            p1x, p1y,
            p2x, p2y,
            p3x, p3y,
            p4x, p4y,
            p1x, p1y
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    public addColor(gl: WebGLRenderingContext): void {
        const [r1, g1, b1, a1] = this.p1.getColor();
        const [r2, g2, b2, a2] = this.p2.getColor();
        const [r3, g3, b3, a3] = this.p3.getColor();
        const [r4, g4, b4, a4] = this.p4.getColor();

        const colors = new Float32Array([
            r1, g1, b1, a1,
            r2, g2, b2, a2,
            r3, g3, b3, a3,
            r4, g4, b4, a4,
            r1, g1, b1, a1,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
}