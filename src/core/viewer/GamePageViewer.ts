import { SquareGroup } from "../SquareGroup";
import { GameStatus, GameViewer } from "../types";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery"
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
    onGameStart(): void {
        this.msgDom.hide();
    }
    onGamePause(): void {
        this.msgDom.css({
            display:'flex',
        });
        this.msgDom.find('.msg-text').css({backgroundColor:"sandybrown"}).html('游戏暂停')
    }
    onGameOver(): void {
        this.msgDom.css({
            display:'flex',
        });
        this.msgDom.find('.msg-text').css({backgroundColor:"darkred"}).html('游戏结束')
    }
    showScore(score: number): void {
        this.scoreDOm.html(score.toString())
    }

    private nextDom = $('#next');
    private panelDom = $('#panel');
    private scoreDOm = $('#score');
    private msgDom = $('#msg')

    init(game: Game): void {
        //设置宽高
        this.panelDom.css({
            width: GameConfig.panelSize.width * PageConfig.SquareSize,
            height: GameConfig.panelSize.height * PageConfig.SquareSize
        })

        this.nextDom.css({
            width: GameConfig.nextSize.width * PageConfig.SquareSize,
            height: GameConfig.nextSize.height * PageConfig.SquareSize
        })

        window.addEventListener('keydown', e => {
                switch (e.code) {
                case "Space":
                    if (game.gameStatuc === GameStatus.pause) {
                        game.start();
                    } else if (game.gameStatuc === GameStatus.playing) {
                        game.pause();
                    } else {
                        game.start();
                    }
                    break;
                case "ArrowDown":
                    game.controlDown();
                    break;
                case "ArrowRight":
                    game.controlRight();
                    break;
                case "ArrowLeft":
                    game.controlLeft();
                    break;
                case "ArrowUp":
                    game.controRotate();
                    break;
                default:
                    break;
            }
        })
    }
    showNext(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, this.nextDom)
        })
    }
    switch(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer!.remove()
            sq.viewer = new SquarePageViewer(sq, this.panelDom)
        })
    }

}