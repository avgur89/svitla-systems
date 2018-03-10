import { TagsAPI } from './b-tags';
import { TestimonalsAPI } from './b-testimonals';
import { PaginationAPI } from './b-pagination';
import { MeetBlockAPI } from './b-meet';
import { AnimLinesAPI } from './animLines';
import Link from './link';
/**
 * Website's public API.
 *
 * @module PublicAPI
 */

export class PublicAPI {
	/**
	 * Trigger MeetBlock's Form to success statement
	 */
	formSuccess() {
		MeetBlockAPI.initSuccess();
		return this;
	}
	
	tagsRefresh() {
		TagsAPI.init();
		return this;
	}
	
	linkRefresh() {
		new Link($('.js-link-circle'));
		new Link($('.js-link-single-circle'), {
			type: 'single'
		});
		new Link($('.js-link-multiple-circle'), {
			type: 'multiple'
		});
		return this;
	}
	
	paginationRefresh() {
		PaginationAPI.init();
		return this;
	}
	
	testimonialsDeleteController() {
		TestimonalsAPI.destroyScrollTrigger();
		return this;
	}
	
	testimonialsVideoRefresh() {
		TestimonalsAPI.initVideoButton();
		return this;
	}
	
	animLineRefresh() {
		AnimLinesAPI.init();
		return this;
	}
}

/** Expose Public API */
export default window.PublicAPI = new PublicAPI;
