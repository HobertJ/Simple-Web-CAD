import Point from "Base/point";

interface Renderable {
    drawMethod(gl: WebGLRenderingContext): number;
    isDrawable(): boolean;
    draw(point: Point): void;
    getNumberOfVerticesToBeDrawn(): number;
    addPosition(gl: WebGLRenderingContext): void;
    addColor(gl: WebGLRenderingContext): void;
}

export default Renderable