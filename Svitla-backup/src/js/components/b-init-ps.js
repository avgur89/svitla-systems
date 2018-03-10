import PS from 'perfect-scrollbar';

class InitPS {
	constructor() {
		this.$perfectScrollbar = $('.ps-init');
		this.init();
	}
	
	init() {
		if (this.$perfectScrollbar.length) {
			this.initPerfectScrollbar();
		}
	}
	
	initPerfectScrollbar() {
		const scrollContainer = this.$perfectScrollbar;
		
		if (scrollContainer.length !== 0) {
			this.$perfectScrollbar.each(function () {
				const $containerScroll = $(this),
							height = $containerScroll.outerHeight(),
							maxHeight = Number($containerScroll.css('max-height').slice(0, -2));
				
				if (height >= maxHeight) {
					PS.initialize($containerScroll.get(0));
				}
			});
		}
		return this;
	}
}

export default new InitPS();
