import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

export interface Point {
    readonly x: number
    readonly y: number
}

export interface IViewer {
    //显示
    show(): void
    //移除不再显示
    remove(): void
}

export type Shape = Point[];

export enum MoveDirection {
    left,
    right,
    down,
    up
}

export enum GameStatus {
    //未开始
    init,
    //进行中
    playing,
    //暂停
    pause,
    //结束
    over
}

export interface GameViewer {
    /**
     * 
     * @param teris 下一个方块
     */
    showNext(teris: SquareGroup): void
    /**
     * 
     * @param teris 切换方块
     */
    switch(teris: SquareGroup): void

    /**
     * 完成界面的初始化
     */
    init(game: Game): void
    /**
     * 显示分数
     */
    showScore(score: number): void

    /**
     * 游戏开始
     */
    onGameStart():void

    /**
     * 游戏暂停
     */
    onGamePause():void

    /**
     *游戏结束
     */
    onGameOver():void
}