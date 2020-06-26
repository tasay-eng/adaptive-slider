import {Controller, Model, View} from '../../src/modules/fsd-slider';
let slider = new Controller(new View(), new Model());
describe('View', ()=>{
  beforeEach(() => {
    cy.visit('http://localhost:8080/dist/')
  })
  it('Can move runner', ()=>{
      let lf = slider.view.run_contain_1.left
      cy.get('.run-container').as('range')
        .trigger('mousedown')
        .trigger('mousemove', {clientX: 400})
      
      cy.get('@range').should(()=>{range.style.left !== lf})
        
      cy.get('.input_for_slide').as('inp')
        .should('have.value')
    })
// обработать ошибку при вводе нечислового значения
  it('Can fill the input of slider', ()=>{
      cy.get('.input_for_slider').as('inp')
        .type("26")
        .should('have.value', '26')
  })

  it('Trows the exeption of not number value', ()=>{
      cy.get('input_for_slider').as('inp')
        .type("tasay")
        .should((inp)=>{
          expect(func).to.throw('oops, it seems you typed not number value')
        })
  })

        
})