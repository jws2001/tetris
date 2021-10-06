import { IViewer, Point } from "./types"

//小方块
export class Square {
    //显示者
    private _viewer?: IViewer
    private _point: Point = {
        x: 0,
        y: 0
    }

    public get viewer() {
        return this._viewer
    }
    public set viewer(val: IViewer | undefined) {
        this._viewer = val;
        val?.show();
    }

    public get point() {
        return this._point
    }

    public set point(val: Point) {
        this._point = val;
        //完成显示
        if (this._viewer) {
            this._viewer.show();
        }
    }

    public get color() {
        return this._color
    }
    public constructor(private _color:string){

    }
}