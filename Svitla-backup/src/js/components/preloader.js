import { $body, $window, css } from '../modules/dev/helpers';

class Preloader {
	constructor() {
		this.$preloader = $('.preloader');
		this.$circle = this.$preloader.find('.preloader__circle');
		this.resolved = false;
		
		this.init();
	}
	
	init() {
		return new Promise(resolve => {
			$body.removeClass(css.loading);
			$window.on('load', () => {
				let preloaderDuration = this.$circle.transtionend();
				
				this.$circle.addClass(css.active);
				
				if ($window.scrollTop() > 0) {
					$body.removeClass(css.overflow);
				}
				
				setTimeout(() => {
					this.$preloader.addClass(css.active);
				}, preloaderDuration * 2 / 3);
				
				setTimeout(() => {
					this.resolved = true;
					resolve();
				}, preloaderDuration);
			});
			
			$.fn.transtionend = function () {
				// check the main transition duration property
				if (this.css('transition-duration')) {
					return Math.round(parseFloat(this.css('transition-duration')) * 1000);
				} else {
					if (this.css('-webkit-transtion-duration')) return Math.round(parseFloat(this.css('-webkit-transtion-duration')) * 1000);
					if (this.css('-moz-transtion-duration')) return Math.round(parseFloat(this.css('-moz-transtion-duration')) * 1000);
					if (this.css('-ms-transtion-duration')) return Math.round(parseFloat(this.css('-ms-transtion-duration')) * 1000);
					if (this.css('-o-transtion-duration')) return Math.round(parseFloat(this.css('-ms-transtion-duration')) * 1000);
				}
				// if we're here, then no transition duration was found, return 0
				return 0;
			};
		});
	}
	
	wait() {
		return new Promise(resolve => {
			let waitInerval = setInterval(() => {
				if (this.resolved === true) {
					clearInterval(waitInerval);
					resolve();
				}
			}, 25);
		});
	}
}

export const PreloaderAPI = new Preloader();
