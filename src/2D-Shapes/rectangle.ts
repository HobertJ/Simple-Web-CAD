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
        return this.center;
    }

    public isDrawable(): boolean {
        return this.p3 != null;
    }

    public fixateDrawing(point: Point): void {
        this.center = point;
    }

    public drawMethod(gl: WebGLRenderingContext): number {
        return 0;
    }

    public getNumberOfVertices(): number {
        return this.numberOfVertices;
    }

    public addPosition(gl: WebGLRenderingContext): void {
        return;
    }

    public addColor(gl: WebGLRenderingContext): void {
        return;
    }
}