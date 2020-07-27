
interface EclecticOptions {
  outputSelector?: string;
  title?: string;
}

interface EclecticGlobalOptions {
  options: EclecticOptions;
}

interface EclecticSliderFunction {
  (options?: EclecticOptions): JQuery;
}

interface EclecticSlider extends EclecticGlobalOptions, EclecticSliderFunction { }
  
interface JQuery{
  eclecticSlider: EclecticSlider;
}



