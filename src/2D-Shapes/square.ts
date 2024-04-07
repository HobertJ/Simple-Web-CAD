import Renderable from "./Interfaces/renderable.interface";
import Shape from "./shape";
import Transformation from "Main/Operations/Transformation";
import Transformable from "./Interfaces/transformable.interface";
import Point from "../Base/point";
import Type from "./type.enum";

class Square extends Shape implements Renderable, Transformable{
    public center: Point;
    public p1: Point;
    public p2: Point;
    public p3: Point;
    public p4: Point;
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
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }

    // Transformable Methods
    public getCenter() : Point{
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
        return this.p1 != null;
    }

    public draw(p1: Point): void {
        this.p1 = p1;
        this.p2 = Transformation.translation(this.center.getX(), this.center.getY())
                    .multiplyMatrix(Transformation.rotation(0.5 * Math.PI))
                    .multiplyMatrix(Transformation.translation(-this.center.getX(), -this.center.getY()))
                    .multiplyPoint(this.p1);
        this.p3 = Transformation.translation(this.center.getX(), this.center.getY())
                    .multiplyMatrix(Transformation.rotation(Math.PI))
                    .multiplyMatrix(Transformation.translation(-this.center.getX(), -this.center.getY()))
                    .multiplyPoint(this.p1);
        this.p4 = Transformation.translation(this.center.getX(), this.center.getY())
                    .multiplyMatrix(Transformation.rotation(1.5 * Math.PI))
                    .multiplyMatrix(Transformation.translation(-this.center.getX(), -this.center.getY()))
                    .multiplyPoint(this.p1);
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