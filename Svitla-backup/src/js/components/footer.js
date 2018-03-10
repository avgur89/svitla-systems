import Link from './link';

class FooterBlock {
	constructor() {
		this.$footer = $('.footer');
		this.$circleBtn = this.$footer.find('.footer__top-nav a');
		this.$circleSingleBtn = this.$footer.find('.footer__top-controls a');
		
		this.init();
	}
	
	init() {
		this.initCircleBtn();
	}
	
	initCircleBtn() {
		new Link(this.$circleBtn);
		new Link(this.$circleSingleBtn, {
			type: 'single'
		});
	}
}

export default new FooterBlock();
