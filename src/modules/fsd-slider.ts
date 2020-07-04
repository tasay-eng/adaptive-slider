class Model {
        defaultValue_1: number
        defaultValue_2?: number
        min: number
        max: number
        step: number

        constructor() {
            this.defaultValue_1 = 0
            this.defaultValue_2 = 100
            this.min = 0
            this.max = 100
            this.step = 1
        }
    
        parseNumber(val){
            if (Number.isSafeInteger(this.step)){
                val = parseInt(val)
            }
            else{
                val = parseFloat(val)
            }
            return val
        }
        
        countNumber(id: string, coords){
            if (id === 'run-contain-1') {
                this.defaultValue_1 = this.parseNumber(this.min+((coords.contain_1.left - coords.line_coords.left)*this.max * this.step/(coords.line_coords.width)))
                return this.defaultValue_1
            }
            else {
                this.defaultValue_2 = this.parseNumber(this.min+((coords.contain_2.left - coords.line_coords.left)*this.max * this.step/(coords.line_coords.width)))
                return this.defaultValue_2
            }
        }

        checkValue(id, coords, value, len){
            let res; 
            if(value%this.step === 0){
                res = value;                                   
            }else{
                if(value%this.step >= this.step/2) {res = this.step*(value/this.step + 1);}
                else {res = this.step*(value/this.step - 1);}
            }

            if(res>this.max){
                res = this.max
            }else if(res<this.min){
                res = this.min
            }
            
            if (id === 'input_for_1' && res!==this.max && res!==this.min) {
                if(len > 1){
                    if(res < this.defaultValue_2){
                        this.defaultValue_1 = res
                    }else{
                        this.defaultValue_1 = this.defaultValue_2 
                    }
                }else{
                    this.defaultValue_1 = res
                }
                return this.defaultValue_1

            }else if(id === 'input_for_2' && res!==this.max && res!==this.min) {
                if(res > this.defaultValue_1){
                    this.defaultValue_2 = res
                }else{
                    this.defaultValue_2 = this.defaultValue_1
                }
                return this.defaultValue_2
            }
        }

        countRunnersCoords(val, coords){
            let run_left = (val - this.min) * coords.line_coords.width/(this.max*this.step)
            return run_left;
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
        empty_field: HTMLDivElement;
        current_number_1: HTMLSpanElement;
        coords: {
            line_coords: ClientRect,
            contain_1: ClientRect,
            delta_1: number,
            contain_2?: ClientRect,
            delta_2?: number,
        }
        input_val_1 = 0
        input_val_2 = 100
        _inputs_array: NodeListOf<Element>;
        _runs_array: NodeListOf<Element>;

    
        constructor() {

            this.field = document.createElement('div')
            this.field.id = 'slider-field'
            
            this.interval_button = document.createElement('button')
            this.interval_button.id = 'interval-button'
            this.interval_button.textContent = 'go to range'
    
            this.range_button = document.createElement('button')
            this.range_button.id = 'range-button'
            this.range_button.textContent = 'add numbers'
    
            this.input_1 = document.createElement('input')
            this.input_1.placeholder = (this.input_val_1).toString()
            this.input_1.classList.add('input_for_slider')
            this.input_1.id = 'input_for_1'
    
            this.run_contain_1 = document.createElement('div')
            this.run_contain_1.classList.add('run-container')
            this.run_contain_1.id = 'run-contain-1'
            this.run_1 = document.createElement('span')
            this.run_1.classList.add('runner')
            this.run_1.id = 'runner-1'

            this.empty_field = document.createElement('div')
            this.empty_field.id = 'empty-field'

            this.run_contain_1.append(this.run_1)
            this.field.append(this.run_contain_1)

            this.form = document.querySelector('.formEclectic')
            this.form.append(this.interval_button, this.range_button, this.field, this.input_1)

            this._setStartCoords()

            this._runs_array = document.querySelectorAll('.run-container')
            this._inputs_array= document.querySelectorAll('.input_for_slider')
        }



        _asynCreateForm(){
            new Promise(function(resolve, reject) {
                setTimeout(() => resolve(), 1000);
            }).then(
                result => {
                    this.form = document.querySelector('.formEclectic')
                    this.form.append(this.interval_button, this.range_button, this.field, this.input_1)
                    
                    console.log(this._runs_array, 15)
                    console.log(this._returnRuns, 155)
                }
            )
        }

        
        _setStartCoords(){
            this.coords= {
                line_coords: this.field.getBoundingClientRect(),
                contain_1: this.run_contain_1.getBoundingClientRect(),
                delta_1: 0
            }
        }
    
        get _returnRuns(){
            return this._runs_array
        }
    
        get _returnInputs(){
            return this._inputs_array
        }

        _cleanCoords(){
            this.coords= {
                line_coords: this.field.getBoundingClientRect(),
                contain_1: this.run_contain_1.getBoundingClientRect(),
                delta_1: 0
            }
            if (this._returnRuns.length > 1){
                this.coords.contain_2 = this.run_contain_2.getBoundingClientRect()
                this.coords.delta_2 = 0
            }
        }
    
        _resetCoords(e: MouseEvent){
            this.coords = {
                line_coords: this.field.getBoundingClientRect(),
                contain_1: this.run_contain_1.getBoundingClientRect(),
                delta_1: e.clientX - this.run_contain_1.getBoundingClientRect().left 
            } 
            if (this._returnRuns.length > 1){
                this.coords.contain_2 = this.run_contain_2.getBoundingClientRect()
                this.coords.delta_2 = e.clientX - this.run_contain_2.getBoundingClientRect().left 
            }
            return this.coords
        }

        _countMoveAt(id: string, pageX, parse_num, step): number{
            let res, pre;
            if(id === 'run-contain-1') {
                res = this.coords.contain_1.left 
                pre = parse_num(((pageX - this.coords.delta_1 - this.coords.line_coords.left)*step), step)
                if (pre >=0 && pre <= (this.coords.line_coords.width)){ 
                    if(this._returnRuns.length > 1){
                        if (pre <= (this.coords.contain_2.left - this.coords.contain_2.width - this.coords.line_coords.left)) res = pre;
                    }else {
                        res = pre;
                    }
                   
                }
            }else{
                res = this.coords.contain_2.left
                pre = parse_num(((pageX - this.coords.delta_2 - this.coords.line_coords.left)*step), step)
                if (pre <= (this.coords.line_coords.width - this.coords.contain_2.width) && pre >= (this.coords.contain_1.right - this.coords.line_coords.left)) {
                    res = pre;
                }
            }
            return res
        }
    
        get _coordsElem(){
            return this.coords
        }
        
        _changeRunsNums(val, run){
            if (run.firstChild.classList.contains('val-changer')) run.firstChild.textContent = val;
        }
        _changeInputVal(val, index){
            if (this._returnInputs) this._returnInputs[index].value = val;
        }
    
        bindChangeInputValue(check_val, coords_from_input){
            this._inputs_array.forEach((inp: HTMLInputElement, index)=>{inp.addEventListener('input', (e)=>{
                let correct_val = check_val(inp.id, this.coords, inp.value, this._inputs_array.length)
                inp.value = correct_val
                let lf = coords_from_input(correct_val, this.coords)
                this._runs_array[index].style.left = lf;
                this._changeRunsNums(correct_val, this._runs_array[index])
            })})
        }
    
        moveRuns(count_val, parse_num, step){
            console.log(this._runs_array, 17)
            console.log(this._returnRuns, 177)
            this._runs_array.forEach((run: HTMLDivElement, index)=>{
                console.log(run, 133)
                run.onmousedown = (e: MouseEvent)=>{
                    run.ondragstart = (e: MouseEvent)=>{
                        return false;
                    }
                    document.onmousemove = (e: MouseEvent)=>{ 
                        let lf = this._countMoveAt(run.id, e.pageX, parse_num, step)

                        run.style.left = lf + 'px';
                        let coords = this._resetCoords(e)
                        let val = count_val(run.id, coords)
                        this._changeInputVal(val, index)
                        this._changeRunsNums(val, run)

                    }
                    document.onmouseup = (e: MouseEvent)=>{
                        document.onmousemove = null
                        document.onmouseup = null;
                    }
                }
            })
        }
    
        bindAddLegend(count_num){
            this.range_button.addEventListener('click', (e)=>{ 
                e.preventDefault();
                
                this.range_button.textContent = (this.range_button.textContent === 'add numbers') ? 'remove numbers' : 'add numbers';
                this._addRemoveNums(count_num)
            })  
        }

        _addRunner(){
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
           
        _addRemoveRunner(): void{
            if (this.interval_button.textContent === 'go to single'){
                this._addRunner()
            }
            else {
                if(this.field.lastChild.id === 'run-contain-2') {
                    this.field.removeChild(this.field.lastChild);
                }   
            }
        }

        _addInput(){
            this.input_2 = document.createElement('input')
            this.input_2.classList.add('input_for_slider')
            this.input_2.id = 'input_for_2'
            this.input_2.style = this.input_1.style
            this.input_2.style.left = (30).toString()
            this.form.append(this.input_2)
        }
    
        _addRemoveInput(): void{
            if (this.interval_button.textContent === 'go to single'){
                this._addInput()
            }
            else{
                if(this.form.lastChild.id === 'input_for_2') this.form.removeChild(this.form.lastChild)
            }
        }

        _defineRuns(){
            this._runs_array = document.querySelectorAll('.run-container')
        }
        _defineInputs(){
            this._inputs_array = document.querySelectorAll('.input_for_slider')
        }
    
        bindSlidersAdd(count_val, check_val, parse_num, coords_from_input, step){
            this.interval_button.addEventListener('click', (e)=>{
                e.preventDefault();
                
                this.interval_button.textContent = (this.interval_button.textContent === 'go to range') ? 'go to single' : 'go to range';
                this._addRemoveRunner()
                this._cleanCoords()
                this._addRemoveInput()
                this._defineRuns()
                this._defineInputs()
                this.moveRuns(count_val, parse_num, step)
                this._addRemoveNums(count_val)
                this.bindChangeInputValue(check_val, coords_from_input)
            
            })
        }

        _addNums(count_num){
            this._returnRuns.forEach((run, index)=>{
                this.current_number_1 = document.createElement('span')
                this.current_number_1.innerText = count_num(run.id, this._coordsElem)
                this.current_number_1.id = 'current-number-'+index
                this.current_number_1.classList.add('change-number')
            
                run.prepend(this.current_number_1)                   
            })
        }
        
        sliderFieldActive(coords_from_input, parse_num, step){
            this.field.addEventListener('click', (e)=>{
                console.log(10)
                if(!e.target.classList.contains('runner') && !e.target.classList.contains('change-number')){
                    let len = this._returnRuns.length
                        if(len > 1){
                            let diff = (this._coordsElem.contain_1.right - e.clientX) < (this._coordsElem.contain_2.left - e.clientX)
                            if(diff){
                                let lf = this._countMoveAt(this._returnRuns[0].id, e.target.pageX, parse_num, step)

                                this._runs_array[0].style.left = lf
                                let val = coords_from_input(lf, this._coordsElem, len)
                                this._changeInputVal(val, 0)
                            }else{
                                let lf = this._countMoveAt(this._returnRuns[1].id, e.target.pageX, parse_num, step)
                                
                                this._runs_array[1].style.left = lf
                                let val = coords_from_input(lf, this._coordsElem, len)
                                this._changeInputVal(val, 1)
                            }
                        }else{
                            let lf = this._countMoveAt(this._returnRuns[0].id, e.target.pageX, parse_num, step)

                            this._runs_array[0].style.left = lf
                            let val = coords_from_input(lf, this._coordsElem, len)
                            this._changeInputVal(val, 0)
                            
                        }
                    }
            })
        }
    
        _addRemoveNums(count_num){
            if(this.range_button.textContent === 'remove numbers'){
                this._addNums(count_num)
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
            
            this.view.moveRuns(this.handleCountVal, this.handleParseNum, this.model.step)
            this.view.bindChangeInputValue(this.handleCheckValue, this.handleCountRunCoords)
            this.view.bindSlidersAdd(this.handleCountVal, this.handleCheckValue, this.handleParseNum, this.handleCountRunCoords, this.model.step)
            this.view.bindAddLegend(this.handleCountVal)
            this.view.sliderFieldActive(this.handleCountRunCoords, this.handleParseNum, this.model.step)
        }
        handleParseNum=(val)=>{
            return this.model.parseNumber(val)
        }
        handleCountVal=(id, coords)=>{
            return this.model.countNumber(id, coords)
        }
        handleCheckValue=(id, coords, value, len)=>{
            return this.model.checkValue(id, coords, value, len)
        }
        handleCountRunCoords=(val, coords)=>{
            return this.model.countRunnersCoords(val, coords)
        }
        handleFieldActive(){
            this.view.sliderFieldActive(this.handleCountRunCoords, this.handleParseNum, this.model.step)
        }
}

export{Model, View, Controller};
