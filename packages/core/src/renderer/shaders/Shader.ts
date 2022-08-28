import { createProgram } from "../../utils/gl/shader";
import { Context } from "../Context";
import { CAMERA_BUFFER_INDEX, MATERIAL_BUFFER_INDEX } from "../Scene";

export class Shader {
  private gl: WebGL2RenderingContext;

  private program?: WebGLProgram;

  constructor(public readonly vertexSource: string, public readonly fragmentSource: string) {
    this.gl = Context.getContent();
  }

  public bind(): void {
    if (!this.program) {
      const program = createProgram(this.gl, this.vertexSource, this.fragmentSource);
      const cameraBlockIndex = this.gl.getUniformBlockIndex(program, 'Camera');
      const materialBlockIndex = this.gl.getUniformBlockIndex(program, 'Material');
  
      this.gl.uniformBlockBinding(program, cameraBlockIndex, CAMERA_BUFFER_INDEX);
      this.gl.uniformBlockBinding(program, materialBlockIndex, MATERIAL_BUFFER_INDEX);
  
      this.program = program;
    }

    this.gl.useProgram(this.program);
  }
}
