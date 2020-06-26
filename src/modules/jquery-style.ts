import {Controller, Model, View} from './fsd-slider';
(function( $ ) {

        $.fn.eclecticSlider = function( methods ) {
            if ( typeof methods === 'object' ) {
              let slider = new Controller(new View(), new Model())
              return function() {
                  for(let method in methods){
                    if (slider[method]) slider[method].apply( this, Array.from( methods.method ));
                    else $.error( 'Метод с именем ' +  methods + ' не существует для jQuery.tooltip' );
                  }
              }
            } else if (typeof methods === 'string' ) {
              let slider = new Controller(new View(), new Model());
              return function(){
                Array.from( methods ).forEach((method)=>{
                  if(slider[method]) slider[method].call(this);
                  else $.error( 'Метод с именем ' +  methods + ' не существует для jQuery.tooltip' );
                })
              }
            } else {
              return new Controller(new View(), new Model());
            } 
        };
  })(jQuery);