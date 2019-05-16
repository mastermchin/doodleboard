import { LightningElement, track } from 'lwc';
import fabricjs from '@salesforce/resourceUrl/fabricjs';
import { loadScript } from 'lightning/platformResourceLoader';

class BrushOptions {
    constructor() {
        this.color = "#000000";
        this.width = 1;
        this.shadowWidth = 0;
        this.shadowColor = "#000000";
        this.shadowOffset = 0;
        this.brushMode = "Pencil";
    }

    clone() {
        return Object.assign(new BrushOptions(), this);
    }

}

export default class DoodleBoard extends LightningElement {
    
    board;
    @track
    brush;
    @track
    savedata;
    fabric;
    brushModeOptions = [{label:"Pencil", value:"Pencil"},{label:"Circle", value:"Circle"}, {label:"Spray", value:"Spray"}, {label:"Pattern", value:"Pattern"}];

    constructor() {
        super();
        this.brush = new BrushOptions();
    }

    renderedCallback() {
        let canvas = this.template.querySelector("canvas");
        let container = this.template.querySelector(".canvas-container");
        let board;
        if(!this.board){
            loadScript(this, fabricjs).then(()=>{
                this.fabric = fabric;
                let height = container.offsetHeight;
                let width = container.offsetWidth;
                window.addEventListener('resize', resizeCanvas, false);
                board = new fabric.Canvas(canvas, {height, width});
                fabric.Object.prototype.transparentCorners = false;
                this.board = board;
                this.board.isDrawingMode = true;
                this.resetOptions();
            });
        }

        function resizeCanvas() {
            let height = container.offsetHeight;
            let width = container.offsetWidth;
            board.setHeight(height);
            board.setWidth(width);
            board.renderAll();
        }
    }

    clear() {
        this.board.clear();
        this.savedata = null;
    }

    resetOptions() {
        this.brush = new BrushOptions();
        this.setBrushOptions();
    }

    save() {
        this.savedata = this.board.toDataURL({format:"png"});
    }

    setBrushOptions() {
        this.board.freeDrawingBrush = new this.fabric[this.brush.brushMode + "Brush"](this.board);
        this.board.freeDrawingBrush.shadow = new this.fabric.Shadow({
            blur: this.brush.shadowWidth,
            offsetX: this.brush.shadowOffset,
            offsetY: this.brush.shadowOffset,
            affectStroke: true,
            color: this.brush.shadowColor,
          });
        this.board.freeDrawingBrush.color = this.brush.color;
        this.board.freeDrawingBrush.width = this.brush.width;
    }
}