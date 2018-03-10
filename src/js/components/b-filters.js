import { $document, Resp } from '../modules/dev/helpers';

class Filters {
	constructor () {
		this.$filterContent = $('.filters__item__container');
		
		this.init();
	}
	
	initContainerType() {
		if (this.$filterContent.length > 0) {
			this.$filterContent.each(function(index, el) {
				let $el = $(el),
						$containerCheckItems;
				
				$containerCheckItems = $el.find('.filters__item__checkbox');
				($containerCheckItems.length < 9) ? $el.addClass('filters__item__container_single') : null;
			});
		}
	}
	
	filtersTab () {
		let $dropper = $('.js-dropper'),
		    $dropEl = $('.js-drop-in'),
				$label = $dropEl.next(),
		    $tab = $('.filters__item'),
				$checkInput = $tab.find('input');
		
		$tab.on('click tap', function () {
			let $this = $(this);
			
			if (!$this.hasClass('active')) {
				$tab.removeClass('active');
				$this.addClass('active');
			} else {
				$this.removeClass('active');
      }
		});
		
		$checkInput.on('change', function (e) {
			let $this = $(this),
					$parentTitle = $this.closest('.filters__item__container').siblings('.filters__item__link'),
					textTarget = $parentTitle.find('span'),
					defaultText = $parentTitle.attr('data-inner'),
					countChecked = $this.closest('.filters__item__container').find('input:checked').length;
			
				if (countChecked >= 1) {
					textTarget.text(`${defaultText} ( ${countChecked} selected )`);
					if (Resp.isTablet || Resp.isMobile) textTarget.text(`${defaultText} (${countChecked})`);
				} else {
					textTarget.text(`${defaultText}`);
				}
		});
		
		$document.mouseup(function (e) {
			let container = $tab;
			
			if (container.has(e.target).length === 0) {
				$tab.removeClass('active');
			}
		});
		
		$dropper.parent().on('click tap', function (e) {
      if (!$(this).children('input').hasClass('active')) {
				$dropper.removeClass('active');
				$(this).children('input').addClass('active');
			} else {
				$dropper.removeClass('active');
			}
		});
		
		$document.mouseup(function (e) {
			let container = $('.form__item__container');
			
      // if (container.has(e.target).length === 0) {
      if (!$dropper.parent().filter(e.target).length && !$dropper.parent().find(e.target).length) {
        $dropper.removeClass('active');
      }
		});
		
		$label.on('click tap', function () {
			let $this = $(this),
					label = $this.parents('.form-group').children('label'),
					span = label.find('span'),
					defaultText = label.attr('data-inner'),
					$input = $this.prev();

			if ($input.attr('type') === 'radio') {
				if ($input.prop('checked')) {
					$input.prop('checked', false);
					span.text(`${defaultText}`);
					return false;
				} else {
					span.text(`${defaultText} ( 1 selected)`);
				}
			}
		});
		
		$dropEl.on('change', function (e) {
			let _this = $(this);

			let label = _this.parents('.form-group').children('label');
			let span = label.find('span');
			let defaultText = label.attr('data-inner');
			let countChecked = _this.parents('.form__item__container').find('input:checked').length;

			if (_this.attr('type') !== 'radio') {
				if (countChecked >= 1) {
					span.text(`${defaultText} ( ${countChecked} selected )`);
				} else {
					span.text(`${defaultText}`);
				}
			}
		});
	}
	
	checkActive() {
		let $checkContainer = $('.form__item__container'),
				$checkContainer2 = $('.filters__item__container');
		
		$checkContainer.each((index2, item2) => {
			let $container = $(item2),
					defaulttext =  $container.siblings('.form-input-label').attr('data-inner'),
					$label = $container.siblings('.form-input-label').find('span'),
					$inputs = $container.find('input'),
					count = 0;
			
			$inputs.each((index, item) => {
				let $this = $(item);
				
				if ($this.attr("checked")) {
					count++;
				}
			});
			
			if (count !== 0) {
				$label.text(defaulttext + ' ( ' + count + ' selected )');
			}
		});
		
		$checkContainer2.each((index2, item2) => {
			let $container = $(item2).siblings('.filters__item__link'),
					defaulttext =  $container.attr('data-inner'),
					$label = $container.find('span'),
					$inputs = $(item2).find('input'),
					count = 0;

			$inputs.each((index, item) => {
				let $this = $(item);

				if ($this.attr("checked")) {
					count++;
				}
			});

			if (count !== 0) {
				$label.text(defaulttext + ' ( ' + count + ' selected)');
				if (Resp.isTablet || Resp.isMobile) $label.text(defaulttext + ' (' + count + ')');
			}
		});
	}
	
	init () {
		this.filtersTab();
		this.initContainerType();
		this.checkActive();
	}
}

export default new Filters();
