#define FREQUENCY 20.0
#define SPEED 2.0
#define OFFSET 0.5

float drawCircle(vec2 uv, vec2 offset) {
    float ratio = iResolution.x / iResolution.y;
	float d = length(uv - vec2(0.5 * ratio, 0.5) - offset);
    float c = cos(d * FREQUENCY - iTime * SPEED);
	c *= 500.0;
	return c;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord/iResolution.y;
	
    float c = 0.0;
    
    // "original" circle
    c += drawCircle(uv, vec2(0.0));
    
    // horizontal displacement
    float h = cos(iTime);
	c += mix(c, drawCircle(uv, vec2(-OFFSET, 0.0)), h);
    c += mix(c, drawCircle(uv, vec2(OFFSET, 0.0)), h);
	
    // vertical displacement
    float v = sin(iTime);
    c += mix(c, drawCircle(uv, vec2(0.0, -OFFSET)), v);
    c += mix(c, drawCircle(uv, vec2(0.0, OFFSET)), v);
    
    // antialias as suggested by @FabriceNeyret2
    c = c / fwidth(c);

    fragColor = vec4(c);
}