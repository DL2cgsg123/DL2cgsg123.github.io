#version 300 es
in vec3 in_pos;
in vec3 in_normal;

uniform mat4 MatrWVP;
out vec3 N;

void main( void ) 
{
  gl_Position = MatrWVP * vec4(in_pos, 1.0);
  N = in_normal;
  //gl_Position = vec4(in_pos, 1.0);
}