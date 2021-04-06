precision highp float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = vec4(uv, 1.0, 1.0);
    gl_FragColor = color;
}