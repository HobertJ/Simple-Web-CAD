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
        this.arrayOfPoints.push(p1);

        if (this.arrayOfPoints.length === 1) {
            for (let i = 1; i <= 3; i++) {
                const angle = (i * Math.PI) / 2;
                const rotationMatrix = Transformation.translation(this.center.getX(), this.center.getY())
                    .multiplyMatrix(Transformation.rotation(angle))
                    .multiplyMatrix(Transformation.translation(-this.center.getX(), -this.center.getY()));
                const rotatedPoint = rotationMatrix.multiplyPoint(p1);
                this.arrayOfPoints.push(rotatedPoint);
            }
        }
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return this.arrayOfPoints.length;
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

export default Square;
