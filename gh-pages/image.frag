precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

float grain (vec2 st, float t) {
    return fract(sin(dot(st.xy, vec2(17.0,180.))) * 2500. + t);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = texture2D(iChannel0, uv);
    color = mix(color, vec4(grain(uv, iTime * 1.0)), 0.04);
    gl_FragColor = color;
}