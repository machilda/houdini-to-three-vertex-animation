precision highp float;
varying vec2 vUv;
varying vec4 vColor;
uniform sampler2D colorMap;
uniform sampler2D posMap;
uniform sampler2D normalMap;
uniform float posMax;
uniform float posMin;
attribute float _id;
attribute vec3 _initpos;
attribute vec3 _nn;
uniform float fps;
const float frag = 1.0 / 7.0;
void main() {
    vUv = uv;
    float range = posMax + (posMin * -1.0);
    float pu = frag * _id;
   
    float test = 0.0;
    float pv = 1.0 -fract(fps/239.0);

    vec3 tNormal = texture2D(normalMap,vec2(pu, pv)).rgb;

	vec3 tPosition = texture2D(posMap,vec2(pu, pv)).rgb;
    vec3 calcPos = vec3(tPosition.r * range, tPosition.g * range, tPosition.b * range); 
    vec3 testPos = vec3(posMin + calcPos.r, posMin + calcPos.g, posMin + calcPos.b);
    
    vec3 tColr = texture2D(colorMap, vec2(pu, pv)).rgb;
    vColor = vec4(tColr, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(testPos.r, 0.0, 0.0) + position, 1.0 );

    // if(tPosition.r <= 1.0) {
    //    vColor = vec4(1.0, 0.0, 0.0, 1.0);
    // }

    // if(range >= 1.8){
    //     vColor = vec4(1.0, 0.0, 0.0, 1.0);
    // }
}