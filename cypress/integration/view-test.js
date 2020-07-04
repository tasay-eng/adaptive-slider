import {Controller, Model, View} from '../../src/modules/fsd-slider';
let slider = new Controller(new View(), new Model());
describe('View', ()=>{
  beforeEach(() => {
    cy.visit('http://localhost:8080/docs/')
  })
  it('Can move runner-1', ()=>{
      let lf_1 = slider.view.run_contain_1.left
      let val_1 = slider.view.input_1.value
      let num_1 = slider.view.current_number_1.innerText
      cy.get('#run-contain-1').as('range')
        .trigger('mousedown')
        .trigger('mousemove', '20', '0')
        .trigger('mouseup')
      
      cy.get('@range')
        .its('style.left').to.equal('20')
        
      cy.get('#input_for_1').as('inp')
        .its('value').to.not.equal(val_1)

      cy.get('#current-number-1').as('num')
        .its('innerText').to.not.equal(num_1)
    })

  it('Can move runner-2', ()=>{
      let lf_2 = slider.view.run_contain_2.left
      let val_2 = slider.view.input_2.value
      cy.get('#run-contain-2').as('range')
        .trigger('mousedown')
        .trigger('mousemove', '-20', '0')
        .trigger('mouseup')
      
      cy.get('@range')
        .its('style.right').to.equal('20')
        
      cy.get('#input_for_2').as('inp')
        .its('value').to.not.equal(val_2)
    })

    it('Can move runner through the slider field ', ()=>{
      let lf_1 = slider.view.run_contain_1.left
      let num_1 = slider.view.current_number_1.innerText
      cy.get('#slider-field').as('field')
        .click('80', '0')

      cy.get('#run-contain-1').as('range')
        .its('style.left').to.equal('80')

      cy.get('#current-number-1').as('num')
        .its('innerText').to.not.equal(num_1)
  })
// обработать ошибку при вводе нечислового значения
  it('Can fill the input of slider', ()=>{
      let lf_1 = slider.view.run_contain_1.left
      cy.get('#input_for_1').as('inp')
        .type("26")
        .should('have.value', '26')

      cy.get('#run-contain-1').as('range')
        .its('style.left').to.not.equal(lf_1)

      cy.get('#current-number-1').as('num')
        .its('innerText').to.equal('26')
  })

  it('Trows the exeption of not number value', ()=>{
      let inp_2 = slider.view.input_2
      let err_input = slider.model.inputValueError
      cy.get('#input_for_2').as('inp')
        .type("tasay")
          
        expect(err_input).to.throw('oops, it seems you typed not number value')
  })

        
})