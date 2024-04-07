import Point from "../../Base/point";

interface Renderable {
    drawMethod(gl: WebGLRenderingContext): number;
    isDrawable(): boolean;
    getNumberOfVerticesToBeDrawn(): number;
    addPosition(gl: WebGLRenderingContext): void;
    addColor(gl: WebGLRenderingContext): void;
    addMatrix(gl:WebGLRenderingContext, matrixLocation: WebGLUniformLocation) : void;
}

export default Renderable