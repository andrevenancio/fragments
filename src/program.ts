export const createShader = (
  gl: WebGLRenderingContext,
  str: string,
  type: number
) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, str)
  gl.compileShader(shader)

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (!compiled) {
    const error = gl.getShaderInfoLog(shader)
    console.error("Error compiling shader", shader, error)
    gl.deleteShader(shader)

    return null
  }

  return shader
}

export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: string,
  fragmentShader: string
) => {
  const vs = createShader(gl, vertexShader, gl.VERTEX_SHADER)
  const fs = createShader(gl, fragmentShader, gl.FRAGMENT_SHADER)

  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  return program
}
