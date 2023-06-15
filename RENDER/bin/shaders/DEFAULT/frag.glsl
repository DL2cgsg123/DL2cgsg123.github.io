#version 300 es
precision highp float;

uniform float Time;
uniform mat4 MatrWVP;

in vec3 N;
in vec2 T;
in vec4 P;

out vec4 theColor;
uniform sampler2D Texture0;

uniform samplerCube Texture1;

void main( void ) 
{
  //theColor = texture(Texture0, T);
  vec3 Res = normalize(P.xyz + N * 10.0);//normalize(P + N * 10.0);
  theColor = texture(Texture1, Res);
}
    