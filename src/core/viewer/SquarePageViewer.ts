import { Square } from "../Square";
import $ from "jquery";
import { IViewer } from "../types";
import PageConfig from "./PageConfig";

/**
 * 显示一个小方块到页面上
 */
export class SquarePageViewer implements IViewer {
    private dom?: JQuery<HTMLElement>
    private isRemove: boolean = false;
    public constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) {

    }
    show(): void {
        if (this.isRemove) {
            return
        }
        if (!this.dom) {
            this.dom = $('<div>').css({
                position: "absolute",
                width: PageConfig.SquareSize,
                height: PageConfig.SquareSize,
                border: PageConfig.border,
                boxSizing: "border-box",
                backgroundColor: this.square.color
            })
        }

        this.dom.css({
            left: this.square.point.x * PageConfig.SquareSize,
            top: this.square.point.y * PageConfig.SquareSize
        }).appendTo(this.container)
    }
    remove(): void {
        if (!this.isRemove && this.dom) {
            this.dom.remove()
        }
        this.isRemove = true;
        return
    }
}