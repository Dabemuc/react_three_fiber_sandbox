uniform float uTime;
uniform float uAreaSize;
uniform vec3 uMeshUp;
varying vec2 vUv;

void main() {
  vUv = uv;

  float elevation = sin(uv.x * 10.0 + uTime * 2.0) * 0.6 +
                    sin(uv.y * 8.0 + uTime * 1.5) * 0.5;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.xyz += elevation * uMeshUp;
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
