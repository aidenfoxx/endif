#version 300 es

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;
layout(location = 2) in vec3 normal;

uniform mat4 modelView;
uniform mat4 projection;

out vec2 uvPosition;

void main() {  
  uvPosition = uv;
  gl_Position = projection * modelView * vec4(position, 1.0);
}
