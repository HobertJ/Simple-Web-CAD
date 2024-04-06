import Shape from "2DShapes/shape";
import Point from "Base/point";
import Type from "2DShapes/type.enum";
import Renderable from "2DShapes/Interfaces/renderableinterface";
import Transformable from "2DShapes/Interfaces/transformable.interface";

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

    public getCenter(): Point {
        const [p1x, p1y] = this.p1.getPair();
        const [p2x, p2y] = this.p2.getPair();
        const [p3x, p3y] = this.p3.getPair();
        const [p4x, p4y] = this.p4.getPair();

        const centerX = (p1x + p2x + p3x + p4x) / 4;
        const centerY = (p1y + p2y + p3y + p4y) / 4;
        
        return new Point([centerX, centerY]);
    }

    public isDrawable(): boolean {
        return this.p3 != null;
    }

    public drawMethod(gl: WebGLRenderingContext): number {
        return gl.TRIANGLE_FAN;
    }

    public getNumberOfVertices(): number {
        return this.numberOfVertices;
    }

    public addPosition(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                ...this.p1.getPair(),
                ...this.p2.getPair(),
                ...this.p3.getPair(),
                ...this.p4.getPair(),
                ...this.p1.getPair(),
            ]),
            gl.STATIC_DRAW
        )
    }

    public addColor(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                ...this.p1.getColor(),
                ...this.p2.getColor(),
                ...this.p3.getColor(),
                ...this.p4.getColor(),
                ...this.p1.getColor(),
            ]),
            gl.STATIC_DRAW
        );
    }

    public draw(point: Point): void {
        this.p3 = point;
        this.p2 = new Point([this.p1.x, this.p3.y]);
        this.p4 = new Point([this.p3.x, this.p1.y]);
    }
}