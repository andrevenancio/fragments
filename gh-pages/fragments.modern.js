const t=(t,e,i)=>{const s=t.createShader(i);if(t.shaderSource(s,e),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS)){const e=t.getShaderInfoLog(s);return console.error("Error compiling shader",s,e),t.deleteShader(s),null}return s};class e{constructor(e,i){this.attributes={},this.uniforms={},this.program=((e,i,s)=>{const r=t(e,"\nattribute vec2 position;\nvoid main() {\n    gl_Position = vec4(position, 0.0, 1.0);\n}",e.VERTEX_SHADER),h=t(e,s,e.FRAGMENT_SHADER),n=e.createProgram();return e.attachShader(n,r),e.attachShader(n,h),e.linkProgram(n),n})(e,0,i)}getAttribute(t,e){return this.attributes[e]||(this.attributes[e]=t.getAttribLocation(this.program,e)),this.attributes[e]}getUniform(t,e){return this.uniforms[e]||(this.uniforms[e]=t.getUniformLocation(this.program,e)),this.uniforms[e]}setU1f(t,e,i){t.uniform1f(this.getUniform(t,e),i)}setU2f(t,e,i,s){t.uniform2f(this.getUniform(t,e),i,s)}setU2fv(t,e,i){t.uniform2fv(this.getUniform(t,e),i)}setU1i(t,e,i){t.uniform1i(this.getUniform(t,e),i)}}class i{constructor(t,e,i,s){this.width=1,this.height=1,this.level=s,this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture);const r=t.RGBA,h=t.RGBA,n=t.UNSIGNED_BYTE,o=new Uint8Array([0,255,255,255]);t.texImage2D(t.TEXTURE_2D,this.level,r,this.width,this.height,0,h,n,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.fbo=t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.texture,this.level),t.bindFramebuffer(t.FRAMEBUFFER,null)}setSize(t,e,i){this.width=e,this.height=i,t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,this.width,this.height,0,t.RGBA,t.UNSIGNED_BYTE,null),t.bindTexture(t.TEXTURE_2D,null),t.bindFramebuffer(t.FRAMEBUFFER,null)}}class s{constructor(t={}){this.props={autoClear:!0,autoUpdate:!1},this.onBlur=()=>{this.pause=!0},this.onFocus=()=>{this.pause=!1},this.onMove=t=>{this.mouse[0]=t.clientX,this.mouse[1]=t.clientY},this.getNext=t=>(t+1)%2,Object.assign(this.props,t),this.width=320,this.height=240,this.mouse=new Float32Array(2),this.fragments=[],this.rendertargets=[],this.currentrt=0,this.loaded=0,this.ready=!1,this.pause=!1,this.now=Date.now(),window.WebGLRenderingContext?this.init():console.error("Your browser doesn't support WebGL")}useFragment(t){this.gl.useProgram(t.program),this.gl.enableVertexAttribArray(t.getAttribute(this.gl,"position")),this.gl.vertexAttribPointer(t.getAttribute(this.gl,"position"),2,this.gl.FLOAT,!1,0,0),t.setU2f(this.gl,"iResolution",this.width,this.height),t.setU1f(this.gl,"iTime",(Date.now()-this.now)/1e3),t.setU2fv(this.gl,"iMouse",this.mouse)}init(){const t=document.createElement("canvas");t.width=this.width,t.height=this.height,t.style.display="block",document.body.appendChild(t),window.addEventListener("mousemove",this.onMove),this.gl=t.getContext("webgl"),this.gl.getExtension("OES_texture_float"),this.gl.getExtension("OES_standard_derivatives"),this.gl.getExtension("OES_float_linear"),this.gl.getExtension("OES_half_float_linear"),this.gl||console.error("Couldn't start WebGL. Try get.webgl.org/troubleshooting"),console.log.apply(console,["\n%cfragments%crenderer%c (dev)\n","background: #00ffff; color: #1A1A1A; font-size: x-small;","background: #1A1A1A; color: #00ffff; font-size: x-small;","background: transparent; color: #999999; font-size: x-small;"]),this.originalImageTexture=new i(this.gl,512,512,0);const e=new i(this.gl,512,512,1),s=new i(this.gl,512,512,2);this.rendertargets=[e,s];const r=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]);this.quadbuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.quadbuffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,r,this.gl.STATIC_DRAW)}setSize(t,e){this.width=t,this.height=e,this.gl.canvas.width=this.width,this.gl.canvas.height=this.height,this.gl.viewport(0,0,this.width,this.height),this.originalImageTexture.setSize(this.gl,this.width,this.height),this.rendertargets.forEach(t=>{t.setSize(this.gl,this.width,this.height)})}loadFragment(t){this.ready=!1;const e=this.fragments.length;this.fragments.push(null),fetch(t).then(t=>t.text()).then(t=>this.raw(t,e))}raw(t,i){this.ready=!1;const s=new e(this.gl,t);"number"==typeof i?this.fragments[i]=s:this.fragments.push(s),this.loaded++,this.fragments.length===this.loaded&&(this.ready=!0)}clear(t=0,e=0,i=0,s=1){this.gl.clearColor(t,e,i,s),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}render(){if(!0===this.ready&&!this.pause){this.props.autoClear&&this.clear(),this.gl.bindTexture(this.gl.TEXTURE_2D,this.originalImageTexture.texture);for(let t=0;t<this.fragments.length;++t)console.log("draw fragment",t,"to render target",t%2),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.rendertargets[t%2].fbo),this.useFragment(this.fragments[t]),this.gl.viewport(0,0,this.width,this.height),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.gl.bindTexture(this.gl.TEXTURE_2D,this.rendertargets[t%2].texture);this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.useFragment(this.fragments[this.fragments.length-1]),this.gl.viewport(0,0,this.width,this.height),this.gl.drawArrays(this.gl.TRIANGLES,0,6)}}}export{s as Renderer};
//# sourceMappingURL=fragments.modern.js.map