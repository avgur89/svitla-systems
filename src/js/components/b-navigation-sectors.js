import { css } from '../modules/dev/helpers';
import { TimelineMax, TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';

class SliderSectorNavigation {
	constructor() {
		this.$sectorsContainer = $('.navigation-sectors');
		this.$sectorItem = this.$sectorsContainer.find('.navigation-sectors__item');
		this.$sectorCircleField = this.$sectorsContainer.find('.navigation-sectors__circle');
		this.$sectorCircle = this.$sectorsContainer.find('.navigation-sectors__circle-border');
		this.init();
	}
	
	init() {
		if (this.$sectorsContainer.length) {
			this.initSectors();
			this.changeSlide();
		}
	}

	initSectors() {
		let radius;
		let $hoverBlock = $('.navigation-sectors__hover-block');
		
		$hoverBlock.eq(0).addClass('is-active');
		radius = this.$sectorsContainer.width() * 2;
		
		this.$sectorItem.each((index, el) => {
			let $el = $(el),
				sectorCount = this.$sectorItem.length;
			
			// Set active sector:
			if (index === 0) {
				$el.addClass(css.active);
			} else {
				if (index === 1) $el.addClass(css.hide);
				radius = radius - 2 * $el.width();
			}
			
			// Set css properties for animation circle:
			this.$sectorCircleField.eq(sectorCount - index - 1).css({
				'width': radius + 'px',
				'height': radius + 'px',
				'border-width': ($el.width() - 1) + 'px',
				'z-index': index + 2
			});
			
			this.$sectorCircle.eq(sectorCount - index - 1).css({
				'width': radius + 'px',
				'height': radius + 'px',
				'border-width': $el.width() + 'px',
				'z-index': index + 2
			});
			
			$hoverBlock.eq(sectorCount - index - 1).css({
				'width':  radius + 'px',
				'height': radius + 'px',
				'z-index': index + 2
			});
		});
	}

	changeSlide() {
		this.$sectorItem.on('click tap', function (e) {
			e.preventDefault();
			let $this = $(e.currentTarget),
					currentIndex = $this.index() - 2;
			
			if ($this.hasClass(css.active)) {
				return false;
			} else {
				$('.navigation-sectors').toggleClass(css.hide);
				$('.slider-inner__item').removeClass(css.anim);
				setTimeout(function () {
					// $('.navigation-sectors__hover-item').removeClass(css.anim);
					$('.navigation-sectors__hover-block').removeClass(css.active);
					$('.navigation-sectors__item.is-active').removeClass(css.active);
					$('.navigation-sectors__item.is-overflow').removeClass(css.overflow);
					$this.addClass(css.active);
					$('.slider-inner__item').eq(currentIndex).addClass(css.anim);
					$('.navigation-sectors__hover-block').eq(currentIndex).addClass(css.active);
					$('.navigation-sectors__item.is-active').prev('.navigation-sectors__item').addClass(css.overflow);
					$('.navigation-sectors').toggleClass(css.hide);
				}, 800);
				
				//Change slick-slide:
				setTimeout(function () {
					$('.slick-dots li').eq(currentIndex).trigger('click');
				}, 600);
				
			}
		});
		
		$('.navigation-sectors').on('mouseleave', function (e) {
			$('.navigation-sectors__hover-block').removeClass(css.anim);
		});
		
		this.$sectorItem.hover(
			function() {
				$('.navigation-sectors__hover-block').removeClass(css.anim);
				$('.navigation-sectors__hover-block').eq($(this).index() - 2).addClass(css.anim);
			}
		);
		
	}
}

export default new SliderSectorNavigation();
