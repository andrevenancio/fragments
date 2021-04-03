export declare const vertexShader = "\nattribute vec2 position;\nvoid main() {\n    gl_Position = vec4(position, 0.0, 1.0);\n}";
export declare const fragmentShader = "\nprecision highp float;\n\nuniform float uTime;\nuniform vec2 uResolution;\nuniform vec2 uMouse;\n\nvoid main() {\n    vec2 uv = gl_FragCoord.xy / uResolution.xy;\n    gl_FragColor = vec4(uv, 0.5 + 0.5 * cos(uTime), 1.0);\n}";
