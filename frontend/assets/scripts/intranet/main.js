window.addEventListener('load', function () {
    vanillaCalendar.init({
        disablePastDays: true
    });
	var sliderGaleria = new Carousel({
		elem: 'mol-slider_Main',
		touch: true,
		autoplay: false,
		infinite: false,
		interval: 3500,
		initial: 0,
		dots: true,
		arrows: true,
		resize: true,
		arrowPrev: 'js-Carousel_slide-button-prev',
		arrowNext: 'js-Carousel_slide-button-next'
	});
	//sliderGaleria.init();
})

