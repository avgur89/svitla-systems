import { TimelineMax, TweenMax } from 'gsap';
import ScrollMagic from 'ScrollMagic';
import '../../dep/SplitText';
import { $window, css, Resp } from '../helpers';

export default class Title {
	/**
	 * Title animation
	 *
	 * @param {String} el
	 * @param {Boolean} logo - play logo animaten (default true)
	 */
	constructor(el, logo = true) {
		this.el = el;
		this.$el = $(this.el);
		this.logo = logo;
		
		$window.on('load', () => {
			this.init();
		});
	}
	
	init() {
		this.createController();
		this.animTitle();
	}
	
	createController() {
		this.controller = new ScrollMagic.Controller();
	}
	
	animTitle() {
		const icon = `
			<svg viewBox="0 0 12 12">
        <path d="M6,2c2.2,0,4,1.8,4,4s-1.8,4-4,4S2,8.2,2,6S3.8,2,6,2"></path>
      </svg>`;
		let $title = $(this.el + '__title');
		let tl = new TimelineMax({ paused: true });
		let splitText = new SplitText($title, {
			linesClass: this.el.substr(1) + '__title-line',
			wordsClass: this.el.substr(1) + '__title-word',
			charsClass: this.el.substr(1) + '__title-char',
			position: 'absolute'
		});
		
		if ($title.find('.' + splitText.vars.linesClass).length > 1) {
			splitText.revert();
			$title
				.addClass(css.small)
				.attr('style', '')
				.attr('data-anim-stagger', 'fade-top');
			
			new ScrollMagic.Scene({
				triggerElement: $title.get(0),
				triggerHook: 0.85
			})
				.on('start', function () {
					if ($title.hasClass(css.anim)) return;
					$title.addClass(css.anim);
					TweenMax.to($title, 0.8, {
						y: 0,
						x: 0,
						ease: Power4.easeOut,
						onStart() {
							if ($(this.target).data('anim-parent-trigger')) {
								$(this.target).parent().addClass(css.anim);
							}
							
							TweenMax.to($(this.target), 0.5, {
								alpha: 1,
								ease: Power2.easeIn
							});
						}
					});
				})
				.addTo(this.controller);
			
			return;
		}
		
		$(splitText.chars).each((index, el) => {
			let $el = $(el);
			let random = Math.floor(Math.random() * 4) + 2;
			
			if (this.logo) {
				if (!Resp.isMobile) {
					if ($el.text() === 'e') {
						$(icon).appendTo($el);
					}
				}
			}
			
			switch (random) {
				case 1:
					break;
				case 2:
					$el.css('transform', 'rotateY(180deg)');
					break;
				case 3:
					$el.css('transform', 'rotateX(180deg)');
					break;
				case 4:
					$el.css('transform', 'rotateY(120deg)');
					break;
				case 5:
					$el.css('transform', 'rotateX(120deg)');
					break;
				default:
					return;
			}
		});
		
		if (navigator.appVersion.indexOf('Win') !== -1) {
			$title.find('svg').css('margin-top', '13px');
		}
		
		let $path = $title.find('path');
		TweenMax.set($path, {
			drawSVG: '0%',
			rotation: 128,
			transformOrigin: 'center center'
		});
		
		tl
			.fromTo(splitText.lines, 1, {
				y: '100%'
			}, {
				y: '0%',
				ease: Power2.easeOut
			}, 0)
			.to(splitText.chars, 0.8, {
				transform: 'rotateX(0deg) rotateY(0deg)',
				ease: Power1.easeOut,
				delay: 0.2
			}, 0);
		tl.vars.onStart = () => {
			setTimeout(function () {
				animPath();
			}, tl.duration() * 1000 / 3);
		};
		
		function animPath() {
			$path.each((index, el) => {
				let $thisPath = $(el);
				
				TweenMax.to($thisPath, 0.6, {
					drawSVG: '0% 25%',
					rotation: 311,
					transformOrigin: 'center center',
					ease: Power1.easeOut,
					delay: Math.floor(Math.random() * 5) / 10
				});
			});
		}
		
		new ScrollMagic.Scene({
			triggerElement: $title.get(0),
			triggerHook: 0.85
		})
			.on('start', function () {
				if ($title.hasClass(css.anim)) return;
				tl.play();
				$title.addClass(css.anim);
			})
			.addTo(this.controller);
	}
}
