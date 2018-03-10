import { TimelineMax, TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import '../../../node_modules/dotdotdot/src/js/jquery.dotdotdot';
import Dot from '../components/dot';
import '../modules/dep/DrawSVGPlugin';
import SCROLL_TRIGGER_ANIMATIONS from '../modules/dev/animation/helpers/scrollTriggerAnimations';
import { $body, $window, css, debounce, Resp, throttle } from '../modules/dev/helpers';
import Link from './link';
import Video from './video';

class HalfBlock {
	constructor() {
		this.container = 'half';
		this.$container = $('.' + this.container);
		this.inner = `${this.container}__inner`;
		this.item = `${this.container}__item`;
		this.text = `${this.container}__text`;
		this.videoBlock = '_video';
		this.$bgItem = $(`.${this.container}__bg-item`);
		
		if (this.$container.length) {
			this.init();
		}
	}
	
	init() {
		this.initSlider();
		this.initSwipe();
		this.dot();
		$window.on('load', () => {
			this.initVideoButton();
		});
	}
	
	dot() {
		new Dot(`.${this.text}`);
	}
	
	initSwipe() {
		const $container = $('.' + this.inner);
		
		$container.each((index, el) => {
			const $item = $(el).find(`.${this.item}`);
			const $dot = $(el).find('.dots__item');
			
			if ($item.length < 2) return;
			
			$container.get(0).addEventListener('touchstart', handleTouchStart, false);
			$container.get(0).addEventListener('touchmove', handleTouchMove, false);
			
			let xDown = null;
			let yDown = null;
			
			function handleTouchStart(evt) {
				xDown = evt.touches[0].clientX;
				yDown = evt.touches[0].clientY;
			}
			
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
						let $currentDot = $dot.filter('.' + css.active);
						if ($currentDot.index() < $dot.length - 1) {
							$dot.eq($currentDot.index() + 1).trigger('click');
						} else {
							$dot.eq(0).trigger('click');
						}
					} else {
						/* right swipe */
						let $currentDot = $dot.filter('.' + css.active);
						if ($currentDot.index() > 0) {
							$dot.eq($currentDot.index() - 1).trigger('click');
						} else {
							$dot.eq($dot.length - 1).trigger('click');
						}
					}
				}
				/* reset values */
				xDown = null;
				yDown = null;
			}
		});
	}
	
	initSlider() {
		this.$container.each((index, el) => {
			let $el = $(el);
			let $slider = $el.find(`.${this.inner}`);
			let $item = $slider.find(`.${this.item}`);
			
			if ($item.length < 2) return;
			
			let $dots = $('<div></div>', { class: `${this.container}__dots dots` }).attr('data-anim-stagger', 'fade-top');
			let $dotsItem = $('<div></div>', { class: `dots__item` });
			let $dotsItemIn = $('<div></div>', { class: `dots__item-in` });
			let tl = new TimelineMax();
			const icon = `
				<div class="icon">
					<svg viewBox="0 0 8 8">
						<path d="M8,1.6L6.1,0C5.6,0.5,4.8,0.7,4,0.7C3.2,0.7,2.4,0.5,1.9,0L0,1.6C1,2.5,2.4,3,4,3C5.6,3,7,2.5,8,1.6z"/>
					</svg>
				</div>`;
			
			$item.each((index, el) => {
				if (index === 0) return;
				$(el).find('[data-anim-stagger]').removeAttr('data-anim-stagger');
			});
			
			$dots.appendTo($slider);
			for (let i = 0, len = $item.length; i < len; i++) {
				$dotsItem.clone()
					.wrapInner($dotsItemIn.clone().wrapInner($(icon)))
					.appendTo($dots);
			}
			$dotsItem = $dots.children();
			$dotsItem.eq(0).addClass(css.active);
			$item.eq(0).addClass(css.active);
			
			$dotsItem.on('click', (e) => {
				e.preventDefault();
				let $this = $(e.currentTarget);
				let index = $this.index();
				
				if (!$this.hasClass(css.active)) {
					$dotsItem.removeClass(css.active);
					$this.addClass(css.active);
					this.goToSlide(index);
				}
			});
			
			this.goToSlide = (index) => {
				$item.removeClass(css.active);
				if (Resp.isDesk) {
					setTimeout(() => {
						this.$bgItem.filter('.' + css.active).removeClass(css.active).fadeOut(750);
						this.$bgItem.eq(index).addClass(css.active).fadeIn(750);
					}, 500);
				} else {
					this.$bgItem.filter('.' + css.active).removeClass(css.active).fadeOut(500, () => {
						this.$bgItem.eq(index).addClass(css.active).fadeIn(1000);
					});
				}
				this.animReverse($item.filter(':visible').children()).then(() => {
					this.anim($item.eq(index).children());
				});
			};
			
			this.anim = (el) => {
				tl.vars.onComplete = () => this;
				TweenMax.set(el, {
					y: 80,
					alpha: 0
				});
				el.parent().addClass(css.active).show();
				el.filter(`.${this.text}`).length ? el.filter(`.${this.text}`).trigger('update.dot') : null;
				tl.staggerTo(el, 0.8, {
					y: 0,
					x: 0,
					ease: Power4.easeOut,
					onStart() {
						TweenMax.to($(this.target), 0.5, {
							alpha: 1,
							ease: Power2.easeIn
						});
					}
				}, 0.200);
			};
			
			this.animReverse = (el) => new Promise(resolve => {
				tl.staggerTo(el, 0.2, {
					y: -20,
					alpha: 0,
					ease: Power1.easeIn
				}, 0.200 / 2);
				
				tl.vars.onComplete = () => {
					el.parent().hide();
					resolve();
				};
			});
		});
	}
	
	initVideoButton() {
		let videoIncrement = 0;
		
		this.$container.each((index, el) => {
			let $this = $(el);
			
			if (!$this.hasClass(this.container + this.videoBlock)) return false;
			
			let _this = this,
				$picture = $this.find('img'),
				$video = $this.find('video'),
				$videoItem = $this.find('.half__bg-item'),
				windowScrollTop = $window.scrollTop,
				video = [];
			
			if (!$video.length) return false;
			
			$videoItem.eq(0).addClass(css.active).nextAll().hide();
			
			$video.each((index, el) => {
				let $el = $(el);
				
				$el.children().attr('src', $el.children().data('load-src'));
				video.push(new Video().init($el.get(0), videoIncrement));
				videoIncrement++;
			});
			
			let $thisHeight = $this.height();
			
			// Create close btn:
			let $closeBtn = $(createCloseBtn($this));
			
			// Create play-button and append this at half-container with video:
			let $icon = $(`
				<div class="${this.container}__play-btn">
					<svg class="play-btn" viewBox="0 0 294 294">
						<path class="play-btn__triangle" d="M132.5,165V129l29,18Z"/>
						<line class="play-btn__line-top" x1="275.5" y1="216.5" x2="27.5" y2="63.5"/>
						<line class="play-btn__line-left" x1="27.5" y1="231.5" x2="275.5" y2="76.5"/>
						<line class="play-btn__line-right" x1="132.5" y1="1.5" x2="132.5" y2="292.5"/>
						<circle class="play-btn__circle-lg" cx="147" cy="147" r="146"/>
						<circle class="play-btn__circle-sm" cx="147" cy="147" r="113.5"/>
					</svg>
				</div>
			`),
				$iconCircleLg = $icon.find('.play-btn__circle-lg'),
				$iconCircleSm = $icon.find('.play-btn__circle-sm'),
				$iconTriangle = $icon.find('.play-btn__triangle'),
				$iconLineTop = $icon.find('.play-btn__line-top'),
				$iconLineLeft = $icon.find('.play-btn__line-left'),
				$iconLineRight = $icon.find('.play-btn__line-right');
			
			let tl = new TimelineMax({ paused: true });
			
			$icon = $icon.appendTo($this.find('.' + this.inner));
			
			setStartState();
			createStartAnim.call(this);
			createScrollAnim.call(this);
			
			// Drawing svg icon at play-button:
			function setStartState() {
				TweenMax.set($iconTriangle, { alpha: 0 });
				TweenMax.set($iconCircleLg, {
					drawSVG: '0%', rotation: -90, transformOrigin: 'center center'
				});
				TweenMax.set($iconCircleSm, {
					drawSVG: '0%', rotation: 135, transformOrigin: 'center center'
				});
				TweenMax.set([$iconLineTop, $iconLineLeft, $iconLineRight], { drawSVG: '0%' });
			}
			
			// Add mouse move listener at play btn svg icon:
			function createScrollAnim() {
				new SCROLL_TRIGGER_ANIMATIONS({
					container: el,
					onStart() {
						setTimeout(() => {
							tl.play();
						}, 750);
					}
				});
			}
			
			// resize section height on orientationChange
			function resizeSectionOnOrientationChange() {
				if (!$this.hasClass(css.play)) return;
				
				const $videoHeight = $window.width() * 0.5625;
				
				TweenMax.to($this, 0.2, {
					height: $videoHeight,
					ease: Power1.easeInOut
				});
			}
			
			$window.on('orientationchange', debounce(resizeSectionOnOrientationChange, this, 250));
			
			// Add close btn:
			function createCloseBtn($videoContainer) {
				let $container = $videoContainer.find('.half__bg-video'),
					$btn = $('<div></div>', { class: 'half__video-close' }).append($('<span>Close</span>')),
					$newBtn = [];
				
				$container.each((index, el) => {
					$newBtn.push($btn.clone());
					$newBtn[index].prependTo($videoContainer);
					new Link($newBtn[index], { type: 'close' });
				});
				
				return $newBtn;
			}
			
			function createStartAnim() {
				let speed = 1;
				tl
					.add('start')
					.to($iconCircleLg, speed * 2 / 3, { drawSVG: '100%', ease: Power1.easeInOut }, 'start')
					.to([$iconLineTop, $iconLineLeft, $iconLineRight], speed / 2, {
						drawSVG: '25% 75%', ease: Power4.easeIn
					}, 'start')
					.to([$iconLineTop, $iconLineLeft, $iconLineRight], speed / 3, {
						drawSVG: '100% 100%', ease: Power2.easeOut
					}, `start+=${speed / 2}`)
					.to($iconTriangle, speed / 4, { alpha: 1 }, `start+=${speed / 2}`)
					.to($iconCircleSm, speed * 2 / 10, {
						drawSVG: '17.5% 52.5%', ease: Power1.easeIn
					}, `start+=${speed / 2}`)
					.to($iconCircleSm, speed / 10, {
						drawSVG: '42.5% 70%', ease: Linear.easeNone
					}, `start+=${speed / 2 + speed * 2 / 10}`)
					.to($iconCircleSm, speed / 10, {
						drawSVG: '50% 75%', ease: Power1.easeOut
					}, `start+=${speed / 2 + speed * 2 / 10 + speed / 10}`);
				
				if (Resp.isDesk) {
					tl.vars.onComplete = () => {
						bindPlayEvent.call(this);
						setMouseEvent.call(this);
					};
				} else {
					tl.vars.onComplete = () => {
						bindPlayEvent.call(this);
					};
				}
				
				function setMouseEvent() {
					let rotation = 0;
					let prevRotation = 0;
					let counter = 0;
					let speedMouse = 2;
					let circleX = $icon.offset().left + $icon.width() / 2;
					let circleY = $icon.offset().top + $icon.height() / 2;
					
					$window.on('resize', throttle(() => {
						circleX = $icon.offset().left + $icon.width() / 2;
						circleY = $icon.offset().top + $icon.height() / 2;
					}, 250, this));
					
					$this.on('mousemove', (e) => {
						rotation = Math.atan2(e.pageY - circleY, e.pageX - circleX) * 180 / Math.PI;
						if (rotation + counter * 360 - prevRotation >= 180) {
							counter--;
						} else if (prevRotation - counter * 360 - rotation >= 180) {
							counter++;
						}
						rotation += counter * 360;
						TweenMax.to($iconCircleSm, speedMouse, {
							rotation: rotation + 135,
							transformOrigin: 'center center',
							ease: Power3.easeOut
						});
						prevRotation = rotation;
					});
				}
			}
			
			function bindPlayEvent() {
				let fadeSpeed = 0.4;
				let $videoHeight = $(video[_this.$bgItem.filter('.' + css.active).index()].el_).height();
				
				if (!Resp.isDesk) {
					fadeSpeed /= 2;
				}
				
				$video.each((index, el) => {
					el.addEventListener('ended', () => {
						$body.trigger('closeVideo');
					});
				});
				
				$closeBtn.each((index, el) => {
					$(el).on('click', () => {
						$body.trigger('closeVideo');
					});
				});
				
				$body.bind('closeVideo', () => {
					video[_this.$bgItem.filter('.' + css.active).index()].pause();
					$this.addClass(css.noEvents).removeClass(css.play);
					TweenMax.to($closeBtn[_this.$bgItem.filter('.' + css.active).index()], fadeSpeed, {
						y: 20,
						alpha: 0,
						ease: Power1.easeInOut
					});
					TweenMax.to($this, fadeSpeed, {
						height: $thisHeight,
						ease: Power1.easeInOut
					});
					TweenMax.to(video[_this.$bgItem.filter('.' + css.active).index()].el_, fadeSpeed, {
						alpha: 0,
						onComplete() {
							$this.find('.half__bg-w').removeClass(css.play);
							TweenMax.to($picture.eq(_this.$bgItem.filter('.' + css.active).index()).parent(), 1.5 * fadeSpeed, {
								y: '0%',
								alpha: 1,
								ease: Power1.easeOut,
								onComplete() {
									TweenMax.to([
										$this.find('.half__item'),
										$this.find('.half__dots')], fadeSpeed, {
										y: 0,
										alpha: 1,
										ease: Power1.easeOut,
										onComplete() {
											TweenMax.to($icon, fadeSpeed, {
												alpha: 1,
												scale: 1,
												onComplete() {
													$this.removeClass(css.noEvents);
												}
											});
										}
									});
								}
							});
						}
					});
				});
				
				$icon.on('click tap', () => {
					let activeItem = _this.$bgItem.filter('.' + css.active);
					let activeIndex = activeItem.index();
					
					video[activeIndex].load();
					
					$this.addClass(css.play);
					
					if (!Resp.isDesk) {
						video[activeIndex].play();
					}
					
					let thisTl = new TimelineMax();
					windowScrollTop = $window.scrollTop();
					$this.addClass(css.noEvents);
					thisTl
						.to($icon, fadeSpeed, {
							alpha: 0,
							scale: 0.8
						})
						.to([
							$this.find(`.${this.container}__item`),
							$this.find(`.${this.container}__dots`)], fadeSpeed, {
							y: 200,
							alpha: 0,
							ease: Power1.easeIn
						})
						.to($picture.eq(activeIndex).parent(), 1.5 * fadeSpeed, {
							y: '100%',
							alpha: 0,
							ease: Power1.easeIn,
							onComplete() {
								$this.find('.half__bg-w').addClass(css.play);
								$videoHeight = Resp.isDesk ? $window.height() : $window.width() * 0.5625;
								if (Resp.isDesk) {
									TweenMax.to($window, fadeSpeed, {
										scrollTo: $this.get(0),
										ease: Power1.easeInOut
									});
								}
								TweenMax.to($this, fadeSpeed, {
									height: $videoHeight,
									ease: Power1.easeInOut
								});
								TweenMax.to(video[activeIndex].el_, fadeSpeed, {
									alpha: 1,
									onComplete() {
										TweenMax.to($closeBtn[activeIndex], fadeSpeed, {
											y: 0,
											alpha: 1,
											ease: Power1.easeInOut
										});
										$this.removeClass(css.noEvents);
										video[activeIndex].play();
										$('.header').addClass(css.hide);
									}
								});
							}
						});
				});
			}
		});
	}
}

export default new HalfBlock();
