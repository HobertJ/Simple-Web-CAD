import ProgramInfo from "./program-info.interface";


// Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
export function setAttributes(gl: WebGLRenderingContext, positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, programInfo:ProgramInfo ) {
    
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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
    
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
}  