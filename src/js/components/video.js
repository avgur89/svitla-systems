import videojs from '../../../node_modules/video.js/dist/video';

export default class Video {
	constructor() {
		this.videoID = 'video';
	}
	
	init(el, count = false) {
		let $video = $(el);
		let defaultVolume = 0.5;
		let videoOptions = {
			fluid: true
		};
		let player;
		
		$video.each((index, el) => {
			let $currentTarget = $(el);
			
			$currentTarget.attr('id', this.videoID + (index + (count ? count : '')));
			
			player = videojs(this.videoID + (index + (count ? count : '')), videoOptions, function () {
				this.volume(defaultVolume);
			});
			$(player.el_).addClass('video-js');
		});
		
		return player;
	}
}