# @andrevenancio/fragments

This library allows for composing shaders by chaining multiple "fragments" together where the input of the current fragment if the output of the previous fragment.

## Fragment

A fragment is simply a snippet of code in GLSL that receives an input and performs some manipulation to it.

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    fragColor = vec4(1.0);
}
```

## Usage

A simple example using a 2external `.frag` file

```javascript
import { Renderer } from "@andrevenancio/fragments"

let renderer

const setup = () => {
  renderer = new Renderer()
  renderer.loadFragment("pass1.frag")
  renderer.loadFragment("pass2.frag")
  renderer.setSize(window.innerWidth, window.innerHeight)
  window.addEventListener("resize", resize)
}

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const update = () => {
  renderer.render()
  requestAnimationFrame(update)
}

setup()
update()
```

pass1.frag

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    fragColor = vec4(uv, 0.5 + 0.5 * cos(iTime), 1.0);
}
```

pass2.frag

```glsl
float grain (vec2 st, float t) {
    return fract(sin(dot(st.xy, vec2(17.0,180.))) * 2500. + t);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    fragColor = mix(texture2D(iInput, uv), vec4(vec3(grain(uv, iTime * 0.5)), 1.0), 0.04);
}
```
