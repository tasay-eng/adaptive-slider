import $ from 'jquery';
import {Controller, Model, View} from './fsd-slider';
import './eclecticSlider' ;
 
function check_options(options, slider){
  if ( typeof options === 'object' ){
    return ()=> {
      for(let option in options){
        if (slider[option]) slider[option].apply( this, Array.from( options.option ));
        else {
          $.error( 'Метод с именем ' +  option + ' не существует для jQuery.tooltip' )
        };
      }
    } 
  } else if (typeof options === 'string' ) {
    return function(){
      Array.from( options ).forEach((option)=>{
        if(slider[option]) slider[option].call(this);
        else {
          $.error( 'Метод с именем ' +  option + ' не существует для jQuery.tooltip' )
        };
      })
    }
  } 
  return slider
}

$.fn.eclecticSlider = Object.assign<EclecticSliderFunction, EclecticGlobalOptions>(
  function (this: JQuery, options: EclecticOptions): JQuery {

    // Merge the global options with the options given as argument.
    options = $.extend({}, $.fn.eclecticSlider.options, options);

    // Check if required options are missing.
    /*if (!options.outputSelector) {
      console.error('Example plugin options are missing required parameter "outputSelector": ', JSON.stringify(options));
      return this;
    }*/

    // Do what the plugin should do. Here we create an instance of the separate service which is then used when the
    // user clicks the element that the plugin is attached to. It produces a greeting message and appends it to the output.
    let slider = new Controller(new View(), new Model())
    this.append(slider.view.interval_button, slider.view.range_button, slider.view.field, slider.view.input_1)
    check_options(options, slider)
        
    // Return the jQuery object for chaining.
    return this;
  },
  // Define the global default options.
  {
    options: {
      outputSelector: null
    }
  }
);





