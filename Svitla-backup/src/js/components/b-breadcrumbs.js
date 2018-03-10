import Link from './link';
import { $window, css } from '../modules/dev/helpers';

class Breadcrumbs {
	constructor() {
		this.$breadcrumbs = $('.breadcrumbs');
		this.$breadcrumbsLink = this.$breadcrumbs.find('a');
		
		this.init();
	}
	
	init() {
		this.initBreadcrumbs();
	}
	
	initBreadcrumbs() {
		new Link(this.$breadcrumbsLink, {
			type: 'single-reverse'
		});
		
		// Hide breadcrumbs after scroll:
		$window.on('scroll', () => {
			$window.scrollTop() > 5 ? this.$breadcrumbs.addClass(css.hide) : this.$breadcrumbs.removeClass(css.hide);
		});
	}
}

export default new Breadcrumbs();
