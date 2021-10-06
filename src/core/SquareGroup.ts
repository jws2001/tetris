import { Square } from "./Square";
import { Point, Shape } from "./types";

export class SquareGroup {
    private _squares: readonly Square[];

    public get squares() {
        return this._squares
    }

    public get centerPoint(): Point {
        return this._centerPoint
    }


    public set centerPoint(newPoint: Point) {
        this._centerPoint = newPoint;
        //同时设置其他小方块的坐标
        this.setSquarePoint()
    }

    private setSquarePoint() {
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: this.centerPoint.x + p.x,
                y: this.centerPoint.y + p.y
            }
        })
    }

    public get shape() {
        return this._shape
    }


    public constructor(
        private _shape: Shape,
        private _centerPoint: Point,
        private _color: string
    ) {
        //设置小方块数组
        const arr: Square[] = [];
        this._shape.forEach(p => {
            const sq = new Square(this._color);
            arr.push(sq);
        })
        this._squares = arr;
        this.setSquarePoint();
    }

    /**
     * 旋转当时是否为顺时针
     */
    protected isClock = true;

    //根据当前的形状产生一个新的形状
    afterRotateShape(): Shape {
        if (this.isClock) {
            return this.shape.map(({ x, y }) => {
                return {
                    x: -y,
                    y: x
                }
            })
        } else {
            return this.shape.map(({ x, y }) => {
                return {
                    x: y,
                    y: -x
                }
            })
        }
    }

    rotate() {
        const newShape = this.afterRotateShape();
        this._shape = newShape;
        this.setSquarePoint();
    }
}