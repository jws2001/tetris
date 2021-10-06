import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import { GameStatus, GameViewer, MoveDirection } from "./types";

export class Game {
    //游戏状态
    private _gameStatuc: GameStatus = GameStatus.init;
    //当前玩家操作的方块
    private _curTeris?: SquareGroup
    //下一个方块
    private _nextTeris: SquareGroup;
    //计时器
    private _timer?: number
    //自动下落的间隔时间
    private _duration: number = 1000;
    //当前游戏中、已经存在的方块
    private _exists: Square[] = [];
    //积分
    private _score: number = 0;

    public get score(){
        return this._score
    }

    public set score(n: number) {
        this._score = n;
        this._viewer.showScore(this._score)
    }

    public get gameStatuc(){
        return this._gameStatuc
    }

    public constructor(private _viewer: GameViewer) {
        this._nextTeris = createTeris({ x: 0, y: 0 });//没有实际含义的代码 就是为了 ts不报错
        this.createNext()
        this._viewer.init(this)
        this._viewer.showScore(this._score)
    }
    private createNext() {
        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris)
        this._viewer.showNext(this._nextTeris);
    }

    private init() {
        this._exists.forEach(sq => {
            sq.viewer && sq.viewer.remove();
        })
        this._exists = [];
        this.createNext();
        this._curTeris = undefined;
        this.score = 0;
    }

    /**
     * 
     * @returns 游戏开始
     */
    start() {
        if (this._gameStatuc === GameStatus.playing) {
            return;
        }
        //从游戏结束到开始
        if (this._gameStatuc === GameStatus.over) {
            //初始化操作
            this.init();
        }
        this._gameStatuc = GameStatus.playing;
        if (!this._curTeris) {
            //给当前的方块赋值
            this.switchTeris();
        }
        this.autoDrop();
        this._viewer.onGameStart();
    }

    /**
     * 游戏暂停
     */
    pause() {
        if (this._gameStatuc === GameStatus.playing) {
            this._gameStatuc = GameStatus.pause;
            window.clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGamePause()
        }
    }

    /**
     * 向左移动
     */
    controlLeft() {
        if (this._curTeris && this._gameStatuc === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.left, this._exists)
        }
    }
    /**
     * 向右移动
     */
    controlRight() {
        if (this._curTeris && this._gameStatuc === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.right, this._exists)
        }
    }
    /**
     * 向下移动
     */
    controlDown() {
        if (this._curTeris && this._gameStatuc === GameStatus.playing) {
            TerisRule.moveDirectly(this._curTeris, MoveDirection.down, this._exists)
            this.hitBootm();
        }
    }
    /**
     * 旋转
     */
    controRotate() {
        if (this._curTeris && this._gameStatuc === GameStatus.playing) {
            TerisRule.rotate(this._curTeris, this._exists)
        }
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        if (this._timer || this._gameStatuc !== GameStatus.playing) {
            return
        }
        this._timer = window.setInterval(() => {
            if (this._curTeris) {
                !TerisRule.move(this._curTeris, MoveDirection.down, this._exists) && this.hitBootm();
            }
        }, this._duration)
    }

    /**
     * 切换当前方块为下一个方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris;
        this._curTeris.squares.forEach(sq => {
            sq.viewer && sq.viewer.remove();
        })
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris)
        //有可能当前方块出现时 就和之前的方块重叠了
        if (!TerisRule.canIMove(this._curTeris.shape, this._curTeris.centerPoint, this._exists)) {
            //游戏结束
            this._gameStatuc = GameStatus.over;
            window.clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGameOver();
            return;
        }

        this.createNext();
        this._viewer.switch(this._curTeris)

    }

    /**
     * 设置中心点坐标 使该方块出现在 next区域的中心
     * @param width 
     * @param teris 
     */
    private resetCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.ceil(width / 2);
        let y = 0;
        teris.centerPoint = { x, y };
        while (teris.squares.some(sq => sq.point.y < 0)) {
            teris.centerPoint = {
                x: teris.centerPoint.x,
                y: teris.centerPoint.y + 1
            }
        }
    }

    /**
     * 触底之后的操作
     */
    private hitBootm() {
        //将当前触底的一组拆分小方块 加入到数组中
        this._exists = this._exists.concat(this._curTeris!.squares);
        //处理移除
        const num = TerisRule.deleteSquares(this._exists);
        //增加积分
        this.addScore(num);
        //切换方块
        this.switchTeris();
    }
    private addScore(lineNum: number) {
        this.score += lineNum * 2
    }
}