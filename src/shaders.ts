export const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

export const composeFragment = (fragment?: string) => {
  const factory = `void mainImage(out vec4 fragColor, in vec2 fragCoord) { fragColor = vec4(1.0);}`

  return `#ifdef GL_ES
precision highp float;
#endif

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

${fragment || factory}

void main() {
  vec4 color = vec4(vec3(0.0), 1.0); // TODO: change to input texture
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`
}
