import { css, Resp } from '../modules/dev/helpers';

class Form {
	constructor() {
		this.$form = $('.form');
		this.$input = this.$form.find('.form-input');
		this.$textarea = this.$form.find('.form-textarea');
		
		this.init();
	}
	
	init() {
		this.checkFill();
		this.resizeTextarea();
		this.removeError();
		this.jobFormInputControls();
	}
	
	resizeTextarea() {
		$.each(this.$textarea, function () {
			let resizeTextarea = function (el) {
				$(el).css('height', '').css('height', el.scrollHeight);
			};
			resizeTextarea(this);
			$(this).on('keyup input', function () { resizeTextarea(this); });
		});
	}
	
	checkFill() {
		this.$input.add(this.$textarea).each(function () {
			checkInput($(this));
		});
		this.$input.add(this.$textarea).blur(function () {
			checkInput($(this));
		});
		
		function checkInput(el) {
			if (el.val() !== '') {
				el.addClass(css.fill);
			} else {
				el.removeClass(css.fill);
			}
		}
	}
	
	jobFormInputControls() {
		let $inputFile = $('.input-file');
		
		checkInputTypeFile($inputFile);
		
		function checkInputTypeFile(input) {
			input.on("change", function() {
				let $this = $(this);
				
				($this.get(0).files.length !== 0) ? $this.addClass('not-empty') : $this.removeClass('not-empty')
			});
			
			input.on("click", function(e) {
				let $this = $(this);
				
				if ($this.get(0).files.length !== 0) {
					e.preventDefault();
					
					$this.replaceWith(input.val('').clone(true).removeClass('not-empty'));
					// refresh variables and func:
					$inputFile = $('.input-file');
					checkInputTypeFile($inputFile);
				}
			});
		}
	}
	
	removeError() {
		this.$input.add(this.$textarea).on('click focus', (ev) => {
			$(ev.currentTarget).parent().removeClass(css.error);
		});
	}
}

export default new Form();
