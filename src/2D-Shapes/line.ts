import Renderable from "./Interfaces/renderableinterface";
import Transformable from "./Interfaces/transformable.interface";
import Shape from "./shape";
import Type from "./type.enum";
import Point from "../Base/point";

class Line extends Shape implements Renderable, Transformable {

    public type: Type.Line;
    public p1: Point;
    public p2: Point;

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
        this.p1 = p1;
        this.p2 = null;
    }

    public getCenter(): Point {
        const [p1x, p1y] = this.p1.getPair();
        const [p2x, p2y] = this.p2.getPair();

        const centerX = (p1x + p2x) / 2;
        const centerY = (p1y + p2y) / 2;

        return new Point([centerX, centerY], [0, 0, 0, 0]);
    }

    public updatePoint(point: Point): void {
        if (this.p2 === null) {
            this.p2 = point;
        } else {
            this.p2 = point;
        }
    }

    public addPosition(gl: WebGLRenderingContext): void {
        const [p1x, p1y] = this.p1.getPair();
        const [p2x, p2y] = this.p2.getPair();

        const vertices = new Float32Array([
            p1x, p1y,
            p2x, p2y
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    public addColor(gl: WebGLRenderingContext): void {
        const [r, g, b, a] = this.p1.getColor();
        const colors = new Float32Array([
            r, g, b, a,
            r, g, b, a
        ]);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
    
    public drawMethod(gl: WebGLRenderingContext): number {
        return gl.LINES;
    }

    public getNumberOfVertices(): number {
        return this.numberOfVertices;
    }

    public isDrawable(): boolean {
        return this.p2 !== null;
    }

    public fixateDrawing(point: Point): void {
        this.p2 = point;
    }
}

export default Line;