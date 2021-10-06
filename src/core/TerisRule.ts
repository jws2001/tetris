import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";

function isPoint(obj: any): obj is Point {
    if (typeof obj.x === "undefined") {
        return false
    }
    return true
}

/**
 * 该类中提供一系列的函数 根据游戏规则判断各种情况
 */
export class TerisRule {
    /**
     * 判断某个形状是否可以移动到目标位置
     * @param params 
     * @returns 
     */
    static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
        //假设移动到了 targetPoint位置 算出每一个小方块的坐标
        const targetSquarePoints: Point[] = shape.map(it => {
            return {
                x: it.x + targetPoint.x,
                y: it.y + targetPoint.y
            }
        })
        //编辑判断
        if (targetSquarePoints.some(p => {
            //是否超出了边际
            return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1
        })) {
            return false
        }

        //判断是否与存在的方块冲突
        if (targetSquarePoints.some(p => exists.some(sq => sq.point.x === p.x && sq.point.y === p.y))) {
            return false;
        }
        return true;
    }
    static move(teris: SquareGroup, targetPointOrDirection: Point, exists: Square[]): boolean
    static move(teris: SquareGroup, targetPointOrDirection: MoveDirection, exists: Square[]): boolean
    static move(teris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exists: Square[]): boolean {
        if (isPoint(targetPointOrDirection)) {
            if (this.canIMove(teris.shape, targetPointOrDirection, exists)) {
                teris.centerPoint = targetPointOrDirection
                return true
            }
            return false;
        }
        else {
            const direction = targetPointOrDirection;
            let targetPoint: Point;

            switch (direction) {
                case MoveDirection.down:
                    targetPoint = {
                        x: teris.centerPoint.x,
                        y: teris.centerPoint.y + 1
                    }
                    break;
                case MoveDirection.left:
                    targetPoint = {
                        x: teris.centerPoint.x - 1,
                        y: teris.centerPoint.y
                    }
                    break;
                default:
                    targetPoint = {
                        x: teris.centerPoint.x + 1,
                        y: teris.centerPoint.y
                    }
                    break;
            }
            return this.move(teris, targetPoint, exists)
        }

    }

    /**
     * 移动方块 到不能移动为止
     * @param teris 
     * @param direction 
     */
    static moveDirectly(teris: SquareGroup, direction: MoveDirection, exists: Square[]) {
        while (this.move(teris, direction, exists)) { }
    }


    /**
     * 旋转判断规则
     */
    static rotate(teris: SquareGroup, exists: Square[]): boolean {
        //得到旋转新的形状
        const newShape = teris.afterRotateShape();
        if (this.canIMove(newShape, teris.centerPoint, exists)) {
            teris.rotate();
            return true
        } else {
            return false
        }
    }

    static deleteSquares(exists: Square[]): number {
        //获得y坐标
        const ys = exists.map(p => p.point.y);
        //获取最大的y坐标
        const maxY = Math.max(...ys);
        //获取最小y坐标
        const minY = Math.min(...ys);
        //循环判断每一样 是否可以消除
        let num = 0;
        for (let y = minY; y <= maxY; y++) {
            this.deleteLine(exists, y) && num++;
        }
        return num;
    }

    /**
     * 消除一行
     * @param exists 
     * @param y 
     */
    static deleteLine(exists: Square[], y: number): boolean {
        const squares = exists.filter(sq => sq.point.y === y)
        if (squares.length === GameConfig.panelSize.width) {
            //这一行可以消除
            squares.forEach(sq => {
                //从界面移除
                sq.viewer && sq.viewer.remove();
                //从数据中移除
                const index = exists.indexOf(sq);
                exists.splice(index, 1)
            })
            //比当y小的坐标向下 + 1
            exists.filter(sq => sq.point.y < y).forEach(sq => {
                sq.point = {
                    x: sq.point.x,
                    y: sq.point.y + 1
                }
            })
            return true
        }
        return false
    }

}