import { css } from '../modules/dev/helpers';

class AnimLines {
	constructor() {
		this.$animLine = () => $('.anim-line');
		
		if (this.$animLine.length) {
			this.init();
		}
	}
	
	init() {
		this.createAnim();
	}
	
	createAnim() {
		const $itemLinesWrap = this.$animLine();
		
		$itemLinesWrap.each((index, el) => {
			let $el = $(el);
			
			$el.children().addClass(css.animLine);
		});
	}
}

export const AnimLinesAPI = new AnimLines();
