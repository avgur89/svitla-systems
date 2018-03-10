import '../../../node_modules/dotdotdot/src/js/jquery.dotdotdot';
import { $window, throttle } from '../modules/dev/helpers';

export default class Dot {
	
	constructor(el) {
		this.$el = $(el);
		this.$disableDot = $('.disable-dot');
		
		this.init();
	}
	
	init() {
		$window.on('load', () => {
			this.initDot();
			this.onResize();
		});
	}
	
	onResize() {
		const reinitDot = throttle(() => {
			this.destroy();
			this.initDot();
		}, 250, this);
		
		$window.on('resize orientationchange', reinitDot);
	}
	
	initDot() {
		if (this.$disableDot.length !== 0) {
      this.$el.dotdotdot({
				height: 200
			});
		} else {
      this.$el.dotdotdot();
		}
	}
	
	destroy() {
		this.$el.trigger('destroy');
	}
}
