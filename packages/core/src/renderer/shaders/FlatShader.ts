import { Shader } from "./Shader";

const vertexSource = `#version 300 es

void main() {  
  gl_Position = vec4(0, 0, 0, 1);
}`;
const fragmentSource = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(0, 0, 0, 0);
}`;

export class FlatShader extends Shader {
  constructor() {
    super(vertexSource, fragmentSource);
  }
}