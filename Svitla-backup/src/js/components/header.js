import { TimelineMax, TweenMax } from 'gsap';
import '../modules/dep/DrawSVGPlugin';
import '../modules/dep/SplitText';
import { $body, $document, $scrolledElements, $window, css, Resp, throttle } from '../modules/dev/helpers';
import Link from './link';
import { PreloaderAPI } from './preloader';

class Header {
	constructor() {
		this.header = '.header';
		this.$header = $('.header');
		this.$menuBtn = $('.header__menu');
		this.$logo = this.$header.find('.header__logo-icon');
		this.$nav = this.$header.find('.header__nav');
		this.$link = this.$header.find('.header__nav > ul > li > a');
		this.$linkMobSubmenu = this.$header.find('.header__nav > ul > li > a:not(.disabled)');
		this.$closeBtn = this.$header.find('.header__search-close');
		this.$searchBtn = this.$header.find('.header__search-btn');
		this.$form = this.$header.find('.header__form');
		this.$submitBtn = this.$form.find('.form-submit-search');
		this.submitBtnFlag = false;
		
		this.init();
	}
	
	init() {
		this.$header.hide();
		return;
		this.initToggle();
		this.createCloseBtn();
		
		if (Resp.isDesk) {
			this.initSearch();
			this.initSubNav();
			new Link(this.$link, { state: 'header' });
		}
		
		if (!Resp.isDesk) {
			this.prepareMobileMenu();
			this.initMenuBtn();
			this.initMobileMenu();
		}
		
		PreloaderAPI.wait().then(() => {
			this.startAnim();
		});
	}
	
	prepareMobileMenu() {
		this.$subnav = this.$link.siblings('ul');
		
		this.$nav.appendTo($(this.header + '__mobile-nav').children());
		this.$subnav.appendTo($(this.header + '__mobile-subnav').children());
		this.$searchBtn.appendTo(this.$nav.children());
		this.$form.appendTo(this.$nav.children());

    // like at desktop behaviour, just make list shorten and add more-btn:
    this.$subnav.each( ( index, item ) => {
      this.setupMoreBtn( $( item ) ) 
    } );
    // duplicate parent link to sub-menu< just because of 
    // on mobile main nav is just a toggler for sub-menu, not a real link:
    this.$linkMobSubmenu.each( ( index, item ) => {
      let $item = $( item );
      let $subMenu = this.$subnav.eq( $item.parent().index() );
      let $li = $('<li></li>');

      $li.append( $item.clone() )
      $subMenu.prepend( $li );
    } );
	}
	
	initMobileMenu() {
		this.$menuBtn.on('click', () => {
			this.openMobileMenu();
		});
		
		this.$closeBtn.on('click', () => {
			this.closeMobileMenu();
		});
		
		this.$searchBtn.on('click', () => {
			this.$link.parent().removeClass(css.active);
			this.$nav.children().removeClass(css.active);
			this.$subnav.removeClass(css.active)
				.parent().parent().removeClass(css.active);
			this.$form.fadeToggle();
		});
		
		this.$linkMobSubmenu.on('click', (e) => {
			e.preventDefault();
			
			let $currentTarget = $(e.currentTarget);
			let $sublist = $currentTarget.siblings('ul');
			
			if ($currentTarget.parent().hasClass(css.active)) {
				$currentTarget.parent().removeClass(css.active)
					.parent().removeClass(css.active);
				this.$subnav
					.removeClass(css.active)
					.parent().parent().removeClass(css.active);
				
				return;
			}
			
			this.$subnav
				.removeClass(css.active)
				.eq($currentTarget.parent().index()).addClass(css.active)
				.parent().parent().addClass(css.active);
			
			this.$link.parent().removeClass(css.active)
				.find('ul').removeClass(css.active);
			$currentTarget.parent().addClass(css.active)
				.parent().addClass(css.active);
			$sublist.addClass(css.active);
      console.log($sublist);
		});
	}
	
	openMobileMenu() {
		let _this = this;
		
		this.beforeOpen();
		this.$menuBtn.fadeOut(() => {
			this.$closeBtn.fadeIn();
			$body.addClass(css.menuActive);
		});
		this.$header.addClass(css.white).addClass(css.menuActive);
		this.$nav.show();
		TweenMax.staggerTo(this.$link.parent(), 0.3, {
			alpha: 1,
			y: 0,
			delay: 0.1,
			ease: Power1.easeOut,
			onComplete() {
				TweenMax.to(_this.$searchBtn, 0.3, {
					alpha: 1,
					y: 0,
					delay: 0.05,
					ease: Power1.easeOut
				});
			}
		}, 0.05);
		
		if (!this.$header.hasClass(css.active)) {
			setTimeout(() => {
				this.$header.addClass(css.active);
				new Link(this.$link, { type: 'single' });
			}, 0);
		}
	}
	
	closeMobileMenu() {
		$body.removeClass(css.menuActive);
		this.beforeClose();
		this.$closeBtn.fadeOut(() => {
			this.$menuBtn.fadeIn();
		});
		this.$header.removeClass(css.white);
		this.$link.parent().removeClass(css.active);
		this.$nav.hide()
			.children().removeClass(css.active);
		this.$subnav.removeClass(css.active)
			.parent().parent().removeClass(css.active);
		TweenMax.set([this.$link.parent(), this.$searchBtn], {
			alpha: 0,
			y: -20
		});
		this.$form.hide();
		if ($window.scrollTop() > 5) {
			this.$header.addClass(css.blue);
		}
	}
	
	beforeOpen() {
		this.scrollTop = $window.scrollTop();
	}
	
	beforeClose() {
		$scrolledElements.scrollTop(this.scrollTop);
		setTimeout(() => {
			this.$header.removeClass(css.menuActive);
		}, 0);
	}
	
	/**
	 * Hide header on scroll down.
	 */
	initToggle() {
		let lastScrollTop = $window.scrollTop();
		const $header = this.$header;
		const delta = 5;
		const headerHeight = $header.height();
		
		const checkWithThrottle = throttle(() => {
			const scrollTop = $window.scrollTop();
			
			// not enough scroll!!..
			if (Math.abs(lastScrollTop - scrollTop) <= delta) return;
			
			if (scrollTop <= delta) {
				$header.removeClass(css.blue);
			}
			
			if (scrollTop > lastScrollTop && scrollTop > headerHeight && !this.$header.hasClass(css.menuActive)) {
				$header.addClass(css.hide).addClass(css.blue);
			} else if (scrollTop + $window.height() < $document.height()) {
				$header.removeClass(css.hide);
			}
			
			lastScrollTop = scrollTop;
		}, 50, this);
		
		$window.on('scroll', checkWithThrottle);
		
		return this;
	}
	
	initSubNav() {
		this.$link.parent().on('mouseenter', (e) => {
			let sleep = false;
			let $currentTarget = $(e.currentTarget);
			
			$currentTarget.on('mouseleave', () => {
				sleep = true;
			});
			
			setTimeout(() => {
				if (!sleep) {
					$currentTarget.siblings('.' + css.active).removeClass(css.active);
					$currentTarget.siblings().find('ul').removeClass(css.active);
					$currentTarget.find('ul').addClass(css.active);
					
					if (!$currentTarget.find('ul').hasClass(css.anim)) {
						this.setupMoreBtn($currentTarget.find('ul'));
					}
					
					this.$header.addClass(this.header.substr(1) + '_nav');
					this.addHeaderWhite();
				}
			}, 100);
		});
		
		this.$header.on('mouseleave', () => {
			this.$link.parent().filter('.' + css.active).removeClass(css.active);
			
			this.$link.parent().find('ul').removeClass(css.active);
			if (this.$header.hasClass(this.header.substr(1) + '_nav')) {
				this.removeHeaderWhite();
				this.$header.removeClass(this.header.substr(1) + '_nav');
			}
		});
	}
	
  /**
   * Expected sub-menu <ul> as $container
   * @param {jQuery} $container  
   */
  setupMoreBtn($container) {
    let urlMore = $container.data('more-url'),
      textMore = $container.data('more-text'),
      hideIndex = $container.data('hide-index'),
      htmlMore =
        `<li class="more ${ !Resp.isDesk ? 'more-btn' : '' }">
                    <a href="${urlMore}" data-hover="${textMore}">
                      <span>${textMore}</span>
                    </a>
                  </li>`,
      $htmlMore = $(htmlMore),
      listItems = $container.find('li'),
      listCount = listItems.length;
    
    new Link($container.find('a'));
    $container.addClass(css.anim);
    
    if (hideIndex < listCount) {
      $container.append($htmlMore);
      new Link($htmlMore.children());
      hideLink();
    }
    
    function hideLink() {
      if (hideIndex < listCount) {
        listItems.eq(hideIndex).addClass(css.hide);
        hideIndex++;
        hideLink();
      }
    }
  }

	addHeaderWhite() {
		this.$header.addClass(this.header.substr(1) + '_white');
	}
	
	removeHeaderWhite() {
		this.$header.removeClass(this.header.substr(1) + '_white');
	}
	
	initSearch() {
		let _this = this;
		let $nav = this.$nav;
		let $form = this.$form;
		let $searchBtn = this.$searchBtn;
		let $closeBtn = this.$closeBtn;
		let searchOpenTl = new TimelineMax({ paused: true });
		let searchHideTl = new TimelineMax({ paused: true });
		let speed = 0.5;
		
		$searchBtn.on('click', () => {
			this.$link.parent().filter('.' + css.active).removeClass(css.active);
			this.$link.parent().find('ul').removeClass(css.active);
			
			this.$header.removeClass(this.header.substr(1) + '_nav');
			searchOpenTl.progress(0);
			searchOpenTl.play();
			this.addHeaderWhite();
		});
		
		$closeBtn.on('click', () => {
			this.$header.removeClass(this.header.substr(1) + '_nav');
			searchHideTl.progress(0);
			searchHideTl.play();
			this.removeHeaderWhite();
		});
		
		searchOpenTl
			.to([$nav, $searchBtn], speed, {
				y: '-100%',
				ease: Power1.easeIn,
				onComplete() {
					$(this.target).each((index, el) => {
						$(el).hide();
					});
					
					$form.add($closeBtn).show();
					
					if (!_this.submitBtnFlag) {
						_this.submitBtnFlag = true;
						new Link(_this.$submitBtn, { type: 'single' });
					}
				}
			})
			.set([$form, $closeBtn], { alpha: 0, y: '-100%' })
			.to([$form, $closeBtn], speed, {
				alpha: 1,
				y: '0%',
				ease: Power1.easeOut
			});
		
		searchHideTl
			.to([$form, $closeBtn], speed, {
				alpha: 0,
				y: '-100%',
				ease: Power1.easeIn,
				onComplete() {
					$(this.target).each((index, el) => {
						$(el).hide();
					});
					$nav.add($searchBtn).show();
				}
			})
			.to([$nav, $searchBtn], speed, {
				alpha: 1,
				y: '0%',
				ease: Power1.easeOut
			});
	}
	
	startAnim() {
		let speed = 0.5;
		let tl = new TimelineMax();
		let tlLogo = new TimelineMax();
		let tlControls = new TimelineMax();
		
		// logo animation
		tlLogo
			.fromTo(this.$logo, speed * 3 / 2, {
				y: '-100%'
			}, {
				y: '0%',
				ease: Power1.easeOut,
				onComplete() {
					$(this.target).parent().css('overflow', 'visible');
				}
			});
		
		// controls animation
		tlControls
			.set([this.$nav, this.$searchBtn], { y: '-100%' })
			.to([this.$nav, this.$searchBtn], speed * 3 / 2, {
				y: '0%',
				ease: Power1.easeOut
			});
		
		tl
			.addLabel('go', 0)
			.set(this.$header, { alpha: 1 })
			.add(tlControls, 'go')
			.add(tlLogo, 'go+=0.5')
			.add(() => { this.$header.addClass(css.anim); });
		
		tl.play();
		
		if ($window.scrollTop() > 0) {
			this.$header.removeClass(css.hide).addClass(css.blue);
		}
	}
	
	initMenuBtn() {
		new Link(this.$menuBtn, {
			type: 'menu'
		});
	}
	
	createCloseBtn() {
		new Link(this.$closeBtn, { type: 'close' });
	}
}

export const HeaderAPI = new Header();
