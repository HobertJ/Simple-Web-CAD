import Renderable from "Main/2D-Shapes/Interfaces/renderable.interface";
import ProgramInfo from "./program-info.interface";
import Transformable from "Main/2D-Shapes/Interfaces/transformable.interface";

export function render(gl: WebGLRenderingContext, programInfo: ProgramInfo, object: Renderable & Transformable): void {
    if (!object.isDrawable()) {
      return;
    }
    // Add Position to gl buffer
    object.addPosition(gl);
    
    // Add Color to gl buffer
    object.addColor(gl);

    // Add Matrix to gl
    const matrixLocation = programInfo.uniformLocations.matrixLocation
    object.addMatrix(gl, matrixLocation);


    /* Draw scene */
    const primitiveType = object.drawMethod(gl);
    const offset = 0;
    const numberOfVerticesToBeDrawn = object.getNumberOfVerticesToBeDrawn();

    gl.drawArrays(primitiveType, offset, numberOfVerticesToBeDrawn);
}