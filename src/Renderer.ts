class Renderer {
  private canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext
  constructor() {
    console.log('Renderer created')
    this.canvas = document.createElement('canvas')
    const gl = this.canvas.getContext('webgl')

    if (gl === null) {
      alert('Unable to initialize WebGL. Your browser may not support it.')
      return
    }

    this.gl = gl

    document.body.appendChild(this.canvas)

    this.gl.clearColor(1.0, 0.0, 0.0, 1.0)
    this.gl.clear(gl.COLOR_BUFFER_BIT)

  }

  render() {
    console.log('Rendering game')
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }
}

export default Renderer