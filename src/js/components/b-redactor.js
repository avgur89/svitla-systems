import { $scrolledElements } from '../modules/dev/helpers';
import hljs from '../modules/dep/highlight.js';
import '../modules/dep/highlightjs-line-numbers';

class Redactor {
	constructor() {
		this.$redactor = $('.redactor');
		this.$redactorAnchor = $('.redactor__anchor');
		this.$highlights = $('pre code');
		this.$list = $('.redactor ol');
		
		this.init();
	}
	
	init() {
		if (this.$redactor.length) {
			this.initHighlights();
			this.initAnchorAnim();
			this.removeMarginOfLastChild();
			this.initStepCounter();
		}
	}
	
	initHighlights() {
		const highlightCount = this.$highlights.length;
		
		for (let i = 0; i < highlightCount; i++) {
			hljs.highlightBlock(this.$highlights[i]);
			hljs.lineNumbersBlock(this.$highlights[i]);
		}
	}
	
	initAnchorAnim() {
		this.$redactorAnchor.on('click tap', function () {
			$scrolledElements.animate({
				scrollTop: $($(this).attr('href')).offset().top
			}, 600);
			return false;
		});
	}
	
	removeMarginOfLastChild() {
		// Set last redactor element margin bottom 0 (independently of tag)
		this.$redactor.children().eq(this.$redactor.children().length - 1).css("margin-bottom", "0")
	}
	
	initStepCounter() {
		this.$list.each((index, item) => {
			let $this = $(item),
					start = $this.attr('start');
			
			if (start) {
				start = 'list ' + (start - 1);
				$this.css('counter-reset', start);
			}
		});
	}
}

export default new Redactor();
