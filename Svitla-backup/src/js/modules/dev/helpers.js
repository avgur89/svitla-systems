/**
 * Commonly used constants and functions.
 *
 * @module Helpers
 */

/**
 * Cache body DOM element.
 *
 * @constant
 * @type {jQuery}
 */
export const $body = $('body');

/**
 * Cache document.
 *
 * @constant
 * @type {jQuery}
 */
export const $document = $(document);

/**
 * Cache window.
 *
 * @constant
 * @type {jQuery}
 */
export const $window = $(window);

/**
 * Cache header.
 *
 * @constant
 * @type {jQuery}
 */
export const $header = $('header');

/**
 * Cache footer.
 *
 * @constant
 * @type {jQuery}
 */
export const $footer = $('footer');

/**
 * Elements for cross-browser window scroll.
 *
 * @constant
 * @type {jQuery}
 */
export const $scrolledElements = $('html, body');

/**
 * Window width.
 *
 * @constant
 * @type {Number}
 */
export const winWidth = $window.width();

/**
 * Detect current page.
 *
 * @constant
 * @type {String}
 */
export const currentPage = $body.find('main').data('page');

/**
 * Toggle class on specified element on click.
 *
 * @param {jQuery} clickHandler
 * @param {jQuery} element
 * @param {String} [className='active']
 */
export const toggleClass = (clickHandler, element, className = css.active) => {
	clickHandler.on('click tap', () => element.toggleClass(className));
};

/**
 * Check if element is in viewport.
 *
 * @param {jQuery} $element
 * @param {Boolean} [fullyInView = false] - element should be fully in viewport?
 * @param {Number} [offsetTop = 0]
 * @returns {Boolean}
 */
export const isScrolledIntoView = ($element, offsetTop = 0, fullyInView = false) => {
	const pageTop = $window.scrollTop();
	const pageBottom = pageTop + $window.height();
	const elementTop = $element.offset().top;
	const elementBottom = elementTop + $element.height();
	
	if (fullyInView) return ((pageTop < elementTop) && (pageBottom > elementBottom));
	
	return (((elementTop + offsetTop) <= pageBottom) && (elementBottom >= pageTop));
};

/**
 * Check specified item to be target of the event.
 *
 * @param {Object} e - Event object.
 * @param {jQuery} item - Item to compare with.
 * @returns {Boolean} - Indicate whether clicked target is the specified item or not.
 */
export const checkClosest = (e, item) => $(e.target).closest(item).length > 0;

/**
 * Match media device indicator.
 */
export class Resp {
	/**
	 * Get window's current width.
	 *
	 * @get
	 * @static
	 * @return {Number}
	 */
	static get currWidth() {
		return window.innerWidth;
	}
	
	/**
	 * Detect touch events.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isTouch() {
		return 'ontouchstart' in window;
	}
	
	/**
	 * Detect desktop large device.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isDeskLg() {
		return window.matchMedia(resp.deskLg).matches;
	}
	
	/**
	 * Detect desktop device.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isDesk() {
		return window.matchMedia(resp.desk).matches;
	}
	
	/**
	 * Detect mac screen size device.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isMac() {
		return window.matchMedia(resp.mac).matches;
	}
	
	/**
	 * Detect tablet device.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isTablet() {
		return window.matchMedia(resp.tablet).matches;
	}
	
	/**
	 * Detect mobile device.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isMobile() {
		return window.matchMedia(resp.mobile).matches;
	}
	
	/**
	 * Detect mobile device.
	 *
	 * @get
	 * @static
	 * @return {Boolean}
	 */
	static get isNotMobile() {
		return window.matchMedia(resp.notMobile).matches;
	}
}

/**
 * Css class names.
 *
 * @constant
 * @type {Object}
 */
export const css = {
	overflow: 'is-overflow',
	active: 'is-active',
	anim: 'has-anim',
	noTouch: 'no-touch',
	small: 'is-small',
	fill: 'is-fill',
	error: 'has-error',
	offTransition: 'transition-off',
	play: 'is-play',
	noEvents: 'no-events',
	init: 'is-init',
	loading: 'is-loading',
	hide: 'is-hide',
	blue: 'is-blue',
	white: 'is-white',
	menuActive: 'menu-active',
	disabled: 'is-disabled',
	animLine: 'anim-line__item'
};

/**
 * Match media
 *
 * @constant
 * @type {Object}
 */
export const resp = {
	deskLg: '(min-width: 1600px)',
	mac: '(min-width: 1200px) and (max-width: 1599px)',
	desk: '(min-width: 1200px)',
	tablet: '(min-width: 768px) and (max-width: 1200px)',
	mobile: '(max-width: 767px)',
	notDesk: '(max-width: 1199px)',
	notMobile: '(min-width: 768px)'
};

/**
 * Generate string of random letters.
 *
 * @param {Number} length
 */
export const randomString = (length = 10) => Math.random().toString(36).substr(2, length > 10 ? length : 10);

/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 *
 * @param {Function} func
 * @param {Object} context
 * @param {Number} wait
 * @param {Boolean} [immediate]
 * @returns {Function}
 */
export const debounce = (func, context, wait, immediate) => {
	let timeout;
	
	return () => {
		const args = arguments;
		
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Throttle function.
 *
 * @param {Function} fn
 * @param {Number} [threshold]
 * @param {Object} [scope]
 * @returns {Function}
 */
export const throttle = (fn, threshold = 250, scope) => {
	let last, deferTimer;
	
	return function () {
		const context = scope || this;
		const now = +new Date;
		const args = arguments;
		
		if (last && now < last + threshold) {
			clearTimeout(deferTimer);
			deferTimer = setTimeout(() => {
				last = now;
				fn.apply(context, args);
			}, threshold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
};

/**
 * Create html for svg icon
 *
 * @param {String} name
 * @returns {String}
 */
export const svgIcon = (name) => {
	return `
		<svg class="icon icon-${name}">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-${name}"></use>
    </svg>`;
};
