
varying vec3 vColor;

void main() {
  vec4 transformedPosition = instanceMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * transformedPosition;
}
