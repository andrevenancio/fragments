export const vertexShader = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}`;

export const composeFragment = (fragment?: string) => {
  const factory = `void mainImage(out vec4 fragColor, in vec2 fragCoord) { fragColor.rgb = vec3(0.5 + 0.5 * cos(uTime), 1.0, 1.0);}`;

  return `
  #ifdef GL_OES_standard_derivatives
  #extension GL_OES_standard_derivatives : enable
  #endif
  #extension GL_EXT_shader_texture_lod : enable
  #ifdef GL_ES
  precision highp float;
  precision highp int;
  #endif

  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;

  uniform sampler2D iInput;

  ${fragment || factory}

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = texture2D(iInput, uv);

    mainImage(color, gl_FragCoord.xy);

    gl_FragColor = color;
  }
  `;
};
