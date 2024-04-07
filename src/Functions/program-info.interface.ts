interface ProgramInfo {
    program: WebGLProgram,
    attribLocations: {
        vertexPosition: number,
        vertexColor: number,
    },
    uniformLocations: {
        matrixLocation: WebGLUniformLocation | null,
    },
}

export default ProgramInfo