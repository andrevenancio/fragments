export declare class RenderTarget {
    texture: WebGLTexture;
    fbo: WebGLFramebuffer;
    width: number;
    height: number;
    level: number;
    constructor(gl: WebGLRenderingContext, width: number, height: number, level: number);
    setSize(gl: WebGLRenderingContext, width: number, height: number): void;
}
