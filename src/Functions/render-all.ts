import { render } from "Functions/render";
import ProgramInfo from "Functions/program-info.interface";
import Renderable from "Interfaces/renderable.interface";
import Transformable from "Interfaces/transformable.interface";

export function renderAll(gl: WebGLRenderingContext, programInfo: ProgramInfo, shapes: (Renderable&Transformable)[], positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer): void {
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    for (const shape of shapes) {
      render(gl, programInfo, shape, positionBuffer, colorBuffer)
    }
};