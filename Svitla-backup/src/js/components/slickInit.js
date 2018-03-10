import '../../../node_modules/dotdotdot/src/js/jquery.dotdotdot';
import Dot from '../components/dot';
import { AnimLinesAPI } from './animLines';
import { css, Resp } from '../modules/dev/helpers';
import 'slick-carousel';

class SlickInit {
	constructor() {
		this.$slider = $('.slider-inner');
		
		if (this.$slider.length) {
			this.sliderClients = $('.slider-inner__slides_clients');
			this.sliderDevelopers = $('.slider-inner__slides_developers');
			this.sliderArticles = $('.slider-inner__slides_articles');
			this.sliderSectors = $('.slider-inner__slides_sectors');
			this.sliderCountry = $('.slider-inner__slides_country');
			this.sliderTimeline = $('.slider-inner__slides_timeline');
			this.sliderGallery = $('.slider-inner__slides_gallery');
			
			this.init();
		}
	}
	init() {
		AnimLinesAPI.init();
		
		if (this.sliderClients.length) this.initClientsSlider();
		if (this.sliderDevelopers.length) this.initDevelopersSlider();
		if (this.sliderArticles.length) this.initArticlesSlider();
		if (this.sliderSectors.length) this.initSectorsSlider();
		if (this.sliderCountry.length) this.initCountrySlider();
		if (this.sliderTimeline.length) this.initTimelineSlider();
		if (this.sliderGallery.length) this.initGallerySlider();
	}
	
	initClientsSlider() {
		const $slides = $(this.sliderClients),
					$prevArrow = $('.slider-inner__arrows_clients .slider-inner__prev'),
					$nextArrow = $('.slider-inner__arrows_clients .slider-inner__next');
		
		// Init slider:
		$slides.slick({
			rows: 2,
			infinite: false,
			autoplay: false,
			dots: false,
			cssEase: 'linear',
			slidesToShow: 4,
			slidesToScroll: 4,
			prevArrow: $prevArrow,
			nextArrow: $nextArrow,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						rows: 3,
						slidesToShow: 2,
						slidesToScroll: 2,
					}
				}
			],
		});
	}
	
	initDevelopersSlider() {
		const $slides = $(this.sliderDevelopers),
					$prevArrow = $('.slider-inner__arrows_developers .slider-inner__prev'),
					$nextArrow = $('.slider-inner__arrows_developers .slider-inner__next');
		
		// Init slider:
		$slides.slick({
			infinite: false,
			autoplay: false,
			dots: false,
			cssEase: 'linear',
			slidesToShow: 4,
			slidesToScroll: 4,
			prevArrow: $prevArrow,
			nextArrow: $nextArrow,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					},
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					}
				}
			],
		});
	}
	
	initArticlesSlider() {
		const $slides = $(this.sliderArticles),
					$prevArrow = $('.slider-inner__arrows_articles .slider-inner__prev'),
					$nextArrow = $('.slider-inner__arrows_articles .slider-inner__next');
		
		// Init slider:
		$slides.slick({
			infinite: false,
			autoplay: false,
      accessibility: false,
			dots: false,
			speed: 400,
			cssEase: 'linear',
			slidesToShow: 2,
			slidesToScroll: 2,
			prevArrow: $prevArrow,
			nextArrow: $nextArrow,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
					},
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					}
				},
				{
					breakpoint: 460,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					}
				}
			],
		});
	}
	
	initSectorsSlider() {
		const $slides = $(this.sliderSectors),
					$prevArrow = $('.slider-inner__arrows_sectors .slider-inner__prev'),
					$nextArrow = $('.slider-inner__arrows_sectors .slider-inner__next');
		
		// Add anim class first slides after init slider:
		$slides.on('init', function(event, slick){
			$slides.find('.slick-active').addClass(css.anim);
		});
		
		// Init slider:
		$slides.slick({
			dots: true,
			fade: true,
			swipe: false,
			autoplay: false,
			slidesToShow: 1,
			cssEase: 'ease-out',
			prevArrow: $prevArrow,
			nextArrow: $nextArrow,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						swipe: true,
						fade: false,
						slidesToScroll: 1,
						adaptiveHeight: true
					}
				}
			],
		});
	}
	
	initCountrySlider() {
		const $slides = $(this.sliderCountry),
					$prevArrow = $('.slider-inner__arrows_country .slider-inner__prev'),
					$nextArrow = $('.slider-inner__arrows_country .slider-inner__next'),
					$sliderItems = $slides.find('.country__item'),
					$slidesArrows = $('.slider-inner__arrows_country'),
					$colSmall = $('.slider-inner_country .col__small');
		
		switch (true) {
			case (Resp.isDesk && $sliderItems.length < 6):
				$slidesArrows.addClass(css.hide);
				return false;
				break;
			case (Resp.isTablet && $sliderItems.length < 5):
				$slidesArrows.addClass(css.hide);
				$slides.addClass('no-slick');
				$colSmall.hide();
				return false;
				break;
			case (Resp.isMobile && $sliderItems.length < 3):
				$slidesArrows.addClass(css.hide);
				$slides.addClass('no-slick');
				$colSmall.hide();
				return false;
				break;
			default:
				initSlider();
		};
		
		// Init slider:
		function initSlider() {
			$slides.slick({
				infinite: false,
				autoplay: false,
				dots: false,
				cssEase: 'linear',
				slidesToShow: 5,
				slidesToScroll: 5,
				prevArrow: $prevArrow,
				nextArrow: $nextArrow,
				responsive: [
					{
						breakpoint: 1200,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3,
						},
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3,
						}
					},
					{
						breakpoint: 400,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
						}
					}
				],
			});
		}
	}
	
	initTimelineSlider() {
		const $slides = $(this.sliderTimeline),
					$timeline = $('.timeline'),
					slideCount = $timeline.length,
					slideAnimationTime = 200;
		
		// Dot timeline-slider content descr:
		new Dot($('.timeline__text'));
		
		// Handler click/touch events after slick init:
		$slides.on('init', function(event, slick) {
			const imgItem = $slides.find('img'),
						$prevArrow = $('.slider-inner__prev'),
						$nextArrow = $('.slider-inner__next');
			
			arrowRefresh();
			
			// Click/tap handler:
			setTimeout(function () {
				imgItem.on('click tap', function () {
					let nextSlideIndex = $(this).closest('.timeline').data('slick-index'),
						currentIndex = getCurrentSlide(),
						offsetSlide_1 = 2,
						offsetSlide_2 = 3,
						offsetSlide_3 = 5;
					
					$slides.addClass(css.active);
					if (currentIndex === nextSlideIndex) {
						return false;
					}
					
					if (Resp.isTablet)  {
						offsetSlide_1 = 1,
							offsetSlide_2 = offsetSlide_3 = 2;
					}
					
					if (currentIndex < 2) {
						nextSlideIndex < 2 ? $slides.slick('slickGoTo', 0) : $slides.slick('slickGoTo', nextSlideIndex - offsetSlide_1);
						$timeline.removeClass('slick-current');
						$timeline.eq(nextSlideIndex).addClass('slick-current');
					} else {
						if (nextSlideIndex > slideCount - offsetSlide_2) {
							$slides.slick('slickGoTo', slideCount - offsetSlide_3);
						} else {
							$slides.slick('slickGoTo', nextSlideIndex - offsetSlide_1);
						}
						$timeline.removeClass('slick-current');
						$timeline.eq(nextSlideIndex).addClass('slick-current');
					}
					arrowRefresh();
				});
			}, slideAnimationTime);
			
			// Arrow handler (left and right):
			$prevArrow.on("click tap", () => {
				getPrev();
				setTimeout(function () {
					arrowRefresh();
				}, slideAnimationTime);
			});
			
			$nextArrow.on("click tap", () => {
				getNext();
				setTimeout(function () {
					arrowRefresh();
				}, slideAnimationTime);
			});
			
			function arrowRefresh() {
				$prevArrow.removeClass('slick-disabled');
				$nextArrow.removeClass('slick-disabled');
				
				if ($timeline.eq(0).hasClass('slick-current')) {
					$prevArrow.addClass('slick-disabled');
				}
				if ($timeline.eq(slideCount - 1).hasClass('slick-current')) {
					$nextArrow.addClass('slick-disabled');
				}
			}
		});
		
		// Init slider:
		$slides.slick({
			infinite: false,
			swipe: false,
			autoplay: false,
			slidesToShow: 5,
			arrows: false,
			speed: slideAnimationTime,
			centerPadding: '10px',
      rows: 0,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 768,
					settings: {
						speed: 500,
						swipe: true,
						slidesToShow: 1,
						slidesToScroll: 1,
					}
				}
			]
		});
		
		function getPrev() {
			const currentIndex = getCurrentSlide(),
						nextIndex = currentIndex - 1;
			
			$slides.addClass(css.active);
			
			if (Resp.isMobile) {
				$slides.slick('slickGoTo', nextIndex);
				$timeline.removeClass('slick-current');
				$timeline.eq(nextIndex).addClass('slick-current');
			} else {
				setTimeout(function () {
					if (currentIndex === 0) {
						return false;
					} else {
						if (currentIndex < 3) {
							$slides.slick('slickGoTo', 0);
						} else {
							Resp.isDesk ? $slides.slick('slickGoTo', nextIndex - 2) : $slides.slick('slickGoTo', nextIndex - 1);
						}
						$timeline.removeClass('slick-current');
						$timeline.eq(nextIndex).addClass('slick-current');
					}
				}, slideAnimationTime);
			}
		};
		
		function getNext() {
			const currentIndex = getCurrentSlide(),
						nextIndex = currentIndex + 1;
			
			$slides.addClass(css.active);
			
			if (Resp.isMobile) {
				
				if (currentIndex === slideCount - 1) {
					$slides.slick('slickGoTo', 0);
					$timeline.removeClass('slick-current');
					$timeline.eq(0).addClass('slick-current');
				} else {
					$slides.slick('slickGoTo', nextIndex);
					$timeline.removeClass('slick-current');
					$timeline.eq(nextIndex).addClass('slick-current');
				}
			} else {
				setTimeout(function () {
					if (currentIndex === slideCount - 1) {
						$slides.slick('slickGoTo', 0);
						$timeline.removeClass('slick-current');
						$timeline.eq(0).addClass('slick-current');
					} else {
						if (currentIndex < 1) {
							$slides.slick('slickGoTo', 0);
						} else {
							Resp.isDesk ? $slides.slick('slickGoTo', nextIndex - 2) : $slides.slick('slickGoTo', nextIndex - 1);
						}
						$timeline.removeClass('slick-current');
						$timeline.eq(nextIndex).addClass('slick-current');
					}
				}, slideAnimationTime);
			}
		};
		
		function getCurrentSlide() {
			return $slides.find('.slick-current').data('slick-index');
		};
	}
	
	initGallerySlider() {
		const $slides = $(this.sliderGallery),
					$prevArrow = $('.slider-inner__arrows_gallery .slider-inner__prev'),
					$nextArrow = $('.slider-inner__arrows_gallery .slider-inner__next'),
					$sliderSlide = $slides.find('.slider-inner__item'),
					slideCount = $sliderSlide.length,
					$sliderPreviewTarget = $('.slider-inner__preview img');
		
		let showCount;
		switch (true) {
			case Resp.isDesk:
				slideCount < 5 ? showCount = slideCount : showCount = 5;
				break;
			case Resp.isTablet:
				slideCount < 4 ? showCount = slideCount : showCount = 4;
				break;
			default:
				showCount = 2;
		}
		
		$slides.on('init', function(event, slick) {
			let currentImgSrc = $slides.find('.slick-slide img').eq(0).attr('src');

			$sliderPreviewTarget.attr("src", currentImgSrc);
			arrowRefresh();
		});

		$slides.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
			let nextImgSrc = $slides.find('.slick-slide img').eq(nextSlide).attr('src');

			$sliderPreviewTarget.attr("src", nextImgSrc);
		});

		$sliderSlide.on("click tap", function () {
			let $this = $(this),
					nextImgSrc = $this.find('img').attr('src');
			
			$sliderSlide.removeClass('slick-current');
			$this.addClass('slick-current');
			$sliderPreviewTarget.attr("src", nextImgSrc);
			arrowRefresh()
		});
		
		$prevArrow.on("click tap", () => {
			const currentIndex = getCurrentSlide(),
						prevIndex = currentIndex - 1,
						nextImgSrc = $sliderSlide.eq(prevIndex).find('img').attr('src');
			
			if (currentIndex !== 0) {
				$slides.slick('slickGoTo', prevIndex);
				$sliderSlide.removeClass('slick-current');
				$sliderSlide.eq(prevIndex).addClass('slick-current');
				$sliderPreviewTarget.attr("src", nextImgSrc);
			}
			arrowRefresh()
		});
		
		$nextArrow.on("click tap", () => {
			const currentIndex = getCurrentSlide(),
						nextIndex = currentIndex + 1,
				nextImgSrc = $sliderSlide.eq(nextIndex).find('img').attr('src');
			
			if (currentIndex !== slideCount - 1) {
				$slides.slick('slickGoTo', nextIndex);
				$sliderSlide.removeClass('slick-current');
				$sliderSlide.eq(nextIndex).addClass('slick-current');
				$sliderPreviewTarget.attr("src", nextImgSrc);
			}
			arrowRefresh();
		});
		
		// Init slider:
		$slides.slick({
			infinite: false,
			autoplay: false,
			swipe: false,
			arrows: false,
			dots: false,
			speed: 400,
			cssEase: 'linear',
			slidesToShow: showCount,
			slidesToScroll: showCount,
			prevArrow: $prevArrow,
			nextArrow: $nextArrow
		});
		
		function arrowRefresh() {
			$prevArrow.removeClass('slick-disabled');
			$nextArrow.removeClass('slick-disabled');
			
			if ($sliderSlide.eq(0).hasClass('slick-current')) {
				$prevArrow.addClass('slick-disabled');
			}
			if ($sliderSlide.eq(slideCount - 1).hasClass('slick-current')) {
				$nextArrow.addClass('slick-disabled');
			}
		}
		
		function getCurrentSlide() {
			return $slides.find('.slick-current').data('slick-index');
		};
	}
}

export default new SlickInit();