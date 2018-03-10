import objectFitImages from 'object-fit-images';
import objectFitVideos from 'object-fit-videos';
import Ps from 'perfect-scrollbar';
import '../../../node_modules/video.js/dist/video';
import { AnimStagger } from '../modules/dev/animation/stagger';
import { AnimLinesAPI} from '../components/animLines';
import { $window, Resp, throttle } from '../modules/dev/helpers';
import './b-experstise';
import './b-half';
import './b-meet';
import './b-tags';
import './b-slider';
import './b-filters';
import './dot';
import './footer';
import './form';
import './header';
import './b-google-map';
import './b-statistic';
import {ScreenAPI} from './b-screen';
import Link from './link';
import './screen-play-video';
import './noTouch';
import './preloader';
import './lazyVideo';
import './animLines';
import './toggleBtn';
import './slickInit';
import './b-breadcrumbs';
import './b-pagination';
import './b-fixed-share';
import './b-leader-tooltip';
import './b-navigation-sectors';
import './b-redactor';
import './b-init-ps';
import 'select2';

/**
 * Website's common scripts.
 *
 * @module Common
 */
export class Common {
	init() {
		AnimStagger.init();
		AnimLinesAPI.init();
		Common.initLinks();
		Common.addDataAttrToSVG();
		Common.detectEmptyBlockBlog4();
		this.resize();
		objectFitImages();
		objectFitVideos();
		ScreenAPI.init();
		
		// Init select2:
		let $select2 = $(".js-select");
		
		$select2.select2().on('select2:open', function () {
			setTimeout(function() {
				let select2Container = document.getElementsByClassName('select2-results__options')[0],
						height = $(select2Container).outerHeight(),
						maxHeight = Number($(select2Container).css('max-height').slice(0, -2));
				
				if (height >= maxHeight) {
					Ps.initialize(select2Container);
				}
			}, 0);
			
			$('.select2-dropdown').on('click tap', (e) => {
				e.stopPropagation();
			});
		});
	}

	static getResp() {
		return '' + Resp.isDesk + Resp.isTablet + Resp.isMobile;
	}
	
	resize() {
		let currentResp = Common.getResp();
		
		//reInit animations
		const throttleResize = throttle(() => {
			if (currentResp !== Common.getResp() && Resp.isDesk) {
				AnimStagger.init();
			}
			
			currentResp = Common.getResp();
		}, 250, this);
		
		$window.on('resize', throttleResize);
	}

	// static disableInputScroll() {
   //  $('.form-input').on('focusin focus', function(e) {
   //    e.preventDefault();
   //    const target = $(this);
  //
   //    $('html, body').animate({
   //      scrollTop: target.offset().top
   //    }, 500);
   //  })
	// }

	static initLinks() {
		new Link($('.js-link-circle'));
		new Link($('.js-link-single-circle'), {
			type: 'single'
		});
		new Link($('.js-link-multiple-circle'), {
			type: 'multiple'
		});
	}
	
	static detectEmptyBlockBlog4() {
		let $smallCol = $('.blog-4__col.col__small');

		$smallCol.each(function(index, el) {
			let $this = $(this);
			
			if ($this.text() === '') $this.next().addClass('blog-4_mt-0-append-js');
		});
	}
	
	static addDataAttrToSVG() {
		let $svg = $('.solutions__item svg');
		
		if ($svg !== undefined) {
			$svg.each(function(index, el){
				let $this = $(this);
				
				$this.attr('data-anim-parent-trigger', 'data-anim-parent-trigger');
				$this.attr('data-anim-stagger', 'fade-top');

				window.reInitStagger();
			});
		}
	}
}

/** Export initialized common scripts by default */
export default new Common().init();
