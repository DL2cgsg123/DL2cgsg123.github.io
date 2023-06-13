#version 300 es
precision highp float;

uniform float Time;
uniform mat4 MatrWVP;

in vec3 N;

out vec4 theColor;

void main( void ) 
{
  theColor = vec4(abs(N.x), abs(N.y), abs(N.z), 1.0);
}
    