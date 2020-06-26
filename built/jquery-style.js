;
(function ($) {
    let methods = {
        model: class Model {
            constructor() {
                this.min = 0;
                this.max = 100;
                this.step = 1;
                this.defaultValue_1 = this.min;
            }
            parseNumber(val) {
                if (Number.isSafeInteger(this.step)) {
                    val = parseInt(val);
                }
                else {
                    val = parseFloat(val);
                }
                return val;
            }
            countMoveAt(id, coords, pageX) {
                let pre;
                let delta = (id === 'run-contain-1') ? coords.delta_1 : coords.delta_2;
                pre = this.parseNumber((pageX - delta - coords.line_coords.left) * this.step);
                console.log(pre, 2);
                if (id === 'run-contain-1') {
                    if (pre >= 0 && pre <= (coords.line_coords.width)) {
                        if (coords.contain_2) {
                            if (pre <= (coords.contain_2.left - coords.contain_2.width - coords.line_coords.left))
                                return pre;
                        }
                        else {
                            return pre;
                        }
                    }
                }
                else {
                    console.log(3);
                    if (pre <= (coords.line_coords.width) && pre >= (coords.contain_1.right - coords.line_coords.left)) {
                        console.log(pre, 4);
                        return pre;
                    }
                }
            }
            countNumber(id, coords) {
                let run_cor;
                if (id === 'run-contain-1') {
                    run_cor = coords.contain_1;
                    this.defaultValue_1 = this.parseNumber(this.min + ((run_cor.left - coords.line_coords.left) * this.max * this.step / (coords.line_coords.width)));
                    return this.defaultValue_1;
                }
                else {
                    run_cor = coords.contain_2;
                    this.defaultValue_2 = this.parseNumber(this.min + ((run_cor.left - coords.line_coords.left) * this.max * this.step / (coords.line_coords.width)));
                    return this.defaultValue_2;
                }
            }
            checkValue(id, coords, value) {
                let res;
                if (value % this.step === 0) {
                    res = value;
                }
                else {
                    if (value % this.step >= this.step / 2) {
                        res = this.step * (value / this.step + 1);
                    }
                    else {
                        res = this.step * (value / this.step - 1);
                    }
                }
                if (res > this.max) {
                    res = this.max;
                }
                else if (res < this.max) {
                    res = this.min;
                }
                if (id === 'input_for_1' && res != this.max && res != this.min) {
                    if (coords.contain_2) {
                        if (res < this.defaultValue_2) {
                            this.defaultValue_1 = res;
                        }
                        else {
                            this.defaultValue_1 = this.defaultValue_2;
                        }
                    }
                    else {
                        this.defaultValue_1 = res;
                    }
                    return this.defaultValue_1;
                }
                else if (res != this.max && res != this.min) {
                    this.defaultValue_2 = this.defaultValue_1;
                    return this.defaultValue_2;
                }
            }
            countRunnersCoords(val, coords) {
                let run_left = (val - this.min) * coords.line_coords.width / (this.max * this.step);
                return run_left;
            }
        },
        view: class View {
            constructor() {
                this.input_val_1 = 0;
                this.input_val_2 = 100;
                this.form = document.querySelector('.formEclectic');
                this.field = document.createElement('div');
                this.field.id = 'slider-field';
                this.interval_button = document.createElement('button');
                this.interval_button.id = 'interval-button';
                this.interval_button.textContent = 'go to range';
                this.range_button = document.createElement('button');
                this.range_button.id = 'range-button';
                this.range_button.textContent = 'add numbers';
                this.input_1 = document.createElement('input');
                this.input_1.placeholder = (this.input_val_1).toString();
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
                this.runs_array = document.querySelectorAll('.run-container');
                this.inputs_array = document.querySelectorAll('.input_for_slider');
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
                if (this._returnRuns.length > 1) {
                    this.coords.contain_2 = this.run_contain_2.getBoundingClientRect();
                    this.coords.delta_2 = e.clientX - this.run_contain_2.getBoundingClientRect().left;
                }
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
            bindChangeInputValue(check_val, count_left) {
                let runs_array = this._returnRuns;
                this._returnInputs.forEach((inp, index) => {
                    inp.addEventListener('input', (e) => {
                        let correct_val = check_val(inp.id, this._coordsElem, inp.value);
                        inp.value = correct_val;
                        let lf = count_left(correct_val, this._coordsElem);
                        runs_array[index].style.left = lf;
                        this.changeRunsNums(correct_val, runs_array[index]);
                    });
                });
            }
            moveRuns(handler_move, count_num) {
                this._returnRuns.forEach((run, index) => {
                    run.onmousedown = (e) => {
                        run.ondragstart = (e) => {
                            return false;
                        };
                        let coords = this.resetCoords(e);
                        document.onmousemove = (e) => {
                            let lf = handler_move(run.id, coords, e.pageX);
                            console.log(lf, 5);
                            if (typeof lf === 'number') {
                                run.style.left = lf + 'px';
                                coords = this.resetCoords(e);
                                let val = count_num(run.id, coords);
                                this.changeInputVal(val, index);
                                this.changeRunsNums(val, run);
                            }
                        };
                        document.onmouseup = (e) => {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    };
                });
            }
            bindAddLegend(count_num) {
                this.range_button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.range_button.textContent = (this.range_button.textContent === 'add numbers') ? 'remove numbers' : 'add numbers';
                    this.addRemoveNums(count_num);
                });
            }
            addRunner() {
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
            addRemoveRunner() {
                if (this.interval_button.textContent === 'go to single') {
                    this.addRunner();
                }
                else {
                    if (this.field.lastChild.id === 'run-contain-2') {
                        this.field.removeChild(this.field.lastChild);
                    }
                }
            }
            addInput() {
                this.input_2 = document.createElement('input');
                this.input_2.classList.add('input_for_slider');
                this.input_2.id = 'input_for_2';
                this.input_2.style = this.input_1.style;
                this.input_2.style.left = (30).toString();
                this.form.append(this.input_2);
            }
            addRemoveInput() {
                if (this.interval_button.textContent === 'go to single') {
                    this.addInput();
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
                this.inputs_array = document.querySelectorAll('.input_for_slider');
                return this.inputs_array;
            }
            bindSlidersAdd(handler_move, count_num, check_val, count_left) {
                this.interval_button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.interval_button.textContent = (this.interval_button.textContent === 'go to range') ? 'go to single' : 'go to range';
                    this.addRemoveRunner();
                    this.addRemoveInput();
                    this.defineRuns();
                    this.defineInputs();
                    this.moveRuns(handler_move, count_num);
                    this.addRemoveNums(count_num);
                    this.bindChangeInputValue(check_val, count_left);
                });
            }
            addNums(count_num) {
                this._returnRuns.forEach((run, index) => {
                    const span = document.createElement('span');
                    span.innerText = count_num(run.id, this._coordsElem);
                    span.id = 'current-number' + index;
                    span.classList.add('change-number');
                    run.prepend(span);
                });
            }
            sliderActive(handle_move, count_left) {
                this.field.addEventListener('click', (e) => {
                    console.log(10);
                    let lf = handle_move(this.runs_array[0], this._coordsElem, e.pageX);
                    if (typeof lf === 'number') {
                        this.runs_array[0].style.left = lf;
                        let val = count_left(lf, this._coordsElem);
                        this.changeInputVal(val, 0);
                    }
                });
            }
            addRemoveNums(count_num) {
                if (this.range_button.textContent === 'remove numbers') {
                    this.addNums(count_num);
                }
                else {
                    this._returnRuns.forEach((run) => {
                        if (run.firstChild.classList.contains('change-number'))
                            run.removeChild(run.firstChild);
                    });
                }
            }
        },
        controller: class Controller {
            constructor(view, model) {
                this.handleCountMoveAt = (id, coords, value, pageX) => {
                    return this.model.countMoveAt(id, coords, value, pageX);
                };
                this.handleCountNum = (id, coords) => {
                    return this.model.countNumber(id, coords);
                };
                this.handleCheckValue = (id, coords, value) => {
                    return this.model.checkValue(id, coords, value);
                };
                this.handleCountRunCoords = (val, coords) => {
                    return this.model.countRunnersCoords(val, coords);
                };
                this.view = view;
                this.model = model;
                this.view.moveRuns(this.handleCountMoveAt, this.handleCountNum);
                this.view.bindChangeInputValue(this.handleCheckValue, this.handleCountRunCoords);
                this.view.bindSlidersAdd(this.handleCountMoveAt, this.handleCountNum, this.handleCheckValue, this.handleCountRunCoords);
                this.view.bindAddLegend(this.handleCountNum);
            }
            handleSliderActive() {
                this.view.sliderActive(this.handleCountMoveAt, this.handleCountRunCoords);
            }
        }
    };
    $.fn.eclecticSlider = function (method) {
        if (methods.controller[method]) {
            let slider = new methods.controller(new methods.view(), new methods.model());
            return slider[method];
        }
        else if (typeof method === 'object' || !method) {
            return new methods.controller(new methods.view(), new methods.model());
        }
        else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.tooltip');
        }
    };
})(jQuery);
