//const gl_matrix = require("../glMatrix-0.9.5.min.js");
class math {
    static D2R(A) {return (A) * (Math.PI / 180.0)}
}

export class vec3 {
    constructor(X, Y, Z) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }

    cross(V) {
        return new vec3(this.Y * V.Z - V.Y * this.Z,
                        this.Z * V.X - V.Z * this.X,
                        this.X * V.Y - V.X * this.Y);
    }

    dot(V) {
        return this.X * V.X + this.Y * V.Y + this.Z * V.Z;
    }

    addVec(V){
        return new vec3(this.X + V.X,
                        this.Y + V.Y,
                        this.Z + V.Z);
    }

    subVec(V){
        return new vec3(this.X - V.X,
                        this.Y - V.Y,
                        this.Z - V.Z);
    }

    mulByNum(N){
        return new vec3(this.X * N,
                        this.Y * N,
                        this.Z * N);
    }

    divByNum(N){
        return new vec3(this.X / N,
                        this.Y / N,
                        this.Z / N);
    }

    length() {
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }

    normalize() {
        let L = this.length();

        if (L != 0)
          return this.divByNum(L);
        else
          return new vec3(0, 0, 0);
    }
}

export class vec4 {
    constructor(X, Y, Z, W) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.W = W;
    }
}

export class vec2 {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }
}

export class matr {
    constructor(a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                a30, a31, a32, a33) {
        this.Data = [];
        let i;
        for (i = 0; i < 4; i++)
            this.Data[i] = [];
        this.Data[0 * 4 + 0] = a00;
        this.Data[0 * 4 + 1] = a01;
        this.Data[0 * 4 + 2] = a02;
        this.Data[0 * 4 + 3] = a03;
        this.Data[1 * 4 + 0] = a10;
        this.Data[1 * 4 + 1] = a11;
        this.Data[1 * 4 + 2] = a12;
        this.Data[1 * 4 + 3] = a13;
        this.Data[2 * 4 + 0] = a20;
        this.Data[2 * 4 + 1] = a21;
        this.Data[2 * 4 + 2] = a22;
        this.Data[2 * 4 + 3] = a23;
        this.Data[3 * 4 + 0] = a30;
        this.Data[3 * 4 + 1] = a31;
        this.Data[3 * 4 + 2] = a32;
        this.Data[3 * 4 + 3] = a33;
    }

    static identity() {
        return new matr(1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1);
    }

    static frustum(L, R, B, T, N, F) {
        return new matr(2 * N / (R - L), 0, 0, 0,
                        0, 2 * N / (T - B), 0, 0,
                        (R + L) / (R - L), (T + B) / (T - B), -(F + N) / (F - N), -1,
                        0, 0, -2 * N * F / (F - N), 0);
    } 

    static view(Loc, At, Up1) {
        let D = At.subVec(Loc).normalize(),
            R = D.cross(Up1).normalize(),
            U = R.cross(D);

        return new matr(R.X, U.X, -D.X, 0,
                        R.Y, U.Y, -D.Y, 0,
                        R.Z, U.Z, -D.Z, 0,
                        -(Loc.dot(R)), -(Loc.dot(U)), Loc.dot(D), 1);
    }

    mulMatr(M) {
        let r = new matr();
        let k, i, j;
 
        for (i = 0; i < 4; i++)
          for (j = 0; j < 4; j++)
            for (r.Data[i * 4 + j] = 0, k = 0; k < 4; k++)
              r.Data[i * 4 + j] += this.Data[i * 4 + k] * M.Data[k * 4 + j];
        return r;
    }

    static rotateVec(V, A){
        A = math.D2R(A);
        let c = Math.cos(A), s = Math.sin(A);

        return new matr(c + V.X * V.X * (1 - c),       V.X * V.Y * (1 - c) + V.Z * s, V.X * V.Z * (1 - c) - V.Y * s, 0,  
                        V.Y * V.X * (1 - c) - V.Z * s,       c + V.Y * V.Y * (1 - c), V.Y * V.Z * (1 - c) + V.X * s, 0,
                        V.Z * V.X * (1 - c) + V.Y * s, V.Z * V.Y * (1 - c) - V.X * s, c + V.Z * V.Z * (1 - c)      , 0,
                                                    0,                             0,                             0, 1);
      
    }

    static translate(V) {
        let res = matr.identity();
 
        res.Data[3 * 4 + 0] = V.X;
        res.Data[3 * 4 + 1] = V.Y;
        res.Data[3 * 4 + 2] = V.Z;
        return res;
    }

    static scale(S) {
        return new matr(S.X, 0, 0, 0,
                        0, S.Y, 0, 0,
                        0, 0, S.Z, 0,
                        0, 0, 0, 1);
    }
}