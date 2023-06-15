#version 300 es
in vec3 in_pos;
in vec3 in_normal;
in vec2 in_texcoord;

uniform mat4 MatrWVP;
out vec3 N;
out vec2 T;
out vec4 P;

void main( void ) 
{
  gl_Position = MatrWVP * vec4(in_pos, 1.0);
  P = gl_Position;
  N = in_normal;
  T = in_texcoord;
}