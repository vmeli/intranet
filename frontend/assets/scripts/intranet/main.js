window.addEventListener('load', function () {
    vanillaCalendar.init({
        disablePastDays: true
    });
    var swiper = new Swiper('.swiper-container', {
		effect: 'fade',
			autoplay: {
			delay: 3000,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
    });

	//var sliderGaleria = new Carousel({
	//	elem: 'mol-slider_Main',
	//	touch: true,
	//	autoplay: true,
	//	infinite: true,
	//	interval: 3000,
	//	initial: 0,
	//	dots: true,
	//	arrows: true,
	//	resize: true,
	//	arrowPrev: 'js-Carousel_slide-button-prev',
	//	arrowNext: 'js-Carousel_slide-button-next'
	//});
	//sliderGaleria.init();
})

