import Link from './link';
import PS from 'perfect-scrollbar';
import { Resp, css, $window } from '../modules/dev/helpers';

class LeaderTooltip {
	constructor() {
		this.$leader = $('.leader');
		this.init();
	}
	
	init() {
		if (this.$leader.length) {
			this.initTooltip();
		}
	}
	
	initTooltip() {
		let $leader = $('.leader'),
				$tooltips = $leader.find('.leader__tooltip'),
				$closeBtn = $tooltips.find('.leader__tooltip-close'),
				slideToggleDuration = 600;
		
		// Show tooltip after click:
		$leader.on('click tap', function () {
			const $this = $(this),
						$tooltip = $this.find('.leader__tooltip'),
						$title = $this.find('.leader__title'),
						$descr = $this.find('.leader__descr'),
						$tooltipTitle = $tooltip.find('.leader__tooltip-title'),
						$tooltipDescr = $tooltip.find('.leader__tooltip-descr'),
						$tooltipText = $this.find('.leader__text'),
						$leaderWidth = $this.outerWidth();
			
			if ($this.hasClass(css.active)) return false;
			$leader.removeClass(css.active);
			
			switch (true) {
				case Resp.isDesk:
					$tooltip.css('width', (2 * $leaderWidth) + 1);
					break;
				case Resp.isTablet:
					$tooltip.css('width', (2 * $leaderWidth) + 1);
					break;
				case Resp.isMobile:
					$tooltip.css('width', $leaderWidth + 1);
					break;
				default:
					return;
			}
			
			$tooltips.slideUp();
			$tooltipTitle.text("");
			$tooltipDescr.text("");
			
			$this.addClass(css.active);
			$tooltipTitle.text($title.text());
			$tooltipDescr.text($descr.text());
			
			$tooltip.slideDown(slideToggleDuration);
			new Link($closeBtn, { type: 'close' });
			
			setTimeout(() => {
				if ($tooltipText.height() >= Number($tooltipText.css('max-height').slice(0, -2))) {
					PS.initialize($tooltipText.get(0));
				}
			}, 600);
		});
		
		$closeBtn.on('click tap', (e) => {
			e.stopPropagation();
			
			closeTooltip();
		});
		
		$window.on('resize', ()=> {
			
			closeTooltip();
		});
		
		function closeTooltip() {
			$tooltips.slideUp(slideToggleDuration);
			$leader.removeClass(css.active);
		}
	}
}

export default new LeaderTooltip();
