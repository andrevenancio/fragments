import { Fragment } from "./fragment";
export declare class Renderer {
    width: number;
    height: number;
    fragments: Fragment[];
    mouse: Float32Array;
    ready: boolean;
    pause: boolean;
    gl: WebGLRenderingContext;
    now: number;
    constructor();
    private onBlur;
    private onFocus;
    private onMove;
    private useFragment;
    private init;
    setSize(width: number, height: number): void;
    loadFragment(url: string): void;
    raw(fragment: string): void;
    clear(r?: number, g?: number, b?: number, a?: number): void;
    render(): void;
}
