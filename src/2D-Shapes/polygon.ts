import Transformation from "Operations/Transformation";
import Renderable from "Interfaces/renderable.interface";
import Transformable from "Interfaces/transformable.interface";
import Shape from "Shapes/shape";
import Type from "Shapes/type.enum";
import Point from "Base/point";
import convexHull from "Operations/convex-hull";

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

    public constructor(id: number, point: Point) {
        super(id, 1, Type.Polygon);
        this.arrayOfPoints = new Array(point);
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
        return this.arrayOfPoints.length >= 2;
    }

    public draw (point: Point): void {
        if (this.arrayOfPoints.length >= 3) {
            this.arrayOfPoints = convexHull([...this.arrayOfPoints, point]);
        } else {
            this.arrayOfPoints[this.arrayOfPoints.length] = point;
        }
        this.center = this.getCenter();
    }

    public drawMethod(gl: WebGLRenderingContext): number {
        return this.arrayOfPoints.length >=3 ? gl.TRIANGLE_FAN : gl.LINES;
    }

    public getNumberOfVerticesToBeDrawn(): number {
        return this.arrayOfPoints.length ;
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

    public deletePoint(index: number) {
        var newPoints: Point[] = [this.arrayOfPoints[index]];
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
          if (i != index) {
            newPoints.push(this.arrayOfPoints[i]);
          }
        }
    
        this.arrayOfPoints = newPoints.slice(1, this.arrayOfPoints.length);
    
        // after delete, need to setup option again
        const pointPicker = document.getElementById("pointPicker");
        pointPicker.innerHTML = "";
        pointPicker.replaceChildren();
        /* All Point */
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
          const newPoint = document.createElement("option");
          newPoint.value = i.toString();
          newPoint.text = "point_" + i;
          pointPicker.appendChild(newPoint);
        }
      }

      public setPolygonAttributes(tx: number, ty: number, degree: number, sx: number, sy: number, kx: number, ky: number, arrayOfPoints: Point[]): void {
        this.arrayOfPoints = arrayOfPoints;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
        this.numberOfVertices = arrayOfPoints.length;
        this.center = this.getCenter();
      }
    
}

export default Polygon;