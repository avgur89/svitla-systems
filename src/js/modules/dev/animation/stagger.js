import { TimelineMax, TweenMax } from 'gsap';
import { PreloaderAPI } from '../../../components/preloader';
import { css, Resp } from '../helpers';
import SCROLL_TRIGGER_ANIMATIONS from './helpers/scrollTriggerAnimations';

class Stagger {
	constructor() {
		this.scene = [];
	}
	
	init() {
		PreloaderAPI.wait().then(() => {
			if (Resp.isDesk) {
				this.$container = $('[data-anim="group"]');
				this.$container.removeClass(css.anim).find(css.anim).removeClass(css.anim);
				this.createAnim();
			} else {
				this.$container = $('[data-mob-anim="group"]');
				this.$container.removeClass(css.anim).find(css.anim).removeClass(css.anim);
				this.createAnim('mob-');
			}
		});
	}
	
	/**
	 * @param {String} dataAnim - data trigger element
	 */
	createAnim(dataAnim = '') {
		this.$container.each((index, container) => {
			let $el;
			let delay = $(container).data(`${dataAnim}anim-delay`) ? $(container).data(`${dataAnim}anim-delay`) : .2;
			let duration = $(container).data(`${dataAnim}anim-duration`) ? $(container).data(`${dataAnim}anim-duration`) : .6;
			let triggerHook = $(container).data(`${dataAnim}anim-trigger-hook`);
			
			// check self animation
			if ($(container).data(`${dataAnim}anim-stagger`)) {
				$el = $(container).find(`[data-${dataAnim}anim-stagger]`).andSelf();
				createAnim(container, $el, this);
			} else if ($(container).data(`${dataAnim}anim-each`)) {
				$el = $(container).addClass(`${dataAnim}has-anim`).children();
				$el.each(function () {
					$(this).attr(`data-${dataAnim}anim-stagger`, $(container).data(`${dataAnim}anim-each`));
					createAnim(this, $(this), this);
				});
			} else {
				$el = $(container).find(`[data-${dataAnim}anim-stagger]`);
				createAnim(container, $el, this);
			}
			
			function createAnim(container = container, el = $el, that) {
				let tl = new TimelineMax({ paused: true });
				tl.staggerTo(el, duration, {
					y: 0,
					x: 0,
					ease: Power4.easeOut,
					onStart() {
						$(this.target).addClass(css.offTransition);
						if ($(this.target).data(`${dataAnim}anim-parent-trigger`)) {
							$(this.target).parent().addClass(css.anim);
						}
						
						if (this.target.hasAttribute(`data-${dataAnim}prepare-anim`)) {
							$(this.target).removeAttr(`data-${dataAnim}prepare-anim`);
						}
						
						TweenMax.to($(this.target), .5, {
							alpha: 1,
							ease: Power2.easeIn
						});
					},
					onComplete() {
						$(this.target)
							.removeClass(css.offTransition)
							.removeAttr(`data-${dataAnim}anim-stagger`);
					}
				}, delay);
				
				const scene = new SCROLL_TRIGGER_ANIMATIONS({
					container: container,
					triggerHook: triggerHook,
					onStart: () => {
						setTimeout(() => {
							tl.play();
						}, 0);
					}
				});
				
				that.scene.push(scene);
			}
		});
	}
	
	destroy() {
		this.scene.forEach(el => {
			el.destroyScroll();
		});
	}
}

export let AnimStagger = new Stagger();

window.reInitStagger = reInitStagger;
window.removeStagger = removeStagger;

function reInitStagger() {
	AnimStagger = new Stagger();
	AnimStagger.init();
}

function removeStagger() {
	AnimStagger.destroy();
}
