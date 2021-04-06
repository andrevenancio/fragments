precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iInput;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = texture2D(iInput, uv);
    color.a = 1.0;
    // color.x = 1.0;
    if (uv.x > 0.5) {
        gl_FragColor = color;
    } else {
        gl_FragColor =  vec4(uv, 0.0, 1.0);
    }
}