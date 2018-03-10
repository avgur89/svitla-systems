import Link from './link';

class Pagination {
	constructor() {
		this.$pagination = () => $('.pagination');

		this.init();
	}
	
	init() {
		if (this.$pagination().length !== 0) {
			this.initPagination();
		}
	}
	
	initPagination() {
		let $arrows = $('.pagination__arrow');
		
		new Link($arrows, {
			type: 'single-reverse'
		});
	}
}

export const PaginationAPI = new Pagination();
