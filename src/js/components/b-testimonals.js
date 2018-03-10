import { TimelineMax, TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import '../../../node_modules/dotdotdot/src/js/jquery.dotdotdot';
import '../modules/dep/DrawSVGPlugin';
import SCROLL_TRIGGER_ANIMATIONS from '../modules/dev/animation/helpers/scrollTriggerAnimations';
import { $body, $window, css, debounce, Resp, throttle } from '../modules/dev/helpers';
import Link from './link';
import Video from './video';

class TestimonalsBlock {
	constructor() {
		this.container = 'testimonals';
		this.$container = () => $('.' + this.container);
		this.inner = `${this.container}__inner`;
		this.item = `${this.container}__item`;
		this.text = `${this.container}__text`;
		this.videoBlock = '_video';
		this.$bgItem = () => $(`.${this.container}__bg-item`);
		this.scrollMagicController = [];
		this.video = [];
		
		if (this.$container().length) {
			this.init();
		}
	}
	
	init() {
		$window.on('load', () => {
			if (this.$container().length) {
				this.initVideoButton();
			}
		});
	}
	
	destroyScrollTrigger() {
		this.scrollMagicController.forEach(el => {
			el.destroyScroll();
		});
	}
	
	initVideoButton() {
		let videoIncrement = 0;
		
		if (this.video.length > 0) {
			this.video.forEach(el => {
				el.dispose();
			});
			$body.unbind('closeVideo');
		}

		this.$container().each((index, el) => {
			let $this = $(el);
			
			if (!$this.hasClass(this.container + this.videoBlock)) return true;
			
			let _this = this,
					$picture = $this.find('img'),
					$video = $this.find('video'),
					$videoItem = $this.find('.testimonals__bg-item'),
					windowScrollTop = $window.scrollTop,
					video = [];
			
			$videoItem.eq(0).addClass(css.active).nextAll().hide();
			
			$video.each((index, el) => {
				let $el = $(el);
				
				$el.children().attr('src', $el.children().data('load-src'));
				const bufferVideo = new Video().init($el.get(0), videoIncrement);
				video.push(bufferVideo);
				this.video.push(bufferVideo);
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
					</svg>
				</div>
			`),
				$iconCircleLg = $icon.find('.play-btn__circle-lg'),
				$iconTriangle = $icon.find('.play-btn__triangle'),
				$iconLineTop = $icon.find('.play-btn__line-top'),
				$iconLineLeft = $icon.find('.play-btn__line-left'),
				$iconLineRight = $icon.find('.play-btn__line-right');
			
			let tl = new TimelineMax({ paused: true });
			$icon = $icon.appendTo($this.find('.' + this.inner));
			
			setStartState();
			createStartAnim.call(this);
			createScrollAnim(this);
			
			// Drawing svg icon at play-button:
			function setStartState() {
				TweenMax.set($iconTriangle, { alpha: 0 });
				TweenMax.set($iconCircleLg, {
					drawSVG: '0%', rotation: -90, transformOrigin: 'center center'
				});
				TweenMax.set([$iconLineTop, $iconLineLeft, $iconLineRight], { drawSVG: '0%' });
			}
			
			// Add mouse move listener at play btn svg icon:
			function createScrollAnim(that) {
				const scene = new SCROLL_TRIGGER_ANIMATIONS({
					container: el,
					onStart() {
						setTimeout(() => {
							tl.play();
						}, 750);
					}
				});
				that.scrollMagicController.push(scene);
			}
			
			// resize section height on orientationChange
			function resizeSectionOnOrientationChange() {
				if (!$this.find('.testimonals__bg-w').hasClass(css.play)) return;

				const $videoHeight = $this.find('video').height();
				
				TweenMax.to($this, 0.2, {
					height: $videoHeight,
					ease: Power1.easeInOut
				});
			}
			
			$window.on('orientationchange', debounce(resizeSectionOnOrientationChange, this, 250));
			
			// Add close btn:
			function createCloseBtn($videoContainer) {
				let $container = $videoContainer.find('.testimonals__bg-video'),
					$btn = $('<div></div>', { class: 'testimonals__video-close' }).append($('<span>Close</span>')),
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
					.to($iconTriangle, speed / 4, { alpha: 1 }, `start+=${speed / 2}`);
				
				if (Resp.isDesk) {
					tl.vars.onComplete = () => {
						bindPlayEvent.call(this);
					};
				} else {
					tl.vars.onComplete = () => {
						bindPlayEvent.call(this);
					};
				}
			}
			
			function bindPlayEvent() {
				let fadeSpeed = 0.4;
				let $videoHeight = $(video[_this.$bgItem().filter('.' + css.active).index()].el_).height();
				
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
					video[_this.$bgItem().filter('.' + css.active).index()].pause();
					$this.addClass(css.noEvents);
					TweenMax.to($closeBtn[_this.$bgItem().filter('.' + css.active).index()], fadeSpeed, {
						y: 20,
						alpha: 0,
						ease: Power1.easeInOut
					});
					TweenMax.to($this, fadeSpeed, {
						height: $thisHeight,
						ease: Power1.easeInOut
					});
					TweenMax.to(video[_this.$bgItem().filter('.' + css.active).index()].el_, fadeSpeed, {
						alpha: 0,
						onComplete() {
							$this.find('.testimonals__bg-w').removeClass(css.play);
							TweenMax.to($picture.eq(_this.$bgItem().filter('.' + css.active).index()).parent(), 1.5 * fadeSpeed, {
								y: '0%',
								alpha: 1,
								ease: Power1.easeOut,
								onComplete() {
									TweenMax.to([
										$this.find('.testimonals__item')], fadeSpeed, {
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
					let activeItem = _this.$bgItem().filter('.' + css.active);
					let activeIndex = activeItem.index();

          $body.trigger('closeVideo');
					video[activeIndex].load();
					
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
							$this.find(`.${this.container}__item`)], fadeSpeed, {
							y: 200,
							alpha: 0,
							ease: Power1.easeIn
						})
						.to($picture.eq(activeIndex).parent(), 1.5 * fadeSpeed, {
							y: '100%',
							alpha: 0,
							ease: Power1.easeIn,
							onComplete() {
								$this.find('.testimonals__bg-w').addClass(css.play);
								$videoHeight = Resp.isDesk ? false : $this.width() * 0.5625;
								if ($videoHeight && ($this.closest('.testimonals__small').length === 0)) {
									TweenMax.to($this, fadeSpeed, {
										height: $videoHeight,
										ease: Power1.easeInOut
									});
								}
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

export const TestimonalsAPI = new TestimonalsBlock();
