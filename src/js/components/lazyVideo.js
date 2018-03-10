import { $window, Resp } from '../modules/dev/helpers';

class LazyVideo {
	constructor() {
		this.$el = $('video[data-lazy-src]');
		
		this.init();
	}
	
	init() {
		$window.on('load', () => {
			setTimeout(() => {
				this.$el.each((index, el) => {
					if (!Resp.isMobile) {
            $(el).attr('src', $(el).data('lazy-src'));
					}
				});
			}, 3000);
		});
	}
}

export default new LazyVideo();
