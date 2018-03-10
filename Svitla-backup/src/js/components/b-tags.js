import { css, $window } from '../modules/dev/helpers'

class Tags {
	constructor () {
		this.$btn = () => $('.tags__btn');
		this.$text = () => $('.tags__btn > span');
		this.$tagsContainer = () => $('.tags__cont');
		this.$tags = this.$tagsContainer().find('.tags__item');
		this.tagHeight = this.$tags.height();
		this.$tagsMaxCount = this.$tagsContainer().data('max-tags');
		this.$tagsOpenTitle = this.$tagsContainer().data('open-title');
		this.$tagsCloseTitle = this.$tagsContainer().data('close-title');
		this.init();
	}
	
	init () {
		if (window.tagsClosed === undefined) window.tagsClosed = true;
		this.setBtnTitle();
		this.initLinkToggle();
		
		let containerHeight = this.$tagsContainer().height();
		if (this.$tagsMaxCount < (containerHeight / this.tagHeight) && this.$btn().length) {
			this.$btn().show();
			if (window.tagsClosed) {
				this.$btn().removeClass(css.active);
				this.$tagsContainer().height(this.$tagsMaxCount * this.tagHeight);
				this.initHideBtn(this.$tagsContainer(), this.$tagsOpenTitle, this.$tagsCloseTitle, containerHeight, this.tagHeight * this.$tagsMaxCount);
			} else {
				this.$btn().addClass(css.active);
				this.initHideBtn(this.$tagsContainer(), this.$tagsOpenTitle, this.$tagsCloseTitle, containerHeight, this.tagHeight * this.$tagsMaxCount);
			}
			
			$window.on('resize', () => {
				document.getElementsByClassName('tags__cont')[0].removeAttribute("style");
				this.$btn().unbind('click tap');
				this.init();
			});
		} else {
			this.$btn().hide();
		}
	}
	
	setBtnTitle(){
		window.tagsClosed ? this.$text().text(this.$tagsOpenTitle).attr('data-hover', this.$tagsOpenTitle) : this.$text().text(this.$tagsCloseTitle).attr('data-hover', this.$tagsCloseTitle);
	}
	
	initHideBtn($container, openText, closeText, max, min) {
		this.$btn().on('click tap', function (e) {
			let $this = $(this),
					$text = $this.find('span'),
					duration = 400;
			
			if ($this.hasClass('is-active')) {
				window.tagsClosed = true;
				$container.animate({
					height: min + 'px'
				}, duration);
				$text.text(openText).attr('data-hover', openText);
			} else {
				window.tagsClosed = false;
				$text.text(closeText).attr('data-hover', closeText);
				$container.animate({
					height: max + 'px'
				}, duration);
			}
			$this.toggleClass(css.active);
		});
	}
	
	initLinkToggle () {
		this.$tags.on('click tap', function () {
			let $this = $(this);
			
			$this.toggleClass('active');
		});
	}
}

export const TagsAPI = new Tags();
