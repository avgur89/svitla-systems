class Statistic {
	constructor() {
		this.$statistic = $('.statistic');
		this.$statisticItem = this.$statistic.find('.statistic__title');
		
		this.init();
	}
	
	init() {
		if (this.$statistic.length) {
			this.initFontReduce();
		}
	}
	
	initFontReduce() {
		let textItems,
				textItemsCount,
				textWidth,
				symbolItems,
				symbolItemsCount,
				maxTextWidth = 0,
				maxTextElementIndex,
				containerWidth,
				newFontSize,
				maxFontSize;
				
		this.$statistic.each(function (i, parentContainer) {
			maxTextWidth = 0;
			maxTextElementIndex = 0;
			
			textItems = parentContainer.getElementsByClassName('statistic__title');
			symbolItems = parentContainer.getElementsByClassName('statistic__symbol');
			textItemsCount = textItems.length;
			for (let j = 0; j < textItemsCount; j++) {
				textWidth = textItems[j].scrollWidth;
				containerWidth = textItems[j].clientWidth;
				
				if (maxTextWidth < textWidth) {
					maxTextWidth = textWidth;
					maxTextElementIndex = j;
				}
			}

			maxFontSize = window.getComputedStyle(textItems[maxTextElementIndex], null).getPropertyValue('font-size');
			
			// Found and set new font size:
			if (textItems[maxTextElementIndex].scrollWidth > textItems[maxTextElementIndex].clientWidth) {
				
				reduceFontSize(textItems, textItems[maxTextElementIndex], parentContainer, maxFontSize);
				
				// Set fontsize for upper symbol:
				symbolItemsCount = symbolItems.length;
				for (let k = 0; k < symbolItemsCount; k++) {
					symbolItems[k].style.fontSize = .5 * newFontSize + 'px';
				}
			}
			
			// Recursion selection new font size for 'statictic__number':
			function reduceFontSize(textItems, textItemsMax, parentContainer, maxFontSize) {
				let currentFontSize = window.getComputedStyle(textItemsMax, null).getPropertyValue('font-size'),
						fontSizeNumber = parseFloat(currentFontSize),
						containerWidth = textItemsMax.clientWidth,
						textItemsCount = textItems.length;
				
				if (textItemsMax.scrollWidth > containerWidth) {
					fontSizeNumber--
					textItemsMax.style.fontSize = fontSizeNumber + 'px';
					reduceFontSize(textItems, textItemsMax, parentContainer, maxFontSize);
				} else {
					if (fontSizeNumber > maxFontSize) {
						for (let i = 0; i < textItemsCount; i++) {
							textItems[i].style.fontSize = maxFontSize + 'px';
						}
						return false;
					} else {
						for (let i = 0; i < textItemsCount; i++) {
							textItems[i].style.fontSize = fontSizeNumber + 'px';
						}
						newFontSize  = fontSizeNumber;
					}
				}
			}
		});
	}
}

export default new Statistic();
