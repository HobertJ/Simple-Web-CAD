import Point from "../../Base/point";

interface Renderable {
    // renderable method
    drawMethod(gl: WebGLRenderingContext): number;
    getNumberOfVertices(): number;
    addPosition(gl: WebGLRenderingContext): void;
    addColor(gl: WebGLRenderingContext): void;
}

export default Renderable