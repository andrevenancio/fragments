void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    fragColor = vec4(uv, 0.5 + 0.5 * cos(iTime), 1.0);
}