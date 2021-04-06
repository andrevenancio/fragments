export declare const vertexShader = "\nattribute vec2 position;\nvoid main() {\n    gl_Position = vec4(position, 0.0, 1.0);\n}";
export declare const composeFragment: (fragment?: string) => string;
