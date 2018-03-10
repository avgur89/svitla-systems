import { TimelineMax, TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import Dot from '../components/dot';
import ScrollMagic from 'ScrollMagic';
import '../modules/dep/DrawSVGPlugin';
import Sector from '../modules/dev/animation/sector';
import { $body, $scrolledElements, currentPage, $window, css, Resp } from '../modules/dev/helpers';
import Link from './link';
import { PreloaderAPI } from './preloader';

class Screen {
	constructor() {
		this.screen = '.screen';
		this.$screen = $('.screen');
		this.$slider = $('.screen__slider');
		this.$scrollBtn = $('.screen__scroll');
		this.$video = () => this.$screen.find('video');
		this.$title = this.$screen.find('.screen__title');
		this.startTl = new TimelineMax({ paused: true });
		this.$button = this.$screen.find('.screen__btn');
		this.$svg = this.$screen.find('.screen__svg');
		this.$sector = this.$svg.find('.screen__svg-path');
		this.$blogDescription = $('.screen__description_blog');
		this.$mainScreenDescr = $('.screen__description-bot');
		this.sliderSpeed = 6;
		this.sector = {};
	}
	
	init() {
		if (this.$screen.length) {
			this.setScreenHeight();
			this.initScrollBtn();
			if (Resp.isDesk) {
				setTimeout(() => {
					this.initVideo();
				}, 0);
			}
			this.createController();
			this.createAnimTitle();
			this.createAnimButton();
			this.createAnimLine();
			this.createAnimSector();
			this.createAnimSectorSmall();
			this.prepareText();
			this.dot();
		}
	}
	
	dot() {
		if (this.$blogDescription.length === 0) {
			new Dot(this.$mainScreenDescr);
		}
	}
	
	setScreenHeight() {
		let mainScreen = document.getElementsByClassName("screen")[0];
		if (!Resp.isMobile || (Resp.isMobile && (window.innerWidth > window.innerHeight))) {
			getFullHeight(mainScreen);
		}
		
		if (Resp.isMobile) {
			//$window.on('resize', ()=> {
			//	if (window.innerWidth > window.innerHeight) {
			//		getFullHeight(mainScreen);
			//	} else {
			//		mainScreen.removeAttribute("style");
			//	}
			//});
		} else {
			window.addEventListener("orientationchange", () => {
				setTimeout(function () {
					getFullHeight(mainScreen);
				}, 5);
			});
		}
		
		function getFullHeight(screen) {
			if ($('.show-video').length !== 0) return false;

			screen.style.setProperty("height", window.innerHeight + "px", "important");
			screen.style.setProperty("min-height", window.innerHeight + "px", "important");
		}
	}
	
	prepareText() {
		let textTl = new TimelineMax();
		let $item = this.$slider.children();
		let splitText = [];
		let speed = 1;
		
		if ($item.hasClass('screen__slider-item')) {
			$item.each((index, el) => {
				if (Resp.isMobile) {
					splitText.push(new SplitText(el, {}));
				} else {
					splitText.push(new SplitText(el, {
						linesClass: this.screen.substr(1) + '__slider-item-line',
						wordsClass: this.screen.substr(1) + '__slider-item-word',
						charsClass: this.screen.substr(1) + '__slider-item-char'
					}));
				}
			});
		} else return false;

		textTl.staggerTo($($(splitText[0].words).toArray().reverse()), speed, {
			autoAlpha: 1,
			y: 0,
			ease: Power1.easeOut
		}, 0.175);
		
		this.startTl.add(textTl, 0.75);
		
		$item.eq(0).addClass(css.active);
		
		this.changeText = () => {
			let changeTextTl = new TimelineMax();
			let currentIndex = $item.filter('.' + css.active).index();
			let nextIndex = currentIndex + 1 < $item.length ? currentIndex + 1 : 0;
			
			changeTextTl
				.staggerTo($($(splitText[currentIndex].words).toArray().reverse()), speed / 2, {
					autoAlpha: 0,
					y: 15,
					ease: Power1.easeIn
				}, 0.1)
				.staggerFromTo($($(splitText[nextIndex].words).toArray().reverse()), speed, {
					autoAlpha: 0,
					y: -30
				}, {
					autoAlpha: 1,
					y: 0,
					ease: Power1.easeOut
				}, 0.175)
				.add(() => {
					$item.eq(currentIndex).removeClass(css.active);
					$item.eq(nextIndex).addClass(css.active);
				});
		};
	}
	
	createAnimSectorSmall() {
		let sectorSmallTl = new TimelineMax();
		this.$sectorSmall = this.$screen.find('.screen__svg-circle circle');
		let speed = 1;
		
		TweenMax.set(this.$sectorSmall, {
			alpha: 1,
			drawSVG: '100% 100%',
			rotation: -90,
			transformOrigin: 'center center'
		});
		
		sectorSmallTl.to(this.$sectorSmall, speed, {
			drawSVG: '0% 25%',
			rotation: -135,
			transformOrigin: 'center center',
			onComplete() {
				$('.preloader').hide();
			}
		});
		
		this.startTl.add(sectorSmallTl, 0.5);
	}
	
	nextSlide() {
		this.nextTl = new TimelineMax();
		let speed = 1;
		
		this.nextTl
			.set(this.$sectorSmall, {
				drawSVG: '0% 25%',
				rotation: -135,
				transformOrigin: 'center center'
			})
			.to(this.$sectorSmall, speed, {
				drawSVG: '75% 100%',
				rotation: -45,
				transformOrigin: 'center center'
			});
		
		setTimeout(() => {
			this.sector.nextSlide();
			if (!this.$screen.hasClass(this.screen.substr(1) + '_no-sector')) {
				this.sector.nextSlide();
			}
		}, speed / 3 * 1000);
		this.changeText();
	}
	
	createAnimSector() {
		this.sector = new Sector();
		
		this.startTl.add(() => { this.sector.startAnim(); }, 0.25);
	}
	
	createAnimLine() {
		let $line = $('.screen__svg-line path');
		let lineTl = new TimelineMax();
		let speed = 0.5;
		
		TweenMax.set($line, {
			alpha: 1,
			drawSVG: '0% 0%'
		});
		
		lineTl
			.to($line, speed, {
				drawSVG: '66.666% 33.333%',
				ease: Power1.easeIn
			})
			.to($line, speed, {
				drawSVG: '100% 100%',
				ease: Power1.easeOut
			});
		
		this.startTl.add(lineTl, 0);
	}
	
	createAnimButton() {
		this.startTl.add(() => {
			if (this.$button.get(0) !== undefined && this.$button.get(0).hasAttribute('data-prepare-anim')) {
				this.$button.removeAttr('data-prepare-anim');
			}
		}, 1.25);
	}
	
	playStartAnim() {
		PreloaderAPI.wait().then(() => {
			this.startTl.play();
		});
	}
	
	createAnimTitle() {
		$window.on('load', () => {
			this.titleTl = new TimelineMax();
			this.$title.each((index, el) => {
				
				if (longestWord(this.$title.text()) > 8) {
					this.$title.addClass('screen__title_small');
				}
				
				this.animTitle(el, index);
				
				// Get longest word length:
				function longer(champ, contender) {
					return (contender.length > champ.length) ? contender: champ;
				}
				function longestWord(str) {
					let words = str.split(' ');

					return words.reduce(longer).length;
				}
			});
			
			this.startTl.add(this.titleTl, 0.75);
			this.playStartAnim();
		});
	}
	
	animTitle(el, index) {
		let $title = $(el);
		let tl = new TimelineMax();
		
		let splitText = new SplitText($title, {
			linesClass: this.screen.substr(1) + '__title-line',
			wordsClass: this.screen.substr(1) + '__title-word',
			charsClass: this.screen.substr(1) + '__title-char',
			position: 'relative'
		});
		
		tl.set($title.parent(), { alpha: 1 });
		
		$(splitText.chars).each((index, el) => {
			let $el = $(el);
			let random = Math.floor(Math.random() * 4) + 2;
			
			switch (random) {
				case 1:
					break;
				case 2:
					$el.css('transform', 'rotateY(180deg)');
					break;
				case 3:
					$el.css('transform', 'rotateX(180detg)');
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
		
		tl
			.fromTo(splitText.lines, 1, {
				y: '100%',
				opacity: 0
			}, {
				y: '0%',
				opacity: 1,
				ease: Power2.easeOut
			}, 0)
			.to(splitText.chars, 0.8, {
				transform: 'rotateX(0deg) rotateY(0deg)',
				ease: Power1.easeOut,
				delay: 0.2
			}, 0);
		
		this.titleTl.add(tl, index * 0.25);
	}
	
	initScrollBtn() {
		let _this = this;
		let $btn = this.$scrollBtn;
		let $btnText = $btn.find('span');
		this.scrollTl = new TimelineMax();
		let speed = 0.5;
		
		_this.startTl.add(_this.scrollTl, 1.75);
		
		new Link($btn, { type: 'vertical' });
		
		$btnText.addClass(css.offTransition);
		
		let $btnCircle = $btn.find('path');
		TweenMax.set($btnText, { y: 21 });
		setTimeout(() => {
			$btnText.removeClass(css.offTransition);
		}, 0);
		
		TweenMax.set($btn, { alpha: 1 });
		
		TweenMax.set($btnCircle, {
			drawSVG: '0% 0%',
			rotation: 90,
			transformOrigin: 'center center'
		});
		
		this.scrollTl
			.to($btnText, speed, {
				y: 0,
				ease: Power1.easeOut,
				onStart() { $(this.target).addClass(css.offTransition); },
				onComplete() { $(this.target).removeClass(css.offTransition); }
			}, 0)
			.staggerTo($($btnCircle.toArray().reverse()), speed, {
				drawSVG: '0% 90%',
				rotation: 135,
				transformOrigin: 'center center',
				ease: Power1.easeIn,
				onComplete() {
					TweenMax.to(this.target, speed, {
						drawSVG: '66.666% 100%',
						rotation: 320,
						transformOrigin: 'center center',
						ease: Power1.easeOut,
						onComplete() {
							setTimeout(() => {
								_this.$scrollBtn.removeClass(css.active);
							}, 1000);
						}
					});
				}
			}, 0.125, '-=0.1');
		
		$btn.on('click', () => {
			$scrolledElements.animate({scrollTop: window.innerHeight}, 1000, "linear", function(){
				$body.removeClass(css.overflow);
			});
			
			_this.$screen.off('mousewheel DOMMouseScroll');
		});
		
		if (Resp.isDesk) {
			if ( !$('.page-404').length > 0 ) {
				PreloaderAPI.wait().then(() => {
					initScreenScroll();
			});
					
					// $body.addClass(css.overflow);
					// PreloaderAPI.wait().then(() => {
					// 	if ($body.hasClass(css.overflow)) {
					// 		initScreenScroll();
					// 	}
					// });
			}
		}
		
		function initScreenScroll() {
			_this.$screen.on('mousewheel DOMMouseScroll', (event) => {
				if (!(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0)) {
					TweenMax.to($window, 1, {
						scrollTo: window.innerHeight,
						ease: Power2.easeInOut,
						onComplete() {
							$body.removeClass(css.overflow);
						}
					});

					_this.$screen.off('mousewheel DOMMouseScroll');
				}
			});
		}
	}
	
	initVideo() {
		let $video = this.$video();
		
		if ($video.length && currentPage === 'home') {
			$video.get(0).addEventListener('loadeddata', () => {
				TweenMax.set($video.closest(`${this.screen}__video`), { alpha: 1 });
				
				new ScrollMagic.Scene({
					triggerElement: this.$screen.get(0),
					triggerHook: 0,
					duration: '100%'
				})
					.on('enter', () => {
						this.interval = setInterval(() => {
							if (!document.hidden) {
								this.nextSlide();
							}
						}, this.sliderSpeed * 1000);
					})
					.on('leave', () => {
						clearInterval(this.interval);
					})
					.addTo(this.controller);
			});
		}
	}
	
	createController() {
		this.controller = new ScrollMagic.Controller();
	}
}

export const ScreenAPI = new Screen();
