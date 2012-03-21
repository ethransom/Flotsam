/* 
 * Load the assets using the preloader module
*/

Preloader.def('images',function ( url, callback ) {
	var img = new Image();
	img.onload = callback;
	img.src = url;
	return img;
});

Preloader.def('foo', function ( string, callback ) {
	setTimeout( callback, Math.floor( Math.random() * 2000 ) );
	return string;
});

Preloader.def('scripts', function ( url, callback ) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.onreadystatechange = function () {
		if (this.readyState === 'complete') 
			callback();
	}
	script.onload = callback;
	script.src = url;
	head.appendChild(script);
   return true;
});

function getExtension( url ) {
	console.log('Loading ' + (Modernizr.audio.ogg != "") ? '.ogg' : '.wav' + 'sounds');
	if( Modernizr.audio.ogg != "" ) {
		return '.ogg';
	} else {
		return '.wav';
	}
}

Preloader.def('sounds', function ( url, callback ) {
	var a = new Audio();
	a.src = url;
	a.addEventListener('canplaythrough', callback, false);
	return a;
});

// Currently, the only diff between the loaders is the ogg support, fix?
Preloader.def('ogg-sounds', function ( url, callback ) {
	var a = new Audio();
	a.src = url + getExtension( url );
	a.addEventListener('canplaythrough', callback, false);
	return a;
});

window.onload = function () {
	Preloader.load({
		'images': [
			'art/raft_small.png',
			'art/evil_boat_small.png',
			'art/evil_boat_green.png',
			'art/evil_boat_yellow.png',
			"art/evil_boat_blue.png",
			"art/evil_boat_red.png",
			"art/raft_small_1.png",
			"art/raft_small_2.png",
			"art/raft_small_3.png",
			"art/ball.png",
			"art/raft_cannon_01.png",
			"art/drift_woot_02.png",
			"art/splash_02.png",
			"art/explosions.png",
			"art/fire_blob_03.png",
			// map stuff
			'art/occean_occean_03.png',
			'art/sand_01.png',
			'art/sand_02.png',
			'art/sand_03.png',
			'art/grass_01.png',
			'art/grass_02.png',
			'art/grass_03.png',
			'art/border.png',
			// end screen banner
			"art/menu_art/gameover.png",
		],
		'scripts': [
			'src/Box2D.js',
			'src/vector.js',
			'src/flotsam.js',
			'src/js_utils.js',
			'src/hud.js',
			'src/sound.js',
			'src/keyboard.js',
			'src/hero.js',
			'src/map.js',
			'levels/level-list.js',
			'ui/ui.js'
		],
		'sounds': [
			"audio/goblin_voices/goblinv_mono/gv1.wav",
			"audio/goblin_voices/goblinv_mono/gv2.wav",
			"audio/goblin_voices/goblinv_mono/gv3.wav",
			"audio/goblin_voices/goblinv_mono/gv4.wav",
			"audio/goblin_voices/goblinv_mono/gv5.wav",
			"audio/goblin_voices/goblinv_mono/gv6.wav",
			"audio/goblin_voices/goblinv_mono/gv7.wav",
			"audio/goblin_voices/goblinv_mono/gv8.wav",
			"audio/goblin_voices/goblinv_mono/gv9.wav",
			"audio/goblin_voices/goblinv_mono/gv10.wav",
			"audio/goblin_voices/goblinv_mono/gv11.wav",
			"audio/goblin_voices/goblinv_mono/gv12.wav",
			"audio/goblin_voices/goblinv_mono/gv13.wav",
			"audio/goblin_voices/goblinv_mono/gv14.wav",
			"audio/Explosions/Explosion1.wav",
			"audio/Explosions/Explosion2.wav",
			"audio/Explosions/Explosion3.wav",
			"audio/odd_noises/item_pickup.wav"
		],
		'ogg-sounds': [
			// background sounds
			"audio/musical_dongxi/goblinTheme",
			"audio/musical_dongxi/rap_better",
			"audio/musical_dongxi/lighthearty"
		]
	});
};

$.subscribe('loaded-assets',function () {
	page('main');
	// console.log('Load Complete');
});