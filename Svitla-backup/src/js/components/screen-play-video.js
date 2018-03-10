import { TimelineMax, TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import '../modules/dep/DrawSVGPlugin';
import {ScreenAPI} from './b-screen';
import { $body, $window, $header, css, Resp, throttle } from '../modules/dev/helpers';
import Link from './link';
import Video from './video';

class ScreenVideoPlay {
	constructor() {
		this.$container = $('.screen_ceo');
		this.$canvas = this.$container.find('canvas');
		
		if (this.$container.length !== 0) {
			this.init();
		}
	}
	
	init() {
		$window.on('load', () => {
			if (this.$container.length) {
				this.initVideoButton();
			}
		});
	}
	
	initVideoButton() {
		let $this = this.$container;
		
		let $video = $this.find('video'),
				$breadcrumbs = $('.breadcrumbs'),
				video;
		
		$video.children().attr('src', $video.children().data('load-src'));
		video = new Video().init($video.get(0), 0)
		
		// Create close btn:
		let $closeBtn = $(createCloseBtn($this));
		
		// Create play-button and append this at half-container with video:
		let $icon = $(`
			<div class="screen__play-btn">
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
		
		$icon = $icon.appendTo($this);
		
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
		
		// Play animations btn svg icon:
		function createScrollAnim() {
			setTimeout(() => {
				tl.play();
			}, 2000);
		}
		
		// Add close btn:
		function createCloseBtn($videoContainer) {
			let $btn = $('<div></div>', { class: 'screen__video-close' }).append($('<span>Close</span>'));
			
			$btn.prependTo($videoContainer);
			new Link($btn, { type: 'close' });
			
			return $btn;
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
			const screenHeight = this.$container.height();
			const videoHeight = $('.vjs-tech').height();
			
			Resp.isDesk ? $('.vjs-tech').height(window.innerHeight) : null;
			
			$video.each((index, el) => {
				el.addEventListener('ended', () => {
					$body.trigger('closeVideo');
				});
			});
			
			$closeBtn.on('click', () => {
				$body.trigger('closeVideo');
			});
			
			$body.bind('playVideoAndResize', () => {
			
			});
			
			$body.bind('closeVideo', () => {
				
				video.pause();
				this.$container.removeClass('show-video');
				
				setTimeout(function () {
					if (!(Resp.isMobile && window.innerWidth < window.innerHeight)) {
						$('.screen_ceo').animate({
							height: document.documentElement.clientHeight,
							"min-height": document.documentElement.clientHeight
						}, 1000);
					} else {
						$('.screen_ceo').animate({
							height: 480,
							"min-height": 480
						}, 1000);
					}

					ScreenAPI.sector.startAnim();
					$breadcrumbs.removeClass(css.active);
					$header.removeClass('is-hide is-disabled');
					video.load();
				}, 1000);
			});
			
			$icon.on('click tap', () => {
				video.load();
				
				if (!Resp.isDesk) {
					setTimeout(function () {
						$('.screen_ceo').animate({
							height:  $('.vjs-tech').height(),
							"min-height": 0
						}, 1000);
					}, 1000);
					
				}
				// Close canvas:
				ScreenAPI.sector.screenAnim();
				// Init css anim:
				$breadcrumbs.addClass(css.active);
				$header.addClass(css.hide);
				this.$container.addClass('show-video');
				disabledHeader();
				setTimeout(function () {
					video.play();
				}, 1200);
			});
			
			function disabledHeader() {
				const windowHeight = $window.innerHeight();
				
				$window.on('scroll', () => {
					if ($('.show-video').length !== 0) {
						($window.scrollTop() > videoHeight) ? $header.removeClass(css.disabled) : $header.addClass(css.disabled);
					}
				});
				
				$window.on('resize', ()=> {
					if ($('.screen_ceo').hasClass('show-video')) {
						setTimeout(function () {
							$('.screen_ceo').css("height", $('.vjs-tech').height());
							$('.screen_ceo').css("min-height", $('.vjs-tech').height());
						}, 5);
					}
				});
			}
		}
	}
}

export default new ScreenVideoPlay();
