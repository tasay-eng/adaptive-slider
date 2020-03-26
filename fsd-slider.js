class Model {
    constructor() {
        this.type = 'single'
        this.coords={}
    }
    moveAt(e){
        let coords = this._retCoords;
        if (e.target.id === 'runner') {
            e.target.style.left = e.pageX - coords.delta - coords.line_coords.left +'px'; 
        }
        else if (e.target.id === 'runner-1'|| e.target.id === 'runner-2'){
            if (e.pageX < coords.elem_coords.right) {   
                e.target.style.left = e.pageX - e.clientX + coords.elem_coords - coords.line_coords.left + 'px';    
            }
            else {
                e.target.style.right = coords.line_coords.right - e.pageX + 'px';    
            }
        }
    }
    resetCoords(e){
        this.coords = {
            line_coords: document.querySelector('#slider-field').getBoundingClientRect(),
            elem_coords: e.target.getBoundingClientRect(),
            delta: e.clientX - e.target.getBoundingClientRect().left
        }
    }
    get _retCoords(){
        return this.coords
    }
    onMouseDown(e) {
        if (e.target.tagName.toLowerCase() !== 'span') return;
        else{
            this.resetCoords(e);
            this.moveAt(e);
        }
    } 
}

class View {
    constructor() {
        this.root = document.querySelector('.eclecticSlider')
        this.field = document.createElement('div')
        this.field.id = 'slider-field'
        this.type = 'single'
        this.root.append(this.field)
        if (this.type === 'single') {
            this.run = document.createElement('span')
            this.run.id = 'runner'
            this.run.zIndex = 1000;
            this.root.append(this.run)

        }
        else if (this.type === 'range') {
            this.run1 = document.createElement('span')
            this.run1.id = 'runner-1'
            this.run1.zIndex = 1000;
            this.run2 = document.createElement('span')
            this.run2.id = 'runner-2'
            this.run2.zIndex = 1000;
            this.root.append(this.run1, this.run2)
        }
    }
    _stopBrowserDrop(){
        this.run.ondragstart = function() {
            return false;
        };
    }
    bindOnMouseDown(handler_down, handler_move) {
        this.run.ondragstart = function() {
            return false;
        };
        this.run.onmousedown = function(e){
            handler_down(e);
            document.addEventListener('mousemove', handler_move)
            this.run.onmouseup = function(e) {
                document.removeEventListener('mousemove', handler_move)
                this.run.onmouseup = null;
            }
        }
    }}
class Controller{}
    constructor(model, view) {
        this.model = model
        this.view = view

        this.view.bindOnMouseDown(this.handleOnMouseDown, this.handleMoveAt)
    }
    handleOnMouseDown = e => {
        this.model.onMouseDown(e)
    }
    handleMoveAt = e => {
        this.model.moveAt(e)
    }
    handleOnMouseUp = e => {
        this.model.onMouseDown(e)
    }
}

const slider = new Controller(new Model(), new View())