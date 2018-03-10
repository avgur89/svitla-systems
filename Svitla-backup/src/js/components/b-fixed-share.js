import Link from './link';
import ScrollMagic from 'ScrollMagic';
import { Resp } from '../modules/dev/helpers';

class Share {
	constructor() {
		this.$share = $('.share');
		this.$link = this.$share.find('a');
		
		this.init();
	}
	
	init() {
		if (this.$share.length) {
			this.initCircleBtn();
			this.initFixedState();
		}
	}
	
	initCircleBtn() {
		new Link(this.$link, {
			type: 'single'
		});
	}
	
	initFixedState() {
		
		if (this.$link.length) {
			let controller = new ScrollMagic.Controller(),
					sectionBlueHeight = $('.blog-4_blue').height() + 215;
			
			if (Resp.isDesk) {
				let share = document.getElementsByClassName('section_sharing')[0];
				
				// Set fixed position:
				new ScrollMagic.Scene({
					triggerElement: share,
					triggerHook: 'onEnter',
					offset: 180
				}).setClassToggle("body", "share-fixed")
					.addTo(controller);
				// Set bottom position:
				new ScrollMagic.Scene({
					triggerElement: ".redactor__signature",
					triggerHook: 'onEnter',
					offset: 100
				}).setClassToggle("body", "share-bottom")
					.addTo(controller);
				
				// Change hover when block in blue section:
				if ($('.blog-4_blue').length) {
					new ScrollMagic.Scene({
						triggerElement: ".blog-4_blue",
						triggerHook: 'onEnter',
						offset: 100,
						duration: sectionBlueHeight
					}).setClassToggle("body", "share-white-hover")
						.addTo(controller);
				}
			} else return false;
		}
	}
}

export default new Share();
