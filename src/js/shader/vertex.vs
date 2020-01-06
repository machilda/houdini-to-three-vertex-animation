precision highp float;
varying vec2 vUv;
varying vec4 vColor;
uniform sampler2D colorMap;
uniform sampler2D posMap;
uniform float posMax;
uniform float posMin;
attribute float _id;
uniform float fps;
uniform float totalNum;
uniform float totalFrame;


void main() {
    vUv = uv;
    float frag = 1.0 / totalNum;
    float range = posMax + (posMin * -1.0);
    float pu = frag * _id;
   
    float test = 1.0;
    // float pv = 1.0 -fract(test/totalFrame);
    float pv = 1.0 -fract(fps/totalFrame);

	vec3 tPosition = texture2D(posMap,vec2(pu, pv)).rgb;
    vec3 calcPos = vec3(tPosition.r * range, tPosition.g * range, tPosition.b * range); 
    vec3 testPos = vec3(posMin + calcPos.r, posMin + calcPos.g, posMin + calcPos.b);
    
    vec3 tColor = texture2D(colorMap, vec2(pu, pv)).rgb;
    vColor = vec4(tColor, 1.0);

    // vec4 pos = vec4(vec3(testPos.r - 1.5, 0.0 ,0.0), 1.0 );
    // vColor = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(testPos.r, testPos.b ,0.0) + position, 1.0 );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}