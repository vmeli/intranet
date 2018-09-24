<section class="org-section-bloques__SliderMain">
	<div class="cgrid-container">
		<div class="mol-slider_Main" id="mol-slider_Main">
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide my-slider-content my-slider">
						<div id="my-slider">
							<div class="js-Carousel_slide-items">
								<div class="Format1__slider">
									<figure class="Format1__figure">
										<a href="">
											<img src="./frontend/assets/images/desing/home.png" alt="">
										</a>
									</figure>
									<a href="" class="Format1__text">
										<h2 class="Format1__title">Invitación: Charla informativa EPS</h2>
									</a>
								</div>
							</div>
								<div class="js-Carousel_slide-items">
								<div class="Format1__slider">
									<figure class="Format1__figure">
										<a href="">
											<img src="./frontend/assets/images/desing/modalv1.png" alt="">
										</a>
									</figure>
									<a href="" class="Format1__text">
										<h2 class="Format1__title">Invitación: Charla informativa EPS</h2>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>	
	</div>
</section>

var sliderColumnistas = tns({
	container: '#my-slider',
	speed: 400,
	arrowKeys: true,
	responsive: true,
	autoplay: true,
	items: 1,
	animateIn: 'tns-fadeIn',
	controlsText: ['<i class="mega-octicon octicon-chevron-left"></i>', '<i class="mega-octicon octicon-chevron-right"></i>']
});