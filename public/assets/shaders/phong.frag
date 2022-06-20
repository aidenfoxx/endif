#version 300 es

precision highp float;

const vec3 lightPosition = vec3(4.0, 4.0, 4.0);
const vec3 diffuseColor = vec3(1.0, 0.0, 0.0);
const vec3 ambientColor = vec3(0.1, 0.1, 0.1);
const vec3 specularColor = vec3(0.2, 0.2, 0.2);

uniform sampler2D diffuseTexture;

in vec3 vertexPosition;
in vec2 uvPosition;
in vec3 normalInterp;

out vec4 fragColor;

void main() {
  vec3 normal = normalize(normalInterp);
  vec3 light = normalize(lightPosition - vertexPosition);

  float lambertian = max(dot(light, normal), 0.0);
  float specular = 0.0;

  if (lambertian > 0.0) {
    vec3 viewDirection = normalize(-vertexPosition);
    vec3 reflectDirection = reflect(-light, normal);

    float specularAngle = max(dot(reflectDirection, viewDirection), 0.0);
    specular = pow(specularAngle, 4.0);
  }

  vec4 diffuse = texture(diffuseTexture, uvPosition);
  fragColor = diffuse * vec4(ambientColor + lambertian + specular * specularColor, 1.0);
  //fragColor = vec4(ambientColor + lambertian * diffuseColor + specular * specularColor, 1.0);
}
