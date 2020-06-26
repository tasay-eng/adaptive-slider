class Model {
    min: number = 0
    max: number = 100
    step: number = 1
    defaultValue = (this.max < this.min) ? this.min : this.min + (this.max - this.min)/2;

    constructor() {

    }

    parseNumber(val){
        if (Number.isSafeInteger(this.step)){
            val = parseInt(val)
        }
        else{
            val = parseFloat(val)
        }
    }

    countMoveAt(id: string, coords, value?, pageX?){
        let pre;
        let delta;
        console.log(coords.contain_1.left, 1)
        pre = (value && value != null) ? value : (pageX - delta - coords.line_coords.left)
        if (id === 'run-contain-1'){
            delta = coords.delta_1
            pre = this.parseNumber(pre*this.step)
            if (pre >= this.min && pre <=this.max){ 
                if(coords.contain_2){
                    if (pre <= (coords.contain_2.left - coords.contain_2.width)) this.defaultValue = pre; return pre;
                }else {
                    this.defaultValue = pre
                    return pre;
                }
            }
        }
        else{
            delta = coords.delta_2
            pre = this.parseNumber(pre*this.step)
            if (pre>=this.min && pre <=this.max && pre >= (coords.contain_1.right)) {
                this.defaultValue = pre
                return pre;
            }
        }
    }
    
    countNumber(id: string, coords){
        let run_cor: DOMRect;
        if (id === 'run-contain-1') run_cor = coords.contain_1;
        else run_cor = coords.contain_2;
        this.defaultValue = parseInt(this.min+((run_cor.left - coords.line_coords.left)*this.max * this.step/(coords.line_coords.width)))
        return this.defaultValue
    }
}

class View {
    form: HTMLFormElement;
    field: HTMLDivElement;
    interval_button: HTMLButtonElement;
    range_button: HTMLButtonElement;
    run_contain_1: HTMLDivElement;
    run_contain_2: HTMLDivElement;
    run_1: HTMLSpanElement;
    run_2: HTMLSpanElement;
    input_1: HTMLInputElement;
    input_2: HTMLInputElement;
    coords: {
        line_coords: DOMRect,
        contain_1: DOMRect,
        delta_1: number,
        contain_2?: DOMRect,
        delta_2?: number,
    }
    input_val_1 = 'write your value'
    input_val_2 = 'write your second value'

    constructor() {
        this.form = document.querySelector('.eclecticSlider')
        this.field = document.createElement('div')
        this.field.id = 'slider-field'
        
        this.interval_button = document.createElement('button')
        this.interval_button.id = 'interval-button'
        this.interval_button.textContent = 'go to range'

        this.range_button = document.createElement('button')
        this.range_button.id = 'range-button'
        this.range_button.textContent = 'add numbers'

        this.input_1 = document.createElement('input')
        this.input_1.value = (this.input_val_1).toString()
        this.input_1.classList.add('input_for_slider')
        this.input_1.id = 'input_for_1'

        this.run_contain_1 = document.createElement('div')
        this.run_contain_1.classList.add('run-container')
        this.run_contain_1.id = 'run-contain-1'
        this.run_1 = document.createElement('span')
        this.run_1.classList.add('runner')
        this.run_1.id = 'runner-1'
        this.run_contain_1.append(this.run_1)
        this.field.append(this.run_contain_1)
        this.form.append(this.interval_button, this.range_button, this.field, this.input_1)

        this.setStartCoords()
    }
    inputs_array: NodeListOf<Element> = document.querySelectorAll('.run-container')
    runs_array: NodeListOf<Element> = document.querySelectorAll('.input_for_slider')
    
    setStartCoords(){
        this.coords= {
            line_coords: this.field.getBoundingClientRect(),
            contain_1: this.run_contain_1.getBoundingClientRect(),
            delta_1: 0
        }
    }

    get _returnRuns(){
        return this.runs_array
    }

    get _returnInputs(){
        return this.inputs_array
    }

    resetCoords(e: MouseEvent){
        this.coords = {
            line_coords: this.field.getBoundingClientRect(),
            contain_1: this.run_contain_1.getBoundingClientRect(),
            delta_1: e.clientX - this.run_contain_1.getBoundingClientRect().left 
        } 
        if (this.run_contain_2){
            this.coords.contain_2 = this.run_contain_2.getBoundingClientRect()
            this.coords.delta_2 = e.clientX - this.run_contain_2.getBoundingClientRect().left 
    
        }
        console.log(this.coords, 1)
        return this.coords
    }

    get _coordsElem(){
        return this.coords
    }
    
    changeRunsNums(val, run){
        if (run.firstChild.classList.contains('val-changer')) run.firstChild.textContent = val;
    }
    changeInputVal(val, index){
        if(this._returnInputs) this._returnInputs[index].value = val
    }

    bindChangeInputValue(handle_move){
        this.form.addEventListener('input', (e)=>{
            if (e.target.classList.contains('input_for_slider')){
                this._returnInputs.forEach((inp: HTMLInputElement, index)=>{
                    let runs_array = this._returnRuns
                    let lf = handle_move(runs_array[index].id, this._coordsElem, inp.value)
                    if (typeof lf === 'number'){
                        runs_array[index].style.left = lf;
                        this.changeRunsNums(inp.value, runs_array[index])
                    }
                })
            }
        })
    }

    moveRuns(handler_move){
        console.log(this.defineRuns(), 12)
        this._returnRuns.forEach((run: HTMLDivElement, index)=>{
            run.onmousedown = (e: MouseEvent)=>{
                run.ondragstart = (e: MouseEvent)=>{
                    return false;
                }
                let coords = this.resetCoords(e)
                document.onmousemove = (e: MouseEvent)=>{ 
                    console.log(coords, 2)
                    let lf = handler_move(run.id, coords, null, e.pageX)
                    if (typeof lf === 'number'){
                        console.log(lf, 4)
                        run.style.left = lf + 'px';
                    } 
                    coords = this.resetCoords(e)
                    let val = handler_move(run.id, coords)
                    this.changeInputVal(val, index)
                    this.changeRunsNums(val, run)
                }
                document.onmouseup = (e: MouseEvent)=>{
                    document.onmousemove = null
                    document.onmouseup = null;
                }
            }
        })
    }

    bindAddLegend(handle_move){
        this.range_button.addEventListener('click', (e)=>{ 
            e.preventDefault();
            
            e.target.textContent = (e.target.textContent === 'add numbers') ? 'remove numbers' : 'add numbers'
            this.addRemoveNumsButton(handle_move)
        })  
    }
       
    addRemoveRunner(): void{
        if (this.interval_button.textContent === 'go to single'){
            this.run_2 = document.createElement('span');
            this.run_contain_2 = document.createElement('div')
            this.run_contain_2.classList.add('run-container')
            this.run_contain_2.id = 'run-contain-2'
            this.run_contain_2.style = this.run_contain_1.style
            this.run_contain_2.style.right = (0).toString()
            this.run_2.classList.add('runner')
            this.run_2.id = 'runner-2'
            this.run_2.value = this.input_val_2
            this.run_2.style = this.run_1.style
            this.run_contain_2.append(this.run_2)
            this.field.append(this.run_contain_2)
        }
        else {
            if(this.field.lastChild.id === 'run-contain-2') {
                this.field.removeChild(this.field.lastChild);
            }   
        }
    }

    addRemoveInput(): void{
        if (this.interval_button.textContent === 'go to single'){
            console.log(111)
            this.input_2 = document.createElement('input')
            this.input_2.classList.add('input_for_slider')
            this.input_2.id = 'input_for_2'
            this.input_2.style = this.input_1.style
            this.input_2.style.left = (30).toString()
            this.form.append(this.input_2)
        }
        else{
            if(this.form.lastChild.id === 'input_for_2') this.form.removeChild(this.form.lastChild)
        }
    }
    defineRuns(){
        this.runs_array = document.querySelectorAll('.run-container')
        return this.runs_array
    }
    defineInputs(){
        this.inputs_array = document.querySelectorAll('.run-container')
        return this.inputs_array
    }
    changeTextContent(elem, val1, val2?){
        if (val1){
            if (val2){
                elem.textContent = val1 ? val2 : val1
            }else {
                elem.textContent = val1
            }
        }
    }

    bindSlidersAdd(handler_move){
        this.interval_button.addEventListener('click', (e)=>{
            e.preventDefault();
            
            e.target.textContent = (e.target.textContent === 'go to range') ? 'go to single' : 'go to range';
            this.addRemoveRunner()
            this.addRemoveInput()
            this.defineRuns()
            this.defineInputs()
            this.moveRuns(handler_move)
            this.addRemoveNumsButton(handler_move)
        
        })
    }
    addNums(){
        this._returnRuns.forEach((run, index)=>{
            const span = document.createElement('span')
            span.innerText = handler_move(run.id, this._coordsElem)
            span.id = 'current-number'+index
            span.classList.add('change-number')
        
            run.prepend(span)                   
        })
    }

    addRemoveNumsButton(handler_move){
        if(this.range_button.textContent === 'remove numbers'){
            console.log(11);
            this._returnRuns.forEach((run, index)=>{
                const span = document.createElement('span')
                span.innerText = handler_move(run.id, this._coordsElem)
                span.id = 'current-number'+index
                span.classList.add('change-number')
        
                run.prepend(span)
                    
            })
        }else{
            this._returnRuns.forEach((run)=>{
                if (run.firstChild.classList.contains('change-number')) run.removeChild(run.firstChild);
            })
        }
    }

}
class Controller{
    view: View;
    model: Model;
    constructor(view, model) {
        this.view = view
        this.model = model
        
        this.view.moveRuns(this.handleCountMoveAt)
        this.view.bindChangeInputValue(this.handleCountMoveAt)
        this.view.bindSlidersAdd(this.handleCountMoveAt)
        this.view.bindAddLegend(this.handleCountMoveAt)
    }
    handleMoveRuns=(handler_move)=>{
        this.view.moveRuns(handler_move)
    }
    handleCountMoveAt = (id, coords, value?, pageX?) => {
        return this.model.countMoveAt(id, coords, value, pageX)
    }
    handleResetCoords=(e)=>{
        return this.view.resetCoords(e)
    }
    handleAddRemoveRunner=()=>{
        this.view.addRemoveRunner()
    }
    handleGetCoords(){
        return this.view._coordsElem
    }
    handleAddRemoveInput=()=>{
        this.view.addRemoveInput()
    }
    handleDefineRuns=()=>{
        return this.view.defineRuns()
    }
    handleDefineInputs=()=>{
        return this.view.defineInputs()
    }
    handleAddLegend=(count_num)=>{
        this.view.bindAddLegend(count_num)
    }
    handleCountNum=(coords, id)=>{
        return this.model.countNumber(coords, id)
    }
    handleChangeText=(elem, val1, val2?)=>{
        this.view.changeTextContent(elem, val1, val2)
    }
}

const slider = new Controller(new View(), new Model())