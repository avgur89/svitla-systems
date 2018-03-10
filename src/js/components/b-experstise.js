import { TimelineMax, TweenMax } from 'gsap';
import ScrollMagic from 'ScrollMagic';
import '../modules/dep/DrawSVGPlugin';
import Title from '../modules/dev/animation/title';
import { css, Resp } from '../modules/dev/helpers';

class Expertise {
	constructor() {
		this.el = '.expertise';
		this.$el = $(this.el);
		this.text = `${this.el}__text`;
		this.flagPlay = false;
		this.activeTl = new TimelineMax();
		this.activeTlTop = new TimelineMax();
		this.activeTlBot = new TimelineMax();
		this.minIndex = 6;
		this.maxIndex = 11;
		this.maxSubs = 7;
		this.minSubs = 5;
		
		if (this.$el.length) {
			this.init();
		}
	}
	
	init() {
		if (Resp.isDeskLg) {
			this.minIndex = 6;
			this.minSubs = 11;
		}
		
		if (Resp.isTablet) {
			this.maxIndex = 15;
			this.minIndex = 5;
			this.maxSubs = 16;
			this.minSubs = 4;
		}
		
		new Title(this.el, false);
		this.createController();
		this.startAnim();
		this.bindEvents();
	}
	
	bindEvents() {
		if (Resp.isDesk) {
			this.$navUl.on('mouseenter', () => {
				this.$navCircle.addClass(css.active);
			});
			this.$navUl.on('mouseleave', () => {
				this.$navCircle.removeClass(css.active);
			});
		} else {
			this.$navCircle.addClass(css.active);
		}
		
		this.$arrowPrev.on('click', () => {
			if (this.flagPlay) return;
			this.changeNav('prev');
		});
		
		this.$arrowNext.on('click', () => {
			if (this.flagPlay) return;
			this.changeNav('next');
		});
		
		this.$navLi.on('click', (e) => {
			if (this.flagPlay) return;
			this.changeNav($(e.currentTarget).index());
		});
	}
	
	/**
	 * Go to nav item
	 *
	 * @param {String|Number} direction - prev/next or number
	 */
	changeNav(direction) {
		let currentIndex = this.getActiveLi;
		
		if (direction === 'prev') {
			if (currentIndex === 0) return;
			
			this.setActiveLi(currentIndex - 1);
			this.changeSubnav(currentIndex - 1);
			this.animCircle(direction);
		} else if (direction === 'next') {
			if (currentIndex === this.$navLi.length - 1) return;
			
			this.setActiveLi(currentIndex + 1);
			this.changeSubnav(currentIndex + 1);
			this.animCircle(direction);
		} else if (typeof direction === 'number') {
			if (currentIndex === direction) return;
			
			this.setActiveLi(direction);
			this.changeSubnav(direction);
			
			if (currentIndex < direction) {
				this.animCircle('next');
			} else {
				this.animCircle('prev');
			}
		}
	}
	
	/**
	 * Change subnav items
	 *
	 * @param {String|Number} direction - prev/next or number
	 */
	changeSubnav(direction) {
		let $currentUl = this.$subnav().children().eq(0);
		let $newUl = this.$navLi.eq(direction).find('ul').clone();
		let tl = new TimelineMax({ paused: true });
		let speed = 0.5;
		let maxOffset = $newUl.children().length - this.maxSubs;
		
		if (maxOffset > this.minSubs) maxOffset = this.minSubs;
		
		$newUl.appendTo(this.$subnav());
		
		if (maxOffset > 0) {
			$newUl.css({
				'margin-top': (($newUl.children().length - this.maxSubs) * -.5 * $newUl.children().height()) + $newUl.children().height()/2
			});
		}
		
		tl
			.addLabel('go', 0)
			.to($currentUl, speed, {
				x: -20,
				alpha: 0,
				ease: Power1.easeIn,
				onComplete() {
					$(this.target).remove();
				}
			})
			.fromTo($newUl, speed * 2, {
				x: 60,
				alpha: 0
			}, {
				x: 0,
				ease: Power1.easeOut,
				onStart() {
					TweenMax.to(this.target, speed, {
						alpha: 1,
						delay: speed / 3,
						ease: Power1.easeInOut
					});
				}
			}, '-=' + speed / 3);
		
		tl.play();
	}
	
	/**
	 * get active nav item
	 *
	 * @return {Number}
	 */
	get getActiveLi() {
		return this.$navLi.filter('.' + css.active).index();
	}
	
	/**
	 * set active nav item
	 *
	 * @param {Number} index
	 */
	setActiveLi(index) {
		let nextIndex = index;
		let currentIndex = this.getActiveLi;
		let navOffset = -nextIndex * this.$navLi.height();
		let speed = 1;
		
		if (index === 0) {
			this.$arrowPrev.addClass(css.disabled);
		} else {
			this.$arrowPrev.removeClass(css.disabled);
		}
		
		if (index === this.$navLi.length - 1) {
			this.$arrowNext.addClass(css.disabled);
		} else {
			this.$arrowNext.removeClass(css.disabled);
		}
		
		this.activeTlTop.clear();
		this.activeTlBot.clear();
		this.activeTl.clear();
		
		this.$navLi.removeClass(css.active)
			.eq(nextIndex).addClass(css.active);
		
		if (nextIndex > currentIndex) {
			this.$navLi.each((index, el) => {
				if (index <= nextIndex + this.maxIndex &&
					$(el).css('pointer-events') === 'none' &&
					index > nextIndex) {
					this.activeTlBot
						.to(el, speed / 2, {
							alpha: 1,
							delay: speed / 10,
							onStart() {
								$(this.target).addClass(css.offTransition)
									.css('pointer-events', 'auto');
							},
							onComplete() {
								$(this.target).removeClass(css.offTransition);
							}
						}, '-=' + (speed / 2));
				} else if (index <= nextIndex - this.minIndex &&
					$(el).css('pointer-events') === 'auto') {
					this.activeTlTop
						.to(el, speed / 2, {
							alpha: 0,
							delay: speed / 10,
							onStart() {
								$(this.target).addClass(css.offTransition)
									.css('pointer-events', 'none');
							},
							onComplete() {
								$(this.target).removeClass(css.offTransition);
							}
						}, '-=' + (speed / 2));
				}
			});
		} else {
			$(this.$navLi.get().reverse()).each((index, el) => {
				if (this.$navLi.length - 1 - index > nextIndex + this.maxIndex &&
					$(el).css('pointer-events') === 'auto') {
					this.activeTlBot
						.to(el, speed / 2, {
							alpha: 0,
							delay: speed / 10,
							onStart() {
								$(this.target).addClass(css.offTransition)
									.css('pointer-events', 'none');
							},
							onComplete() {
								$(this.target).removeClass(css.offTransition);
							}
						}, '-=' + (speed / 2));
				} else if (this.$navLi.length - 1 - index > nextIndex - this.minIndex &&
					$(el).css('pointer-events') === 'none' &&
					this.$navLi.length - 1 - index < nextIndex) {
					this.activeTlTop
						.to(el, speed / 2, {
							alpha: 1,
							delay: speed / 10,
							onStart() {
								$(this.target).addClass(css.offTransition)
									.css('pointer-events', 'auto');
							},
							onComplete() {
								$(this.target).removeClass(css.offTransition);
							}
						}, '-=' + (speed / 2));
				}
			});
		}
		
		this.activeTlTop.play();
		this.activeTlBot.play();
		this.activeTl
			.to(this.$nav, speed, {
				y: navOffset,
				ease: Power2.easeInOut
			}, 0);
	}
	
	createController() {
		this.controller = new ScrollMagic.Controller();
	}
	
	startAnim() {
		let _this = this;
		this.exp = '.expertise-nav';
		this.$svg = $(`${this.exp}__svg`).find('svg');
		this.$navCircle = $(`${this.exp}__nav-circle`);
		this.$line = this.$svg.find('.line line');
		this.$circle = this.$svg.find('.circle circle');
		this.$sector = this.$svg.find('.sector circle');
		this.$nav = $(`${this.exp}__list`);
		this.$navUl = this.$nav.find('> ul');
		this.$navLi = this.$navUl.find('> li');
		this.$subnav = () => $(`${this.exp}__sublist`);
		this.circleLength = this.$circle.length;
		this.$arrowPrev = $(`${this.exp}__nav-circle-top`);
		this.$arrowNext = $(`${this.exp}__nav-circle-bot`);
		this.circlePos = [
			{ r: 0, alpha: 0 },
			{ r: 70 / 2, alpha: 0.05 },
			{ r: 270 / 2, alpha: 0.1 },
			{ r: 470 / 2, alpha: 0.2 },
			{ r: 670 / 2, alpha: 0.3 },
			{ r: 870 / 2, alpha: 0.4 },
			{ r: 1140 / 2, alpha: 0.5 },
			{ r: 1370 / 2, alpha: 0 }
		];
		let tl = new TimelineMax({ paused: true });
		let speed = 0.5;
		
		this.$arrowPrev.addClass(css.disabled);
		
		this.$navLi.eq(0).addClass(css.active)
			.find('ul').clone().appendTo(this.$subnav());
		TweenMax.set(this.$navCircle, { y: Resp.isDeskLg ? -400 : -230 });
		TweenMax.set(this.$navLi, { alpha: 0, y: -25 });
		TweenMax.set(this.$line, { alpha: 0 });
		TweenMax.set(this.$circle, { alpha: 0 });
		TweenMax.set(this.$sector, { rotation: -90, transformOrigin: 'center center', drawSVG: '0% 0%' });
		TweenMax.set(this.$subnav(), { alpha: 0, x: 50 });
		
		this.$navLi.css('pointer-events', 'none');
		
		tl
			.add('go')
			.to(this.$navCircle, speed, { y: '-50%', ease: Power1.easeOut }, 'go')
			.to(this.$line, speed, { alpha: 0.1, ease: Power1.easeOut }, 'go+=' + speed / 2)
			.add('circle');
		
		$(this.$circle.get().reverse()).each((index, el) => {
			let _this = this;
			let thisIndex = _this.circleLength - index - 1;
			
			if (thisIndex === 0) return;
			
			tl
				.add(TweenMax.to(el, speed * 3, {
					attr: {
						r: _this.circlePos[thisIndex].r
					},
					onStart() {
						TweenMax.to(this.target, speed, {
							alpha: _this.circlePos[thisIndex].alpha,
							delay: speed / 2
						});
					},
					ease: Power3.easeOut
				}), 'go+=' + ((index - 1) * 0.1 + speed / 2));
		});
		
		tl
			.staggerTo(this.$navLi, speed / 2, {
				y: 0,
				onStart() {
					if ($(this.target).index() <= _this.maxIndex) {
						TweenMax.to(this.target, speed, {
							alpha: 1,
							delay: speed / 4,
							onStart() {
								$(this.target).css('pointer-events', 'auto');
							}
						});
					}
				}
			}, 0.075, 'go+=' + speed / 2)
			.to(this.$subnav(), speed, {
				alpha: 1,
				x: 0,
				ease: Power1.easeInOut
			}, 'go+=' + speed * 5 / 2)
			.to(this.$sector.eq(0), speed * 3 / 2, {
				rotation: -40.5,
				transformOrigin: 'center center',
				drawSVG: '0% 22.5%',
				ease: Power1.easeInOut
			}, 'go+=' + speed * 3);
		
		tl.vars.onComplete = () => {
			$(this.exp).addClass(css.anim);
		};
		
		if (!Resp.isDesk) {
			tl.progress(1);
		}
		
		if (Resp.isDesk) {
			let triggerHook = 0.85;
			let triggerElement = this.$el.children().toArray();
			if (Resp.isDeskLg) {
				triggerHook = 0.8;
				triggerElement = this.$el.toArray();
			}
			new ScrollMagic.Scene({
				triggerElement: triggerElement,
				triggerHook: triggerHook
			})
				.on('start', function () {
					setTimeout(() => {
						tl.play();
					}, 1000);
				})
				.addTo(this.controller);
		}
	}
	
	/**
	 * Animate circles and sectors
	 *
	 * @param {String} direction - prev/next
	 */
	animCircle(direction) {
		let tl = new TimelineMax({ paused: true });
		let speed = 1.75;
		
		$(this.$circle.get().reverse()).each((index, el) => {
			let _this = this;
			let thisIndex = _this.circleLength - index;
			
			tl
				.addLabel('start', 0)
				.to(el, speed * 2 / 3, {
					attr: {
						r: _this.circlePos[thisIndex].r
					},
					alpha: _this.circlePos[thisIndex].alpha,
					ease: Power2.easeInOut
				}, 0)
				.set(this.$sector.eq(1), {
					rotation: -40.5,
					transformOrigin: 'center center',
					drawSVG: '0% 22.5%'
				}, 0);
		});
		
		if (direction === 'next') {
			tl
				.to(this.$sector.get(1), speed * 2.5 / 6, {
					rotation: 90,
					transformOrigin: 'center center',
					drawSVG: '0% 0%',
					ease: Power1.easeInOut
				}, 0)
				.set(this.$sector.eq(0), {
					rotation: -90,
					transformOrigin: 'center center',
					drawSVG: '0% 0%'
				}, 0)
				.to(this.$sector.get(0), speed * 2.5 / 6, {
					rotation: -40.5,
					transformOrigin: 'center center',
					drawSVG: '0% 22.5%',
					ease: Power1.easeInOut
				}, 'start+=' + speed / 6);
		} else if (direction === 'prev') {
			tl
				.to(this.$sector.get(1), speed * 2.5 / 6, {
					rotation: -90,
					transformOrigin: 'center center',
					drawSVG: '0% 0%',
					ease: Power1.easeInOut
				}, 0)
				.set(this.$sector.eq(0), {
					rotation: 90,
					transformOrigin: 'center center',
					drawSVG: '0% 0%'
				}, 0)
				.to(this.$sector.get(0), speed * 2.5 / 6, {
					rotation: -40.5,
					transformOrigin: 'center center',
					drawSVG: '0% 22.5%',
					ease: Power1.easeInOut
				}, 'start+=' + speed / 6);
		}
		
		function resetCircles() {
			let _this = this;
			this.$circle.each((index, el) => {
				TweenMax.set(el, {
					attr: {
						r: _this.circlePos[index].r
					},
					alpha: _this.circlePos[index].alpha
				});
			});
		}
		
		tl.vars.onStart = () => {
			this.flagPlay = true;
		};
		tl.vars.onComplete = () => {
			this.flagPlay = false;
			resetCircles.call(this);
		};
		tl.play();
	}
}

export default new Expertise();
