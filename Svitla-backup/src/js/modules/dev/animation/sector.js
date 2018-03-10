import { TweenMax } from 'gsap';
import { $window, Resp } from '../helpers';

export default class Sector {
	constructor() {
		this.canvas = document.getElementById('screenCanvas');
		this.$canvas = $(this.canvas);
		this.ctx = this.canvas.getContext('2d');
		
		this.init();
	}
	
	init() {
		this.setCanvasSize();
		this.resizeCanvas();
		this.setOptions();
		this.draw();
	}
	
	resizeCanvas() {
		window.addEventListener("orientationchange", () => {
			setTimeout(() => {
				this.setCanvasSize('resize');
				this.setOptions();
				this.render();
			}, 10);
		});
	}
	
	setCanvasSize(state) {
			this.canvas.width = this.$canvas.width();
			this.canvas.height = this.$canvas.height();
			this.canvasVerticalType = (this.canvas.classList.contains('screen__canvas_vertical-arc')); // - return false from home page;
		
		// Set default options:
		if (!this.canvasVerticalType) {
			this.options = {
				sectorRadius: 980,
				sectorWidth: 600,
				sectorColor: 'rgb(46, 58, 77)',
				posX: this.canvas.width / 2 - 540,
				posY: this.canvas.height + 510,
				sAngle: -Math.PI / 3.99,
				yAngle: Math.PI * 7.01 / 4,
				speed: 1,
			};
			
			// Correct options (if canvas section starting from center screen):
			if (this.canvas.classList.contains('screen__canvas_center')) this.options.posX = this.canvas.width / 2 - 764;
			// Correct options (if canvas section starting from middle position of screen):
			if (this.canvas.classList.contains('screen__canvas_middle')) this.options.posX = this.canvas.width / 2 - 670;
		} else {
			// Set options from canvas with vertical arc:
			this.options = {
				sectorRadius: 1000,
				sectorWidth: 425,
				sectorColor: 'rgb(46, 58, 77)',
				posX: (this.canvas.width / 2) - 970,
				posY: (window.innerHeight / 2) + 20,
				sAngle: 2 * Math.PI,
				yAngle: 0,
				sectorInnerRadius: 900,
				speed: 1,
			};
		}
		
		switch (true) {
			case Resp.isMac:
				if (this.canvasVerticalType) {
					this.options.posX = (this.canvas.width / 2) - 770,
					this.options.sectorInnerRadius = 700;
				} else {
					this.options.posY = this.options.posY = 1280 + 25;
				}
				break;
			case Resp.isTablet:
				if (this.canvasVerticalType) {
					this.options.posX = (this.canvas.width / 2) - 770,
					this.options.posY = (window.innerHeight / 2) - 200,
					this.options.sectorRadius = 600,
					this.options.sectorWidth = 340,
					this.options.sectorInnerRadius = 600,
					this.options.sAngle = 2 * Math.PI + .8,
					this.options.yAngle = 0.8;
				} else {
					this.options.posX = this.canvas.width / 2 - 775;
					this.options.posY = 1280 + 60;
				}
				break;
			case Resp.isMobile:
				if (this.canvasVerticalType) {
					this.options.posX = -180,
					this.options.posY = 80,
					this.options.sectorRadius = 280,
					this.options.sectorWidth = 170,
					this.options.sectorInnerRadius = 280,
					this.options.sAngle = 2 * Math.PI + .77,
					this.options.yAngle = .77;
					if (window.innerHeight < window.innerWidth) {
						this.options.posX = this.canvas.width / 2 - 312
					}
				} else {
					if ((window.innerWidth > window.innerHeight)) {
						this.options.posX = this.canvas.width / 2 - 880;
						this.options.posY = 1280 - 260;
					} else {
						this.options.posX = this.canvas.width / 2 - 880;
						this.options.posY = 1280 - 220;
					}
				}
				break;
			default:
				return;
		}
		
		if (state === 'resize') {
			if (this.canvasVerticalType) {
				(Resp.isTablet || Resp.isMobile) ?
					TweenMax.set(this.options, {sAngle: Math.PI}) :
					TweenMax.set(this.options, {yAngle: Math.PI, sAngle: Math.PI})
			} else {
				TweenMax.set(this.options, {yAngle: Math.PI * 5 / 4});
			}
		}
	}
	
	setOptions() {
		this.sectorRadius = this.options.sectorRadius;
		this.sectorWidth = this.options.sectorWidth;
		this.sectorColor = this.options.sectorColor;
		this.posX = this.options.posX;
		this.posY = this.options.posY;
		this.sAngle = this.options.sAngle;
		this.yAngle = this.options.yAngle;
		this.sectorInnerRadius = this.options.sectorInnerRadius;
	}
	
	startAnim() {
		let _this = this;
		if (this.canvasVerticalType) {
			if (Resp.isTablet || Resp.isMobile) {
				TweenMax.to(this, this.options.speed, {
					sAngle: Math.PI,
					ease: Power1.easeInOut,
					delay: .8
				});
			} else {
				TweenMax.to(this, this.options.speed, {
					yAngle: Math.PI,
					sAngle: Math.PI,
					ease: Power1.easeInOut,
					delay: .8
				});
			}
		} else {
			TweenMax.to(this, this.options.speed, {
				yAngle: Math.PI * 5 / 4,
				ease: Power1.easeInOut
			});
		}
	}
	
	screenAnim() {
		TweenMax.to(this, 1, {
			yAngle: Math.PI * 7.01 / 4,
			ease: Power1.easeInOut,
		});
	}
	
	nextSlide() {
		let _this = this;
		
		TweenMax.to(this, this.options.speed * 2 / 3, {
			sAngle: -Math.PI * 5 / 4,
			ease: Power1.easeIn,
			onComplete() {
				TweenMax.set(_this, { sAngle: -Math.PI / 3.99 });
				TweenMax.set(_this, { yAngle: Math.PI * 7.01 / 4 });
				
				TweenMax.to(_this, _this.options.speed * 2 / 3, {
					yAngle: Math.PI * 5 / 4,
					ease: Power1.easeInOut
				});
			}
		});
	}
	
	createInnerCircle() {
		let ctx = this.ctx;
		
		ctx.save();
		ctx.beginPath();
		this.canvasVerticalType ?
			ctx.arc(this.posX, this.posY, this.sectorInnerRadius - this.sectorWidth / 2 + 2, 0, 2 * Math.PI)
			:
			ctx.arc(this.posX, this.posY, this.sectorRadius - this.sectorWidth / 2 + 2, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	
	createWrapCircle() {
		let ctx = this.ctx;
		
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.posX, this.posY, 3000 - 2, 0, 2 * Math.PI);
		ctx.fillStyle = 'transparent';
		this.canvasVerticalType ?
			ctx.lineWidth = 2 * (3000 - this.sectorInnerRadius - this.sectorWidth / 2)
			:
			ctx.lineWidth = 2 * (3000 - this.sectorRadius - this.sectorWidth / 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
	
	render() {
		let _this = this;
		let ctx = this.ctx;
		ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
		ctx.lineWidth = _this.sectorWidth;
		ctx.strokeStyle = _this.sectorColor;
		ctx.fillStyle = _this.sectorColor;
		
		_this.createInnerCircle();
		_this.createWrapCircle();
		ctx.save();
		ctx.beginPath();
		this.canvasVerticalType ?
			ctx.arc(_this.posX, _this.posY, _this.sectorInnerRadius, _this.sAngle, _this.yAngle, true)
			:
			ctx.arc(_this.posX, _this.posY, _this.sectorRadius, _this.sAngle, _this.yAngle, false);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
	
	draw() {
		alert(this);
		this.render();
		this.ref = window.requestAnimationFrame(this.draw);
	}
}
