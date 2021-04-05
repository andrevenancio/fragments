import { createProgram } from "./program"
import { vertexShader, composeFragment } from "./shaders"

export class Fragment {
  program: WebGLProgram
  uniforms: object
  attributes: object

  constructor(gl: WebGLRenderingContext, fragment?: string) {
    this.attributes = {}
    this.uniforms = {}

    this.program = createProgram(gl, vertexShader, composeFragment(fragment))
  }

  getAttribute(gl: WebGLRenderingContext, name: string) {
    if (!this.attributes[name]) {
      this.attributes[name] = gl.getAttribLocation(this.program, name)
    }

    return this.attributes[name]
  }

  getUniform(gl: WebGLRenderingContext, name: string) {
    if (!this.uniforms[name]) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name)
    }

    return this.uniforms[name]
  }

  setU1f(gl: WebGLRenderingContext, name: string, x: number) {
    gl.uniform1f(this.getUniform(gl, name), x)
  }

  setU2f(gl: WebGLRenderingContext, name: string, x: number, y: number) {
    gl.uniform2f(this.getUniform(gl, name), x, y)
  }

  setU2fv(gl: WebGLRenderingContext, name: string, v2: any) {
    gl.uniform2fv(this.getUniform(gl, name), v2)
  }

  setU1i(gl: WebGLRenderingContext, name: string, level: number) {
    gl.uniform1i(this.getUniform(gl, name), level)
  }
}
