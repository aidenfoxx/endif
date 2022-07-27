import { Shader } from './Shader';

const vertexSource = `#version 300 es

layout(location = 0) in vec3 position;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {  
  gl_Position = projection * view * model * vec4(position, 1);
}`;
const fragmentSource = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(255, 0, 0, 1);
}`;

export class PhongShader extends Shader {
  constructor() {
    super(vertexSource, fragmentSource);
  }
}
