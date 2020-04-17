class Model {
    constructor() {
        this.setStartingRange();
        this.setStartCoords();
    }
    resetCoords(e, elem) {
        this.coords = {
            line_coords: document.querySelector('#slider-field').getBoundingClientRect(),
            elem_coords: e.target.parentNode.getBoundingClientRect(),
            delta: e.clientX - e.target.parentNode.getBoundingClientRect().left,
        };
        if (e.target.id === 'runner-1' && e.target.nextSibling) {
            this.coords.sibs_coords = e.target.parentNode.nextSibling.getBoundingClientRect();
        }
        else if (e.target.id === 'runner-2') {
            this.coords.sibs_coords = e.target.parentNode.previousSibling.getBoundingClientRect();
        }
    }
    setStartCoords() {
        this.coords = {
            line_coords: document.querySelector('#slider-field').getBoundingClientRect(),
            elem_coords: document.querySelector('#runner-1').getBoundingClientRect(),
            delta: 0
        };
    }
    setStartingRange() {
        this.min = 0;
        this.max = 100;
    }
    get _resCoords() {
        return this.coords;
    }
    moveAt(e) {
        let coords = this._resCoords;
        if (e.target.classList.contains('runner')) {
            console.log(coords);
            let pre = parseFloat((e.pageX - coords.delta - coords.line_coords.left).toString());
            let check = (pre >= -5 && pre <= (coords.line_coords.width - coords.elem_coords.width));
            if (e.target.id === 'runner-1' && check) {
                if (coords.sibs_coords) {
                    let pre_run1 = coords.sibs_coords.left - coords.elem_coords.width;
                    if (pre < pre_run1)
                        e.target.style.left = pre + 'px';
                }
                else {
                    e.target.parentNode.style.left = pre + 'px';
                }
            }
            else if (e.target.id === 'runner-2' && check) {
                let pre_run2 = coords.sibs_coords.left + coords.elem_coords.width;
                if (pre > pre_run2)
                    e.target.parentNode.style.left = pre + 'px';
            }
        }
    }
    countNumber() {
        let coords = this._resCoords;
        console.log(coords, 2);
        console.log(coords.elem_coords.left, coords.line_coords.left, coords.line_coords.width, 3);
        let num = parseInt(((coords.elem_coords.left - coords.line_coords.left) / coords.line_coords.width) * (this.max));
        console.log(num, 4);
        return num;
    }
    onMouseDown(e) {
        if (e.target.classList.contains('runner')) {
            this.resetCoords(e);
            this.moveAt(e);
        }
    }
}
class View {
    constructor() {
        this.form = document.querySelector('.eclecticSlider');
        this.field = document.createElement('div');
        this.field.id = 'slider-field';
        this.interval_button = document.createElement('button');
        this.interval_button.id = 'interval-button';
        this.interval_button.textContent = 'go to range';
        this.range_button = document.createElement('button');
        this.range_button.id = 'range-button';
        this.range_button.textContent = 'add numbers';
        this.run_container1 = document.createElement('div');
        this.run_container1.classList.add('val-changer');
        this.run_container1.id = 'run-contain-1';
        this.run1 = document.createElement('span');
        this.run1.classList.add('runner');
        this.run1.id = 'runner-1';
        this.run_container1.append(this.run1);
        this.form.append(this.interval_button, this.range_button, this.field, this.run_container1);
    }
    bindOnMouseDown(handler_down, handler_move, count_num, change_text) {
        this.form.onmousedown = function (e) {
            if (e.target.classList.contains('runner')) {
                e.target.parentNode.ondragstart = function (e) {
                    return false;
                };
                handler_down(e);
                document.onmousemove = function (e) {
                    handler_move(e);
                    if (e.target.classList.contains('runner') && e.target.previousSibling) {
                        let num = count_num();
                        console.log(num, 5);
                        change_text(e.target.previousSibling, num);
                    }
                };
                e.target.onmouseup = function (e) {
                    document.onmousemove = null;
                    e.target.onmouseup = null;
                };
            }
        };
    }
    bindAddLegend(display_nums, define, count_nums) {
        this.range_button.addEventListener('click', function (e) {
            e.preventDefault();
            this.textContent = (this.textContent === 'add numbers') ? 'remove numbers' : 'add numbers';
            let runs_array = define();
            display_nums(runs_array, count_nums);
        });
    }
    get buttonValue() {
        return this.interval_button.value;
    }
    addRunner(button, form) {
        if (button.textContent === 'go to single') {
            const run2 = document.createElement('span');
            const run1 = document.querySelector('#runner-1');
            const run_container1 = document.querySelector('#run-contain-1');
            const run_container2 = document.createElement('div');
            run_container2.id = 'run-contain-2';
            run_container2.classList.add('val-changer');
            run2.id = 'runner-2';
            run2.classList.add('runner');
            run_container2.style = run_container1.style;
            run_container2.style.right = (-5).toString();
            run2.style = run1.style;
            run_container2.append(run2);
            form.append(run_container2);
        }
        else {
            if (form.lastChild.id === 'run-contain-2') {
                form.removeChild(form.lastChild);
            }
        }
    }
    defineNodelist() {
        this.runs_array = document.querySelectorAll('.val-changer');
        return this.runs_array;
    }
    changeTextContent(elem, val1, val2) {
        if (val1 && val2) {
            elem.textContent = val1 ? val2 : val1;
        }
        else if (val1) {
            elem.textContent = val1;
        }
    }
    bindSlidersAdd(add_run, display_nums, define, count_num) {
        this.interval_button.addEventListener('click', function (e) {
            e.preventDefault();
            this.textContent = (this.textContent === 'go to range') ? 'go to single' : 'go to range';
            add_run(e.target, e.target.parentNode);
            let runs_array = define();
            display_nums(runs_array, count_num);
        });
    }
    setStartingButton(val, text) {
        this.interval_button.value = val;
        this.interval_button.textContent = text;
    }
    displayNums(runs_array, count_num) {
        if (this.range_button.textContent === "remove numbers") {
            runs_array.forEach((run, index) => {
                console.log(runs_array);
                console.log(run);
                const span = document.createElement('span');
                span.innerText = count_num();
                console.log(span.innerText, 6);
                span.id = 'current-number' + index;
                span.classList.add('change-number');
                run.prepend(span);
            });
        }
        else {
            runs_array.forEach((run) => {
                console.log(runs_array);
                console.log(run);
                console.log(run.firstChild);
                if (run.firstChild.classList.contains('change-number'))
                    run.removeChild(run.firstChild);
            });
        }
    }
}
class Controller {
    constructor(view, model) {
        this.handleOnMouseDown = (e) => {
            this.model.onMouseDown(e);
        };
        this.handleMoveAt = (e) => {
            this.model.moveAt(e);
        };
        this.handleAddRunner = (val, form) => {
            this.view.addRunner(val, form);
        };
        this.handleDefineRuns = () => {
            return this.view.defineNodelist();
        };
        this.handleDisplayNumber = (runs_array, count_num) => {
            this.view.displayNums(runs_array, count_num);
        };
        this.handleAddLegend = (display_nums, define, count_num) => {
            this.view.bindAddLegend(display_nums, define, count_num);
        };
        this.handleCountNum = () => {
            return this.model.countNumber();
        };
        this.handleChangeText = (elem, val1, val2) => {
            this.view.changeTextContent(elem, val1, val2);
        };
        this.view = view;
        this.model = model;
        this.view.setStartingButton('single', 'go to range');
        this.view.bindSlidersAdd(this.handleAddRunner, this.handleDisplayNumber, this.handleDefineRuns, this.handleCountNum);
        this.view.bindOnMouseDown(this.handleOnMouseDown, this.handleMoveAt, this.handleCountNum, this.handleChangeText);
        this.view.bindAddLegend(this.handleDisplayNumber, this.handleDefineRuns, this.handleCountNum);
    }
    handleGetButtonValue() {
        return this.view.buttonValue;
    }
}
const slider = new Controller(new View(), new Model());
