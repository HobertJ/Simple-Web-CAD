import Renderable from "Main/2D-Shapes/Interfaces/renderable.interface";
import ProgramInfo from "./program-info.interface";
import Transformable from "Main/2D-Shapes/Interfaces/transformable.interface";

export function render(gl: WebGLRenderingContext, programInfo: ProgramInfo, object: Renderable & Transformable, positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer): void {
    if (!object.isDrawable()) {
      return;
    }
    // Add Position to gl buffer
    // console.log("kontolodon3");
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    object.addPosition(gl);
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );

    
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    object.addColor(gl);
    const colorSize = 4; /* 4 components per iteration */
    const colorType = gl.FLOAT; /* The data is 32 bit float */
    const colorNormalized = false; /* Don't normalize the data */
    const colorStride = 0; /* 0: Move forward size * sizeof(type) each iteration to get the next position */
    const colorOffset = 0; /* Start at the beginning of the buffer */
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      colorSize,
      colorType,
      colorNormalized,
      colorStride,
      colorOffset
    );
    
    
    // Add Matrix to gl
    const matrixLocation = programInfo.uniformLocations.matrixLocation
    object.addMatrix(gl, matrixLocation);
    /* Draw scene */
    const primitiveType = object.drawMethod(gl);
    // const offset = 0;
    const numberOfVerticesToBeDrawn = object.getNumberOfVerticesToBeDrawn();
    // console.log("kontolodon5");
    gl.drawArrays(primitiveType, offset, numberOfVerticesToBeDrawn);
}