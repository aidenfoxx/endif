#version 300 es

precision highp float;

uniform sampler2D diffuseTexture;

in vec2 uvPosition;

out vec4 fragColor;

void main() {
  fragColor = texture(diffuseTexture, uvPosition);
}
