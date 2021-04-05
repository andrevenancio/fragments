# @andrevenancio/fragments

This library allows for composing shaders by chaining multiple "fragments" together where the input of the current fragment if the output of the previous fragment.

## Fragment

A fragment is simply a snippet of code in GLSL that receives an input and performs some manipulation to it.

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    fragColor = vec4(1.0);
}
```

Behind the scenes this snippet gets injected into

## Usage

A simple example using a external `.frag` file

```javascript
import { Renderer } from "@andrevenancio/fragments"

const renderer = new Renderer()
renderer.loadFragment("test.frag")
renderer.setSize(window.innerWidth, window.innerHeight)
```

```glsl
pass1.frag
precision highp float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = vec4(uv, 1.0, 1.0);
    gl_FragColor = color;
}
```

```glsl
pass2.frag
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = texture2D(iChannel0, uv);
    color.y = 0.5 + 0.5 * cos(iTime);
    color.y +=0.01;
    gl_FragColor = color;
}
```
