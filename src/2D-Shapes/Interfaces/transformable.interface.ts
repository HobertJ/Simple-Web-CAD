import Point from "../../Base/point";

interface Transformable {
    center: Point;
    tx: number;
    ty: number;
    degree: number;
    sx: number;
    sy: number;
    kx: number;
    ky: number;
    getCenter(): Point;
    addMatrix(gl:WebGLRenderingContext, matrixLocation: WebGLUniformLocation) : void;
}

export default Transformable