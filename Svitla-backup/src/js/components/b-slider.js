import { TimelineMax, TweenMax } from 'gsap';
import SCROLL_TRIGGER_ANIMATIONS from '../modules/dev/animation/helpers/scrollTriggerAnimations';
import { css, Resp, svgIcon } from '../modules/dev/helpers';
import Dot from './dot';

class Slider {
	constructor() {
		this.el = '.slider';
		this.$el = $(this.el);
		this.flagDot = false;
		this.flagPlay = false;
		this.reverseAnim = false;
		this.$dotTarget = $('.slider__item-text-paragraph');
		
		if (this.$el.length) {
			this.$el.each((index, el) => {
				this.init(el);
			});
		}
	}
	
	init(el) {
		this.prepareSlider(el);
		this.initSwipe(el);
		this.dot();
	}
	
	dot() {
		new Dot(this.$dotTarget);
	}
	
	initSwipe(el) {
		let _this = this;
		let $container = $(el).find(this.el + '__in');
		
		$container.get(0).addEventListener('touchstart', handleTouchStart, false);
		$container.get(0).addEventListener('touchmove', handleTouchMove, false);
		
		let xDown = null;
		let yDown = null;
		
		function handleTouchStart(evt) {
			xDown = evt.touches[0].clientX;
			yDown = evt.touches[0].clientY;
		};
		
		function handleTouchMove(evt) {
			if (!xDown || !yDown) {
				return;
			}
			
			let xUp = evt.touches[0].clientX;
			let yUp = evt.touches[0].clientY;
			
			let xDiff = xDown - xUp;
			let yDiff = yDown - yUp;
			
			if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
				if (xDiff > 0) {
					/* left swipe */
					if (_this.flagPlay) return;
					
					let prevDot = _this.$dotsItem.filter('.' + css.active).next();
					if (!prevDot.length) { prevDot = _this.$dotsItem.first(); }
					
					_this.reverseAnim = true;
					prevDot.trigger('click');
				} else {
					/* right swipe */
					if (_this.flagPlay) return;
					
					let nextDot = _this.$dotsItem.filter('.' + css.active).prev();
					if (!nextDot.length) { nextDot = _this.$dotsItem.last(); }
					
					_this.reverseAnim = true;
					nextDot.trigger('click');
				}
			}
			/* reset values */
			xDown = null;
			yDown = null;
		};
	}
	
	initArrows() {
		let $arrowsContainer = this.$inner.parent();
		let $arrowLeft = $('<div></div>',
			{ class: `${this.el.substr(1)}__arrow ${this.el.substr(1)}__arrow_left` });
		let $arrowRight = $('<div></div>',
			{ class: `${this.el.substr(1)}__arrow ${this.el.substr(1)}__arrow_right` });
		const iconLeft = svgIcon('arrow-left');
		const iconRight = svgIcon('arrow-right');
		
		$arrowLeft.add($arrowRight).appendTo($arrowsContainer);
		$(iconLeft).appendTo($arrowLeft);
		$(iconRight).appendTo($arrowRight);
		
		$arrowLeft.on('click', () => {
			if (this.flagPlay) return;
			
			let nextDot = this.$dotsItem.filter('.' + css.active).prev();
			if (!nextDot.length) { nextDot = this.$dotsItem.last(); }
			
			this.reverseAnim = true;
			nextDot.trigger('click');
		});
		
		$arrowRight.on('click', () => {
			if (this.flagPlay) return;
			
			let prevDot = this.$dotsItem.filter('.' + css.active).next();
			if (!prevDot.length) { prevDot = this.$dotsItem.first(); }
			
			this.reverseAnim = true;
			prevDot.trigger('click');
		});
	}
	
	/**
	 *
	 * @param {Number} direction - number of slide
	 */
	changeSlide(direction) {
		let _this = this;
		let currentSlide = this.$item.filter(':visible');
		let delay = 0;
		if (Resp.isDesk) {
			delay = this.animSlide();
		}
		
		setTimeout(() => {
			let tl = new TimelineMax();
			
			if (Resp.isDesk) {
				currentSlide.hide();
				
				this.$item.eq(direction).show()
					.find(`${this.el}__item-text-paragraph`)
					.trigger('update.dot');
			} else {
				const anim = (el) => {
					tl.vars.onComplete = () => this;
					TweenMax.set(el, {
						y: 80,
						alpha: 0
					});
					
					let nextSlideItem = el.parent().parent(),
							$dotText = nextSlideItem.find('.slider__item-text-paragraph');
					
					nextSlideItem.addClass(css.active).show();
					($dotText.length) ? $dotText.trigger('update.dot') : null;
					
					tl
						.to(el.parent().next(), 0.5, {
							alpha: 1,
							ease: Power1.easeInOut
						})
						.staggerTo(el, 0.8, {
							y: 0,
							x: 0,
							ease: Power4.easeOut,
							onStart() {
								TweenMax.to($(this.target), 0.25, {
									alpha: 1,
									ease: Power2.easeIn
								});
							}
						}, 0.100, 0.5);
				};
				
				const animReverse = (el) => new Promise(resolve => {
					tl
						.to(el.parent().next(), 0.3, {
							alpha: 0,
							ease: Power1.easeInOut
						}, 0)
						.staggerTo(el, 0.2, {
							y: -20,
							alpha: 0,
							ease: Power1.easeIn
						}, 0.100 / 2, 0);
					
					tl.vars.onComplete = () => {
						el.parent().parent().hide();
						resolve();
					};
				});
				
				animReverse(currentSlide.find(`${this.el}__item-text`).children()).then(() => {
					anim(this.$item.eq(direction).find(`${this.el}__item-text`).children());
				});
			}
		}, delay * 1000);
	}
	
	prepareSlider(el) {
		this.$slider = $(el);
		this.$inner = this.$slider.find(this.el + '__inner');
		this.$item = this.$slider.find(this.el + '__item');
		this.$bg = this.$slider.find(this.el + '__bg');
		this.$paragraph = this.$slider.find(this.el + '__item-text-paragraph');
		this.itemLength = this.$item.length;
		this.$anim = this.$slider.find(this.el + '__anim');
		
		// this.initDotDotDot();
		
		if (this.itemLength < 2) return;
		
		this.initDots();
		this.initArrows();
		setTimeout(() => {
			this.$item.eq(0).addClass(css.active).nextAll().hide();
		}, 100);
		this.$slider.addClass(css.init);
		this.initScrollAnim(this.$inner, this.$bg);
	}
	
	/**
	 *
	 * @return {number} time of half anim duration
	 */
	animSlide() {
		let $circle = this.$anim.find('circle');
		let tl = new TimelineMax({ paused: true });
		let tlReverse = new TimelineMax({ paused: true });
		let speed = 1.25;
		
		$circle.attr({
			cx: 45,
			cy: 196,
			r: 14,
			'stroke-width': 14
		});
		
		tl
			.add('start')
			.to($circle.eq(0), speed, {
				attr: {
					'stroke-width': 451,
					r: 1100
				},
				ease: Power2.easeInOut
			}, 'start')
			.to($circle.eq(1), speed, {
				attr: {
					'stroke-width': 351,
					r: 750
				},
				ease: Power2.easeInOut
			}, 'start+=0.15')
			.to($circle.eq(2), speed, {
				attr: {
					'stroke-width': 451,
					r: 400
				},
				ease: Power2.easeInOut
			}, 'start+=0.3')
			.to($circle.eq(3), speed, {
				attr: {
					'stroke-width': 301,
					r: 50
				},
				ease: Power2.easeInOut
			}, 'start+=0.45');
		
		tlReverse
			.staggerTo($circle.toArray().reverse(), speed / 2, {
				attr: {
					'stroke-width': 0,
					r: '+=200'
				},
				ease: Power1.easeIn
			}, 0.15);
		
		let timeToNext = tl.duration() * 3 / 4;
		tlReverse.vars.onComplete = () => { this.flagPlay = false; };
		tl.vars.onStart = () => {
			this.flagPlay = true;
			setTimeout(() => {
				tlReverse.play();
			}, timeToNext * 1000);
		};
		tl.play();
		
		return timeToNext;
	}
	
	initDots() {
		let $dotsContainer = this.$slider.find(this.el + '__controls-dots');
		let $dots = $('<div></div>', { class: `${this.el.substr(1)}__dots dots dots_turquoise` });
		this.$dotsItem = $('<div></div>', { class: `dots__item` });
		let $dotsItemIn = $('<div></div>', { class: `dots__item-in` });
		let tl = new TimelineMax();
		const icon = `
			<div class="icon">
				<svg viewBox="0 0 8 8">
					<path d="M8,1.6L6.1,0C5.6,0.5,4.8,0.7,4,0.7C3.2,0.7,2.4,0.5,1.9,0L0,1.6C1,2.5,2.4,3,4,3C5.6,3,7,2.5,8,1.6z"/>
				</svg>
			</div>`;
		this.$item.each((index, el) => {
			if (index === 0) return;
			
			$(el).find('[data-anim-stagger]').removeAttr('data-anim-stagger');
		});
		$dots.appendTo($dotsContainer);
		for (let i = 0, len = this.$item.length; i < len; i++) {
			this.$dotsItem.clone()
				.wrapInner($dotsItemIn.clone().wrapInner($(icon)))
				.appendTo($dots);
		}
		this.$dotsItem = $dots.children();
		this.$dotsItem.eq(0).addClass(css.active);
		this.$inner.eq(0).addClass(css.active);
		
		this.$dotsItem.on('click', (e) => {
			e.preventDefault();
			if (this.flagPlay) return;
			let $this = $(e.currentTarget);
			let index = $this.index();
			
			TweenMax.set(this.$anim, { rotation: 0 });
			if (this.$dotsItem.filter('.' + css.active).index() === this.itemLength - 1 &&
				index === 0 &&
				this.reverseAnim) {
				TweenMax.set(this.$anim, { rotation: 180 });
			} else if (this.$dotsItem.filter('.' + css.active).index() === 0 &&
				index === this.$item.length - 1 &&
				this.reverseAnim) {
				TweenMax.set(this.$anim, { rotation: 0 });
			} else if (index > this.$dotsItem.filter('.' + css.active).index()) {
				TweenMax.set(this.$anim, { rotation: 180 });
			}
			
			this.reverseAnim = false;
			
			if (!$this.hasClass(css.active)) {
				this.$dotsItem.removeClass(css.active);
				$this.addClass(css.active);
				this.changeSlide(index);
			}
		});
	}
	
	initScrollAnim($container, $anim, func = false) {
		new SCROLL_TRIGGER_ANIMATIONS({
			container: $container.get(0),
			onStart() {
				setTimeout(() => {
					if (func) {
						func();
					} else {
						$anim.addClass(css.anim);
					}
				}, 200);
			}
		});
	}
}

export default new Slider();
