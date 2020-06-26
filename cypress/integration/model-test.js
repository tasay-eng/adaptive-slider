import {Controller, Model, View} from '../../src/modules/fsd-slider';
let slider = new Controller(new Model(), new View());
let coords = {
    line_coords: {
        left: 0, 
        width: 200
    },
    contain_1: {
        left: 0,
        right: 190
    },
    delta_1: 0,
}

let coords_extend = {
    line_coords: {
        left: 0, 
        width: 200
    },
    contain_1: {
        left: 0,
        right: 10
    },
    delta_1: 0,
    contain_2: {
        left: 190,
        width: 10
    },
    delta_2: 0,

}

describe('Model', ()=>{

    describe('Converts the number to integer or float', ()=>{

        function makeTest_int(val) {
            let expected = parseInt(val)
            it('convert to integer', ()=> {
                assert.equal(typeof slider.model.parseNumber(val), typeof expected);
            });
        }

        makeTest_int(3.5, 1);

        function makeTest_float(val, step) {
            let expected = parseFloat(val)
            it('convert to float', ()=> {
                assert.equal(typeof slider.model.parseNumber(val, step), typeof expected);
            });
        }

        makeTest_float(2, 0,5);
        
    })

    describe('counts the style.left for the runner', ()=>{

        function make_test_1(pageX){
        
            let expected = slider.model.parseNumber(pageX - coords.delta_1 - coords.line_coords.left);
            it('counts left for the 1 runner WITHOUT the 2 runner', ()=> {
                expect(slider.model.countMoveAt('run-contain-1', coords, pageX)).to.eq(expected)
            });

        }

        function make_test_2(pageX){
            
            let expected = slider.model.parseNumber(pageX - coords_extend.delta_1 - coords_extend.line_coords.left);
            it('counts left for the 1 runner WITH the 2 runner', ()=> {
                expect(slider.model.countMoveAt('run-contain-1', coords_extend, pageX)).to.eq(expected)
            });

            expected = slider.model.parseNumber(pageX - coords_extend.delta_2 - coords_extend.line_coords.left); 
            it('counts left for the 2 runner', ()=> {
                expect(slider.model.countMoveAt('run-contain-2', coords_extend, pageX)).to.eq(expected)
            });

        }

        make_test_1(10)
        make_test_2(10)

    })

    describe('checks if the input value is proper', ()=>{

        function test_input(){
            it('checks if the 1st input value is proper WITHOUT 2nd input', ()=>{
                let expected = 75
                expect(slider.model.checkValue('input_for_1', coords, 75)).to.eq(expected)
            })

            it('checks if the 1st input value is proper WITH 2nd input', ()=>{
                let expected = 75
                expect(slider.model.checkValue('input_for_1', coords_extend, 75)).to.eq(expected)
            })
            
            it('checks if the 2nd input value is proper', ()=>{
                let expected = 75
                expect(slider.model.checkValue('input_for_2', coords_extend, 75)).to.eq(expected)
            })
        }

        test_input()
    })
    

    describe('counts the slider value from runner coords', ()=>{

        function test_count_1(){
            it('counts the slider value from 1st runner coords', ()=>{
                let expected = 0
                expect(slider.model.countNumber('run-contain-1', coords)).to.eq(expected)
            })
        }
        function test_count_2(){
            it('counts the slider value from 2nd runner coords', ()=>{
                let expected = 95
                expect(slider.model.countNumber('run-contain-2', coords_extend)).to.eq(expected)
            })
        }

        test_count_1()
        test_count_2()

    })
});