class Model {
    constructor() {
        this.min = 0;
        this.max = 100;
        this.step = 1;
        this.defaultValue = (this.max < this.min) ? this.min : this.min + (this.max - this.min) / 2;
    }
    parseNumber(val) {
        if (Number.isSafeInteger(this.step)) {
            val = parseInt(val);
        }
        else {
            val = parseFloat(val);
        }
    }
    countMoveAt(id, coords, value, pageX) {
        let pre;
        let delta;
        console.log(coords.contain_1.left, 1);
        pre = (value && value != null) ? value : (pageX - delta - coords.line_coords.left);
        if (id === 'run-contain-1') {
            delta = coords.delta_1;
            pre = this.parseNumber(pre * this.step);
            if (pre >= this.min && pre <= this.max) {
                if (coords.contain_2) {
                    if (pre <= (coords.contain_2.left - coords.contain_2.width))
                        this.defaultValue = pre;
                    return pre;
                }
                else {
                    this.defaultValue = pre;
                    return pre;
                }
            }
        }
        else {
            delta = coords.delta_2;
            pre = this.parseNumber(pre * this.step);
            if (pre >= this.min && pre <= this.max && pre >= (coords.contain_1.right)) {
                this.defaultValue = pre;
                return pre;
            }
        }
    }
    countNumber(id, coords) {
        let run_cor;
        if (id === 'run-contain-1')
            run_cor = coords.contain_1;
        else
            run_cor = coords.contain_2;
        this.defaultValue = parseInt(this.min + ((run_cor.left - coords.line_coords.left) * this.max * this.step / (coords.line_coords.width)));
        return this.defaultValue;
    }
}
class View {
    constructor() {
        this.input_val_1 = 'write your value';
        this.input_val_2 = 'write your second value';
        this.inputs_array = document.querySelectorAll('.run-container');
        this.runs_array = document.querySelectorAll('.input_for_slider');
        this.form = document.querySelector('.eclecticSlider');
        this.field = document.createElement('div');
        this.field.id = 'slider-field';
        this.interval_button = document.createElement('button');
        this.interval_button.id = 'interval-button';
        this.interval_button.textContent = 'go to range';
        this.range_button = document.createElement('button');
        this.range_button.id = 'range-button';
        this.range_button.textContent = 'add numbers';
        this.input_1 = document.createElement('input');
        this.input_1.value = (this.input_val_1).toString();
        this.input_1.classList.add('input_for_slider');
        this.input_1.id = 'input_for_1';
        this.run_contain_1 = document.createElement('div');
        this.run_contain_1.classList.add('run-container');
        this.run_contain_1.id = 'run-contain-1';
        this.run_1 = document.createElement('span');
        this.run_1.classList.add('runner');
        this.run_1.id = 'runner-1';
        this.run_contain_1.append(this.run_1);
        this.field.append(this.run_contain_1);
        this.form.append(this.interval_button, this.range_button, this.field, this.input_1);
        this.setStartCoords();
    }
    setStartCoords() {
        this.coords = {
            line_coords: this.field.getBoundingClientRect(),
            contain_1: this.run_contain_1.getBoundingClientRect(),
            delta_1: 0
        };
    }
    get _returnRuns() {
        return this.runs_array;
    }
    get _returnInputs() {
        return this.inputs_array;
    }
    resetCoords(e) {
        this.coords = {
            line_coords: this.field.getBoundingClientRect(),
            contain_1: this.run_contain_1.getBoundingClientRect(),
            delta_1: e.clientX - this.run_contain_1.getBoundingClientRect().left
        };
        if (this.run_contain_2) {
            this.coords.contain_2 = this.run_contain_2.getBoundingClientRect();
            this.coords.delta_2 = e.clientX - this.run_contain_2.getBoundingClientRect().left;
        }
        console.log(this.coords, 1);
        return this.coords;
    }
    get _coordsElem() {
        return this.coords;
    }
    changeRunsNums(val, run) {
        if (run.firstChild.classList.contains('val-changer'))
            run.firstChild.textContent = val;
    }
    changeInputVal(val, index) {
        if (this._returnInputs)
            this._returnInputs[index].value = val;
    }
    bindChangeInputValue(handle_move) {
        this.form.addEventListener('input', (e) => {
            if (e.target.classList.contains('input_for_slider')) {
                this._returnInputs.forEach((inp, index) => {
                    let runs_array = this._returnRuns;
                    let lf = handle_move(runs_array[index].id, this._coordsElem, inp.value);
                    if (typeof lf === 'number') {
                        runs_array[index].style.left = lf;
                        this.changeRunsNums(inp.value, runs_array[index]);
                    }
                });
            }
        });
    }
    moveRuns(handler_move) {
        console.log(this.defineRuns(), 12);
        this._returnRuns.forEach((run, index) => {
            run.onmousedown = (e) => {
                run.ondragstart = (e) => {
                    return false;
                };
                let coords = this.resetCoords(e);
                document.onmousemove = (e) => {
                    console.log(coords, 2);
                    let lf = handler_move(run.id, coords, null, e.pageX);
                    if (typeof lf === 'number') {
                        console.log(lf, 4);
                        run.style.left = lf + 'px';
                    }
                    coords = this.resetCoords(e);
                    let val = handler_move(run.id, coords);
                    this.changeInputVal(val, index);
                    this.changeRunsNums(val, run);
                };
                document.onmouseup = (e) => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        });
    }
    bindAddLegend(handle_move) {
        this.range_button.addEventListener('click', (e) => {
            e.preventDefault();
            e.target.textContent = (e.target.textContent === 'add numbers') ? 'remove numbers' : 'add numbers';
            this.addRemoveNumsButton(handle_move);
        });
    }
    addRemoveRunner() {
        if (this.interval_button.textContent === 'go to single') {
            this.run_2 = document.createElement('span');
            this.run_contain_2 = document.createElement('div');
            this.run_contain_2.classList.add('run-container');
            this.run_contain_2.id = 'run-contain-2';
            this.run_contain_2.style = this.run_contain_1.style;
            this.run_contain_2.style.right = (0).toString();
            this.run_2.classList.add('runner');
            this.run_2.id = 'runner-2';
            this.run_2.value = this.input_val_2;
            this.run_2.style = this.run_1.style;
            this.run_contain_2.append(this.run_2);
            this.field.append(this.run_contain_2);
        }
        else {
            if (this.field.lastChild.id === 'run-contain-2') {
                this.field.removeChild(this.field.lastChild);
            }
        }
    }
    addRemoveInput() {
        if (this.interval_button.textContent === 'go to single') {
            console.log(111);
            this.input_2 = document.createElement('input');
            this.input_2.classList.add('input_for_slider');
            this.input_2.id = 'input_for_2';
            this.input_2.style = this.input_1.style;
            this.input_2.style.left = (30).toString();
            this.form.append(this.input_2);
        }
        else {
            if (this.form.lastChild.id === 'input_for_2')
                this.form.removeChild(this.form.lastChild);
        }
    }
    defineRuns() {
        this.runs_array = document.querySelectorAll('.run-container');
        return this.runs_array;
    }
    defineInputs() {
        this.inputs_array = document.querySelectorAll('.run-container');
        return this.inputs_array;
    }
    changeTextContent(elem, val1, val2) {
        if (val1) {
            if (val2) {
                elem.textContent = val1 ? val2 : val1;
            }
            else {
                elem.textContent = val1;
            }
        }
    }
    bindSlidersAdd(handler_move) {
        this.interval_button.addEventListener('click', (e) => {
            e.preventDefault();
            e.target.textContent = (e.target.textContent === 'go to range') ? 'go to single' : 'go to range';
            this.addRemoveRunner();
            this.addRemoveInput();
            this.defineRuns();
            this.defineInputs();
            this.moveRuns(handler_move);
            this.addRemoveNumsButton(handler_move);
        });
    }
    addNums() {
        this._returnRuns.forEach((run, index) => {
            const span = document.createElement('span');
            span.innerText = handler_move(run.id, this._coordsElem);
            span.id = 'current-number' + index;
            span.classList.add('change-number');
            run.prepend(span);
        });
    }
    addRemoveNumsButton(handler_move) {
        if (this.range_button.textContent === 'remove numbers') {
            console.log(11);
            this._returnRuns.forEach((run, index) => {
                const span = document.createElement('span');
                span.innerText = handler_move(run.id, this._coordsElem);
                span.id = 'current-number' + index;
                span.classList.add('change-number');
                run.prepend(span);
            });
        }
        else {
            this._returnRuns.forEach((run) => {
                if (run.firstChild.classList.contains('change-number'))
                    run.removeChild(run.firstChild);
            });
        }
    }
}
class Controller {
    constructor(view, model) {
        this.handleMoveRuns = (handler_move) => {
            this.view.moveRuns(handler_move);
        };
        this.handleCountMoveAt = (id, coords, value, pageX) => {
            return this.model.countMoveAt(id, coords, value, pageX);
        };
        this.handleResetCoords = (e) => {
            return this.view.resetCoords(e);
        };
        this.handleAddRemoveRunner = () => {
            this.view.addRemoveRunner();
        };
        this.handleAddRemoveInput = () => {
            this.view.addRemoveInput();
        };
        this.handleDefineRuns = () => {
            return this.view.defineRuns();
        };
        this.handleDefineInputs = () => {
            return this.view.defineInputs();
        };
        this.handleAddLegend = (count_num) => {
            this.view.bindAddLegend(count_num);
        };
        this.handleCountNum = (coords, id) => {
            return this.model.countNumber(coords, id);
        };
        this.handleChangeText = (elem, val1, val2) => {
            this.view.changeTextContent(elem, val1, val2);
        };
        this.view = view;
        this.model = model;
        this.view.moveRuns(this.handleCountMoveAt);
        this.view.bindChangeInputValue(this.handleCountMoveAt);
        this.view.bindSlidersAdd(this.handleCountMoveAt);
        this.view.bindAddLegend(this.handleCountMoveAt);
    }
    handleGetCoords() {
        return this.view._coordsElem;
    }
}
const slider = new Controller(new View(), new Model());
