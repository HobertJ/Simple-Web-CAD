import Shape from "Main/2D-Shapes/shape";
import { render } from "./render";
import ProgramInfo from "./program-info.interface";
import Renderable from "Main/2D-Shapes/Interfaces/renderable.interface";
import Transformable from "Main/2D-Shapes/Interfaces/transformable.interface";

export function renderAll(gl: WebGLRenderingContext, programInfo: ProgramInfo, shapes: (Renderable&Transformable)[], positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer): void {
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    for (const shape of shapes) {
      render(gl, programInfo, shape, positionBuffer, colorBuffer)
    }
};