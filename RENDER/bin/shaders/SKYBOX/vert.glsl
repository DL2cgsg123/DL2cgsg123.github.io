#version 300 es
in vec3 in_pos;
in vec3 in_normal;
in vec2 in_texcoord;

out vec2 T;

void main( void ) 
{
  gl_Position = vec4(in_pos, 1.0);
  T = in_pos.xy;
}