export declare class Fragment {
    program: WebGLProgram;
    uniforms: object;
    attributes: object;
    constructor(gl: WebGLRenderingContext, fragment?: string);
    getAttribute(gl: WebGLRenderingContext, name: string): any;
    getUniform(gl: WebGLRenderingContext, name: string): any;
    setU1f(gl: WebGLRenderingContext, name: string, x: number): void;
    setU2f(gl: WebGLRenderingContext, name: string, x: number, y: number): void;
    setU2fv(gl: WebGLRenderingContext, name: string, v2: any): void;
    setU1i(gl: WebGLRenderingContext, name: string, level: number): void;
}
