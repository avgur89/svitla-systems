import { TimelineMax, TweenMax } from 'gsap';
import '../modules/dep/DrawSVGPlugin';
import enquire from '../modules/dep/enquire';
import { css, resp } from '../modules/dev/helpers';

export default class Link {
	constructor(el, options = {}) {
		this.$el = el;
		this.type = options.type || 'circle';
		this.state = options.state || false;
		
		this.init();
	}
	
	init() {
		switch (this.type) {
			case 'circle':
				this.initLinkBtn();
				break;
			case 'multiple':
				this.initLinkCircleBtn(3, false);
				break;
			case 'single':
				this.initLinkCircleBtn(1, false);
				break;
			case 'single-reverse':
				this.initLinkCircleBtn(1, true);
				break;
			case 'close':
				this.initCloseBtn();
				break;
			case 'menu':
				this.initMenuBtn();
				break;
			case 'vertical':
				this.initVerticalBtn();
				break;
			default:
				return;
		}
	}
	
	initLinkBtn() {
		const iconContainer = `<div class="icon-w"></div>`;
		const icon = `
			<div class="icon icon-circle">
				<svg viewBox="0 0 12 12">
	        <path d="M6,2c2.2,0,4,1.8,4,4s-1.8,4-4,4S2,8.2,2,6S3.8,2,6,2"></path>
	      </svg>
			</div>`;
		
		this.$el.each((index, el) => {
			const $el = $(el);
			const $iconContainer = $(iconContainer);
			const $icon = $(icon);
			const $path = $icon.find('path');
			let tl = new TimelineMax({ paused: true });
			
			$iconContainer.appendTo($el);
			$icon.appendTo($iconContainer);
			enquire.register(resp.mobile, () => { Link.prepareAnimLinkBtn($path); });
			enquire.register(resp.tablet, () => { Link.prepareAnimLinkBtn($path); });
			enquire.register(resp.desk, () => { Link.prepareAnimLinkBtn($path); });
			this.animLinkBtn($el, $path, tl);
		});
	}
	
	static prepareAnimLinkBtn($path) {
		TweenMax.set($path, {
			clearProps: 'all'
		});
		TweenMax.set($path, {
			drawSVG: '0%',
			rotation: 30,
			transformOrigin: 'center center'
		});
	}
	
	animLinkBtn($el, $path, tl) {
		tl
			.to($path, 0.3, {
				drawSVG: '0% 100%',
				ease: Power2.easeIn
			})
			.set($path, {
				rotation: 140,
				transformOrigin: 'center center'
			})
			.to($path, 0.3, {
				drawSVG: '66.666% 100%',
				ease: Power2.easeOut
			});
		
		if (this.state === 'header') {
			let sleep = false;
			
			$el.parent().on('mouseenter', (e) => {
				$(e.currentTarget).on('mouseleave', () => {
					sleep = true;
				});
				
				setTimeout(() => {
					if (!sleep) {
						if ($(e.currentTarget).hasClass(css.active)) return;
						tl.progress(0, false).play();
						$(e.currentTarget).addClass(css.active);
					}
					
					sleep = false;
				}, 100);
				sleep = false;
			});
		} else {
			$el.on('mouseenter', () => {
				tl.progress(0, false).play();
			});
		}
		
		if (this.state !== 'header') {
			$el.on('mouseleave', () => {
				tl.pause();
				TweenMax.to($path, 0.3, {
					drawSVG: '100% 100%',
					ease: Power2.easeInOut
				});
			});
		}
	}
	
	initLinkCircleBtn(n, reverse) {
		const iconContainer = `<div class="icons-w"></div>`;
		const icon = `
			<div class="icon icon-circle">
				<svg viewBox="0 0 12 12">
	        <path d="M6,2c2.2,0,4,1.8,4,4s-1.8,4-4,4S2,8.2,2,6S3.8,2,6,2"></path>
	      </svg>
			</div>`;
		const N = n;
		
		this.$el.each((index, el) => {
			const $el = $(el);
			const $iconContainer = $(iconContainer);
			const $icon = $(icon);
			let tl = new TimelineMax({ paused: true });
			
			reverse ? $iconContainer.prependTo($el) : $iconContainer.appendTo($el);
			for (let i = 0; i < N; i++) {
				$icon.clone().appendTo($iconContainer);
				// $icon.clone().appendTo($iconContainer);
				// reverse ? $icon.clone().prependTo($iconContainer) : $icon.clone().appendTo($iconContainer);
			}
			
			const $path = $iconContainer.find('path');
			enquire.register(resp.mobile, () => { Link.prepareAnimLinkCircleBtn($path); });
			enquire.register(resp.tablet, () => { Link.prepareAnimLinkCircleBtn($path); });
			enquire.register(resp.desk, () => { Link.prepareAnimLinkCircleBtn($path); });
			Link.animLinkCircleBtn($el, $path, tl);
		});
	}
	
	static prepareAnimLinkCircleBtn($path) {
		TweenMax.set($path, {
			clearProps: 'all'
		});
		TweenMax.set($path, {
			drawSVG: '66.666% 100%',
			rotation: 140,
			transformOrigin: 'center center'
		});
	}
	
	static animLinkCircleBtn($el, $path, tl) {
		tl
			.to($path, 0.6, {
				rotation: 500,
				transformOrigin: 'center center',
				ease: Power1.easeInOut
			});
		if (!$el.hasClass('filters__item__link')) {
			$el.on('mouseenter', () => {
				tl.progress(0, false).play();
			});
		}
	}
	
	initCloseBtn() {
		const iconContainer = `<div class="icon-w"></div>`;
		const icon = `
			<div class="icon icon_top">
				<svg viewBox="0 0 28 28">
	        <circle cx="14" cy="14" r="10"/>
	      </svg>
			</div>
			<div class="icon icon_bot">
				<svg viewBox="0 0 28 28">
	        <circle cx="14" cy="14" r="10"/>
	      </svg>
			</div>`;
		
		this.$el.each((index, el) => {
			const $el = $(el);
			const $iconContainer = $(iconContainer);
			const $icon = $(icon);
			let tl = new TimelineMax({ paused: true });
			
			$iconContainer.appendTo($el);
			$icon.appendTo($iconContainer);
			
			const $iconTop = $iconContainer.find('.icon_top');
			const $iconBot = $iconContainer.find('.icon_bot');
			const $circleTop = $iconTop.find('circle');
			const $circleBot = $iconBot.find('circle');
			
			enquire.register(resp.mobile, () => {
				Link.prepareCloseBtnTop($circleTop);
				Link.prepareCloseBtnBot($circleBot);
			});
			enquire.register(resp.tablet, () => {
				Link.prepareCloseBtnTop($circleTop);
				Link.prepareCloseBtnBot($circleBot);
			});
			enquire.register(resp.desk, () => {
				Link.prepareCloseBtnTop($circleTop);
				Link.prepareCloseBtnBot($circleBot);
			});
			Link.animCloseBtn($el, $iconTop, $iconBot, $circleTop, $circleBot, tl);
		});
	}
	
	static prepareCloseBtnTop($path) {
		TweenMax.set($path, {
			clearProps: 'all'
		});
		TweenMax.set($path, {
			drawSVG: '75% 100%',
			rotation: 133,
			transformOrigin: 'center center'
		});
	}
	
	static prepareCloseBtnBot($path) {
		TweenMax.set($path, {
			clearProps: 'all'
		});
		TweenMax.set($path, {
			drawSVG: '75% 100%',
			rotation: -47,
			transformOrigin: 'center center'
		});
	}
	
	static animCloseBtn($el, $iconTop, $iconBot, $pathTop, $pathBot, tl) {
		tl
			.to($pathTop, 0.4, {
				drawSVG: '0% 100%',
				rotation: 270,
				transformOrigin: 'center center',
				ease: Power1.easeInOut
			}, 0)
			.to($pathBot, 0.4, {
				drawSVG: '0% 100%',
				rotation: 90,
				transformOrigin: 'center center',
				ease: Power1.easeInOut
			}, 0)
			.add('next')
			.to($iconTop, 0.4, {
				y: 12,
				ease: Power1.easeInOut
			}, 'next')
			.to($iconBot, 0.4, {
				y: -12,
				ease: Power1.easeInOut
			}, 'next')
			.set($iconBot, { alpha: 0 });
		$el.on('mouseenter', () => {
			tl.pause();
			tl.play();
		});
		$el.on('mouseleave', () => {
			tl.pause();
			tl.reverse();
		});
	}
	
	initMenuBtn() {
		const iconContainer = `<div class="icon-w"></div>`;
		const icon = `
			<div class="icon icon_top">
				<svg viewBox="0 0 28 28">
	        <circle cx="14" cy="14" r="10"/>
	      </svg>
			</div><div class="icon icon_mid">
				<svg viewBox="0 0 28 28">
	        <circle cx="14" cy="14" r="10"/>
	      </svg>
			</div><div class="icon icon_bot">
				<svg viewBox="0 0 28 28">
	        <circle cx="14" cy="14" r="10"/>
	      </svg>
			</div>`;
		
		this.$el.each((index, el) => {
			const $el = $(el);
			const $iconContainer = $(iconContainer);
			const $icon = $(icon);
			let tl = new TimelineMax({ paused: true });
			let tlReverse = new TimelineMax({ paused: true });
			
			$iconContainer.appendTo($el);
			$icon.appendTo($iconContainer);
			
			const $circle = $icon.find('circle');
			
			enquire.register(resp.mobile, () => { Link.prepareMenuBtn($circle); });
			enquire.register(resp.tablet, () => { Link.prepareMenuBtn($circle); });
			enquire.register(resp.desk, () => { Link.prepareMenuBtn($circle); });
			Link.animMenuBtn($el, $icon, $circle, tl);
		});
	}
	
	static prepareMenuBtn($path) {
		TweenMax.set($path, {
			clearProps: 'all'
		});
		TweenMax.set($path, {
			drawSVG: '75% 100%',
			rotation: -47,
			transformOrigin: 'center center'
		});
	}
	
	static animMenuBtn($el, $icon, $path, tl) {
		TweenMax.set($icon, { y: 0 });
		tl
			.to($path, 0.4, {
				drawSVG: '0% 100%',
				rotation: 270,
				transformOrigin: 'center center',
				ease: Power1.easeInOut
			}, 0)
			.to($icon, 0.4, {
				y: -8,
				ease: Power1.easeInOut
			}, 0)
			.addLabel('next')
			.to($icon.eq(0), 0.4, {
				y: 4,
				ease: Power1.easeInOut
			}, 'next')
			.to($icon.eq(1), 0.4, {
				y: -8,
				ease: Power1.easeInOut
			}, 'next')
			.to($icon.eq(2), 0.4, {
				y: -20,
				ease: Power1.easeInOut
			}, 'next')
			.set($icon.eq(0), { alpha: 0 }, '-=0.1')
			.set($icon.eq(2), { alpha: 0 }, '-=0.1');
		
		$el.on('mouseenter', () => {
			tl.pause();
			tl.play();
		});
		$el.on('mouseleave', () => {
			tl.pause();
			tl.reverse();
		});
	}
	
	initVerticalBtn() {
		const iconContainer = `<div class="icons-w"></div>`;
		const icon = `
			<div class="icon icon-circle">
				<svg viewBox="0 0 12 12">
	        <path d="M6,2c2.2,0,4,1.8,4,4s-1.8,4-4,4S2,8.2,2,6S3.8,2,6,2"></path>
	      </svg>
			</div>`;
		const N = 3;
		
		this.$el.each((index, el) => {
			const $el = $(el);
			const $iconContainer = $(iconContainer);
			const $icon = $(icon);
			let tl = new TimelineMax({ paused: true });
			
			$iconContainer.prependTo($el);
			for (let i = 0; i < N; i++) {
				$icon.clone().appendTo($iconContainer);
			}
			
			const $path = $iconContainer.find('path');
			enquire.register(resp.mobile, () => { Link.prepareVerticalBtn($path); });
			enquire.register(resp.tablet, () => { Link.prepareVerticalBtn($path); });
			enquire.register(resp.desk, () => { Link.prepareVerticalBtn($path); });
			Link.animVerticalBtn($el, $path, tl);
		});
	}
	
	static prepareVerticalBtn($path) {
		TweenMax.set($path, {
			clearProps: 'all'
		});
		TweenMax.set($path, {
			drawSVG: '66.666% 100%',
			rotation: 320,
			transformOrigin: 'center center'
		});
	}
	
	static animVerticalBtn($el, $path, tl) {
		tl
			.to($path, 0.6, {
				rotation: 680,
				transformOrigin: 'center center',
				ease: Power1.easeInOut
			});
		setInterval(() => {
			if ($el.hasClass(css.active)) return;
			
			tl.progress(0, false).play();
		}, 3000);
	}
}

// export const LinkAPI = new Link();
