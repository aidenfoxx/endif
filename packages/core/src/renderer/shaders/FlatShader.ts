import { Shader } from './Shader';

const vertexSource = `#version 300 es

layout(location = 0) in vec3 position;
layout(location = 3) in vec2 texCoord0;
layout(location = 10) in mat4 model2; // TODO: Remove me

layout(std140) uniform Camera {
  mat4 model;
  mat4 view;
  mat4 projection;
};

out vec2 texCoord;

void main() {
  texCoord = texCoord0;
  gl_Position = projection * view * model * vec4(position, 1);
}`;
const fragmentSource = `#version 300 es
precision highp float;

layout(std140) uniform Material {
  vec4 diffuseFactor;
  float metallicFactor;
  float roughnessFactor;
  vec3 emissiveFactor;
};

uniform sampler2D diffuseTexture;

in vec2 texCoord;

out vec4 outColor;

void main() {
  outColor = texture(diffuseTexture, texCoord);
}`;

export class FlatShader extends Shader {
  constructor() {
    super(vertexSource, fragmentSource);
  }
}
