import {vec3, matr} from './math.js'

export class camera {
/*
      camera( VOID ) :
        , Dir, , , ,
        ,
        FrameW(30), FrameH(30), Wp(0.1), Hp(0.1)
      {
        UpdateProj();
        UpdateView();
        VP = View * Proj;
     } */

    constructor() {
        this.Loc = new vec3(0, 0, 12);
        this.Dir = new vec3(0, 0, -1);
        this.Right = new vec3(1, 0, 0);
        this.Up = this.Right.cross(this.Dir).normalize();
        this.At = new vec3(0, 0, 0);
        this.ProjDist = 0.1;
        this.FarClip = 500;
        this.Size = 0.1;

        let canv = document.getElementById("glCanvas");
        this.FrameW = canv.width;
        this.FrameH = canv.height;

        this.UpdateProj();
        this.UpdateView();
        window.VP = this.VP = this.View.mulMatr(this.Proj);
        window.View = this.View;
        window.Proj = this.Proj;  
    }


    UpdateProj() {
        let 
          ratio_x = this.Size / 2, 
          ratio_y = this.Size / 2;
 
        if (this.FrameW >= this.FrameH)
          ratio_x *= this.FrameW / this.FrameH;
        else
          ratio_y *= this.FrameH / this.FrameW;
        this.Wp = 2 * ratio_x;
        this.Hp = 2 * ratio_y;
        this.Proj = matr.frustum(-ratio_x, ratio_x, -ratio_y, ratio_y, this.ProjDist, this.FarClip);
      } /* End of 'UpdateProj' function */
 

    UpdateView() {
        this.Dir = this.At.subVec(this.Loc).normalize();
        this.Right = this.Dir.cross(this.Up).normalize();

        this.View = matr.view(this.Loc, this.At, this.Up);
    }

    SetLocAtUp(L, A, U)
    {
      this.Loc = L;
      this.At = A;
      this.Up = U;

      this.UpdateView();
      window.VP = this.VP = this.View.mulMatr(this.Proj);
      window.View = this.View;
      window.Proj = this.Proj;
    }

    /*
      camera & SetProj( type NewSize, type NewProjDist, type NewFarClip )
      {
        ProjDist = NewProjDist;
        FarClip = NewFarClip;
        Size = NewSize;
 
        UpdateProj();
        VP = View * Proj;
        return *this;
      }
 
      camera & Resize( type NewFrameW, type NewFrameH )
      {
        FrameW = NewFrameW;
        FrameH = NewFrameH;
 
        UpdateProj();
        VP = View * Proj;
        return *this;
      }
 
      camera & Rotate( const vec3<type> &Axis, type AngleInDegree )
      {
        matr<type> m = matr<type>::Translate(-At) * matr<type>::RotateVec(Axis, AngleInDegree) * matr<type>::Translate(At);
        Loc = m.TransformPoint(Loc);
        Up = m.TransformVector(Up);
        SetLocAtUp(Loc, At, Up);
        return *this;
      }

      camera & Move( const vec3<type> &Direction )
      {
        Loc += Direction;
        At += Direction;
        SetLocAtUp(Loc, At, Up);
        return *this;
      }*/
    }
