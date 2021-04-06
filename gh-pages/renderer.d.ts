import { Fragment } from "./fragment";
import { RenderTarget } from "./rendertarget";
interface RendererProps {
    autoClear: boolean;
    autoUpdate: boolean;
}
export declare class Renderer {
    width: number;
    height: number;
    mouse: Float32Array;
    fragments: Fragment[];
    rendertargets: RenderTarget[];
    originalImageTexture: RenderTarget;
    quadbuffer: WebGLBuffer;
    currentrt: number;
    loaded: number;
    ready: boolean;
    pause: boolean;
    now: number;
    gl: WebGLRenderingContext;
    props: RendererProps;
    constructor(props?: Partial<RendererProps>);
    private onBlur;
    private onFocus;
    private onMove;
    private useFragment;
    private init;
    setSize(width: number, height: number): void;
    loadFragment(url: string): void;
    raw(fragment: string, optionalIndex?: number): void;
    clear(r?: number, g?: number, b?: number, a?: number): void;
    private getNext;
    render(): void;
}
export {};
