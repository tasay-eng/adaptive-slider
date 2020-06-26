import {Controller} from '../../src/fsd-slider';
import {Model} from '../../src/fsd-slider';
import {View} from '../../src/fsd-slider';

describe('Model functions', ()=>{

    describe('Converts the number to integer or float', ()=>{
        cy.on('uncaught:exception', (err, runnable) => {
            return false
          })

        function makeTest_int(val) {
            let expected = parseInt(val)
            it('convert to integer', function() {
                assert.equal(Model.parseNumber(val), expected);
            });
        }

        for (let i = 0; i <= 5; i+1) {
            makeTest_int(i);
        }

        function makeTest_float(val) {
            let expected = parseFloat(val)
            it('convert to float', function() {
                assert.equal(Model.parseNumber(val), expected);
            });
        }

        for (let i = 0; i <= 3; i+0,3) {
            makeTest_float(i);
        }

    })

    describe('counts the style.left for the element'), ()=>{
        let coords = {
            line_coords: {
                left: 0, 
                width: 70
            },
            contain_1: {
                left: 0
            },
            delta_1: 0,
        }

        function makeTest_left_1(pageX) {
            let expected = pageX - delta - coords.line_coords.left;
            it('counts left for first slider', function() {
                expect(Model.countMoveAt('run-contain-1', coords, pageX)).to.eq(expected)
            });
        }
        
        for(let p = 0; p <= 50; p+5){
            makeTest_left_1(p)
        }
    }

    describe('counts the slider value depending coords', ()=>{
        
    })
});