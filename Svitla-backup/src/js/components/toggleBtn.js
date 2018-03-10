import { css, $body, Resp } from '../modules/dev/helpers';

class ToggleBtn {
	constructor() {
		this.$solutionsItem = $('.solutions__item');
		this.$solutionsContainer = $('.solutions__row-2:not(.is-disabled)');

		this.init();
	}
	
	init() {
		this.createHTML();
	}
	
	createHTML() {
		if (this.$solutionsItem.length && this.$solutionsContainer.length) {
			const $itemContainer = this.$solutionsContainer,
						$solutionsItem = this.$solutionsItem;
			
			let limitItem, initShowBtnIndex;
			
			// Set parametrs:
			if (Resp.isMobile) {
				limitItem = 6;
				initShowBtnIndex = 5;
			} else {
				limitItem = 12;
				initShowBtnIndex = 11;
			}
			
			// Create HTML:
			this.$solutionsItem.each((index, el) => {
				if (index >= limitItem) {
					if (index === limitItem) {
						const $toggleItem = $solutionsItem.eq(initShowBtnIndex);
						// Show btn:
						$itemContainer.addClass(css.hide).append('<button class="solutions__item solutions__item_hidden anim-line__item has-anim is-active" data-mob-anim="group"><svg class="solutions__toggle-icon" data-anim-parent-trigger="data-anim-parent-trigger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.5 36.5"><g><g><path d="M18.25,0A18.25,18.25,0,1,0,36.5,18.25,18.25,18.25,0,0,0,18.25,0Zm0,20.69a2.44,2.44,0,1,1,2.44-2.44A2.44,2.44,0,0,1,18.25,20.69Z"/></g></g></svg><span class="solutions__title solutions__toggle-title h6" data-anim-parent-trigger="data-anim-parent-trigger">hide</span></button>');
						// Hide btn:
						$toggleItem.addClass(css.active).append('<svg class="solutions__toggle-icon" data-anim-parent-trigger="data-anim-parent-trigger" data-anim-stagger="fade-top" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.5 36.5"><g><g><path d="M18.25,0A18.25,18.25,0,1,0,36.5,18.25,18.25,18.25,0,0,0,18.25,0ZM7.48,20.69a2.44,2.44,0,1,1,2.44-2.44A2.44,2.44,0,0,1,7.48,20.69Zm10.77,0a2.44,2.44,0,1,1,2.44-2.44A2.44,2.44,0,0,1,18.25,20.69Zm10.77,0a2.44,2.44,0,1,1,2.44-2.44A2.44,2.44,0,0,1,29,20.69Z"/></g></g></svg><span class="solutions__title solutions__toggle-title h6" data-anim-stagger="fade-top" data-anim-parent-trigger="data-anim-parent-trigger">all industries</span>');
					}
					$solutionsItem.eq(index).addClass('solutions__item_hidden');
				}
			});
			
			// Init toggle btn:
			this.initToggleBtn($itemContainer, $solutionsItem);
		}
	}

	initToggleBtn($itemContainer, $solutionsItem) {
		const $btnShow = $('.solutions__item.is-active'),
					$solutionsItemHidden = $('.solutions__item_hidden');
		
		let initShowBtnIndex,
				btnPosition = 0;

		if ($solutionsItemHidden.length) $solutionsItemHidden.wrapAll('<div class="solutions__wrap-hidden" />').wrapAll('<div />');

		$btnShow.on('click tap', function (e) {
			let $this = $(this);
			
			if ($this.closest('.solutions__row-2.is-hide').length === 1) {
				e.preventDefault();
			}

			let $hiddenWrap = $(this).closest('.solutions__wrap-hidden');
			
			if ($hiddenWrap.length) {
				Resp.isMobile ? initShowBtnIndex = 5 : initShowBtnIndex = 11;
				$hiddenWrap.slideUp("linear");
				$itemContainer.addClass(css.hide);
				if (btnPosition !== 0) $body.animate({ scrollTop: btnPosition - 100 }, 700);
				setTimeout(function () {
					$solutionsItem.eq(initShowBtnIndex).addClass(css.active);
				}, 400);
			} else {
				btnPosition = $(this).offset().top
				$btnShow.next().slideDown("linear");
				$itemContainer.removeClass(css.hide);
			}
		});
	}
}

export default new ToggleBtn();