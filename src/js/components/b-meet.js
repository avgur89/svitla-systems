import { TweenMax } from 'gsap';
import ScrollMagic from 'ScrollMagic';
import SplitText from '../modules/dep/SplitText';
import Title from '../modules/dev/animation/title';
import { css } from '../modules/dev/helpers';

class MeetBlock {
	constructor() {
		this.$meet = $('.meet');
		this.$form = this.$meet.find('.meet__form');
		this.$ty = this.$meet.find('.meet__form-ty');
		this.meetHeight = this.$meet.outerHeight();
		this.successTimeout = 6000;
		
		if (this.$meet.length) {
			this.init();
		}
	}
	
	init() {
		this.createController();
		this.checkTitle();
		$('input').on('mousedown', function (e) {
			e.preventDefault();
			this.select();
		});
	}
	
	createController() {
		this.controller = new ScrollMagic.Controller();
	}
	
	initSuccess() {
		this.$meet.css('height', this.$meet.outerHeight() + 'px');
		this.$form.fadeOut(() => {
			this.$ty.fadeIn();
			TweenMax.to(this.$meet, 1, { height: this.meetHeight, ease: Power2.easeInOut });
		});
		setTimeout(() => {
			this.$ty.fadeOut(() => {
				this.$form.find('textarea').css('height', '');
				this.$form.find('.' + css.fill).removeClass(css.fill);
				this.$form.find('textarea, input:not([type=hidden])').val('');
				this.$form.fadeIn();
				this.$meet.css('height', '');
			});
		}, this.successTimeout);
	}
	
	checkTitle() {
		let $title = $('.meet__title');
		let splitText = new SplitText($title, { linesClass: 'meet__title-line' });
		
		if ($title.find('.' + splitText.vars.linesClass).length > 1) {
			splitText.revert();
		} else {
			splitText.revert();
			new Title('.meet');
		}
	}
}

export const MeetBlockAPI = new MeetBlock();
