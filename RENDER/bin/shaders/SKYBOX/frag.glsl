#version 300 es
precision highp float;

out vec4 theColor;
uniform samplerCube Texture0;
uniform mat4 InvProj;
uniform mat4 InvView;

in vec2 T;

vec3 EvalTexCoord( vec2 PosOnScreen )
{
  vec3 Vec = vec3(PosOnScreen.xy * 2.0, 1.0);
  Vec = (InvProj * vec4(Vec, 1.0)).xyz;

  return normalize(InvView * vec4(Vec, 0.0)).xyz;
}

void main( void ) 
{
    theColor = texture(Texture0, EvalTexCoord(T));
}
    