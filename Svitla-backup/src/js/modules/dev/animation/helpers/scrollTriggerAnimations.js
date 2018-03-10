import ScrollMagic from 'ScrollMagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';
import { $window, Resp } from '../../helpers';

export default class SCROLL_TRIGGER_ANIMATIONS {

	constructor(config) {
		this._container = config.container;
		this.onStart = config.onStart;
		this.onEnter = config.onEnter;
		this.onEnd = config.onEnd;
		this._triggerHook = config.triggerHook;
		this._offset = config.offset;
		this._init();
	}

	_init() {
		if (!this._container) return;
		this._createController();
		this._createScene();
	}
	
	_createController() {
		this._controller = new ScrollMagic.Controller({ addIndicators: false });
	}

	_createScene() {
		let _this = this;
		this.scene = new ScrollMagic.Scene({
			triggerElement: this._container,
			triggerHook: this._triggerHook || Resp.isDesk ? 0.85 : 1,
			offset: this._offset || 0
		})
		 //.addIndicators()
		.on('start', function (event) {
			if ($(_this._container).hasClass('has-anim')) return;
			if (typeof _this.onStart != 'function') return;
			_this.onStart();
			_this._container.className += ' has-anim';
		})
		.on('enter', function (event) {
			if (typeof _this.onEnter != 'function') return;
			_this.onEnter();
		})
		.on('end', function (event) {
			if (typeof _this.onEnd != 'function') return;
			_this.onEnd();
		})
		.addTo(this._controller);
	}
	
	destroyScroll() {
		this.scene.destroy(true);
	}
};
