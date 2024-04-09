import Renderable from "Main/2D-Shapes/Interfaces/renderable.interface";
import ProgramInfo from "./program-info.interface";
import Transformable from "Main/2D-Shapes/Interfaces/transformable.interface";

export function render(gl: WebGLRenderingContext, programInfo: ProgramInfo, object: Renderable & Transformable, positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer): void {
    if (!object.isDrawable()) {
      return;
    }
    // Add Position to gl buffer
    console.log("kontolodon3");
    object.addPosition(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    console.log("kontolodon4");
    // Add Color to gl buffer
    object.addColor(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Add Matrix to gl
    const matrixLocation = programInfo.uniformLocations.matrixLocation
    object.addMatrix(gl, matrixLocation);


    /* Draw scene */
    const primitiveType = object.drawMethod(gl);
    const offset = 0;
    const numberOfVerticesToBeDrawn = object.getNumberOfVerticesToBeDrawn();
    console.log("kontolodon5");
    gl.drawArrays(primitiveType, offset, numberOfVerticesToBeDrawn);
}