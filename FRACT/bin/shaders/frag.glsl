#version 300 es
precision highp float;

uniform float Time;

uniform float Width;
uniform float Height;

uniform float TransX;
uniform float TransY;

uniform float Scale;
uniform float MouseX;
uniform float MouseY;

out vec4 theColor;

float Mandl( vec2 P ) {
  vec2 Z = P, C = Z;
  int i = 0, max_iter_num = 100 /* !!!! */;

  while (Z.x * Z.x + Z.y * Z.y <= 4.0 && i < max_iter_num)
    Z = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y) + C, i++;
  return float(i);
}

vec2 divFract( vec2 Z1, vec2 Z2 ) {
  float tmp = Z2.x * Z2.x + Z2.y * Z2.y;
  return vec2((Z1.x * Z2.x + Z1.y * Z2.y) / tmp,
               (Z1.y * Z2.x - Z1.x * Z2.y) / tmp);
}

float Newton( vec2 P ) {
  vec2 Z = P, C = Z;
  int i = 0, max_iter_num = 500 /* !!!! */;

  while (Z.x * Z.x + Z.y * Z.y <= 4.0 && i < max_iter_num)
  {
    vec2 
      Z2 = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y),
      Z3 = vec2(Z.x * Z2.x - Z.y * Z2.y, Z.x * Z2.y + Z.y * Z2.x) - vec2(1.0, 0.0),
      Zpr = Z2 * 3.0;
    Z = Z - divFract(Z3, Zpr);
    i++;
  }
  return float(i);
}

void main() {
  vec2 X0;
  
  if (Scale != 1.0) {
    float S = clamp(Scale, 0.2, 10.0);
    //float 
    //  MX = clamp(MouseX, 0.0, Width),
    //  MY = clamp(MouseY, 0.0, Height);

    X0 = vec2(gl_FragCoord.x * S - TransX,
              gl_FragCoord.y * S + TransY);
  }
  else
    X0 = vec2(gl_FragCoord.x - TransX, gl_FragCoord.y + TransY);
  vec2 
    XS = vec2(X0.x / Width, X0.y / Height),
    X1 = XS * 4.0 - 2.0;
  float c = float(Newton(X1)) * 10.0;
  theColor = vec4(c * 0.003, c * 0.003 + 0.1, c * 0.008 + 0.1, 1.0);
}
    