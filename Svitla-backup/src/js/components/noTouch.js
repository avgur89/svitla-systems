import { $body, $window, css } from '../modules/dev/helpers';

class NoTouch {
	constructor() {
		this.$metaViewport = $('meta[name="viewport"]');
		
		this.init();
	}
	
	init() {
		const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		
		if (isTouchDevice) {
			$body.removeClass(css.noTouch);
			if ($window.width() > 1024) this.$metaViewport.attr('content', 'width=1024');
		} else {
			$body.addClass(css.noTouch);
		}
	}
	
}

export default new NoTouch();
