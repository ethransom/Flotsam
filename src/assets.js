/* 
 * Load the assets using Fetch
*/

function getExtension( url ) {
	console.log('Loading ' + (Modernizr.audio.ogg != "") ? '.ogg' : '.wav' + 'sounds');
	if( Modernizr.audio.ogg != "" ) {
		return '.ogg';
	} else {
		return '.wav';
	}
}

Fetch.loader('sound', function ( url, callback ) {
	function loaded() {
		// For some reason, if we don't remove the handler, the callback gets called twice in Firefox
		this.removeEventListener('canplaythrough', loaded, false);
		callback();
	}

	var a = new Audio();
	a.src = url;
	a.addEventListener('canplaythrough', loaded, false);
	return a;
});


// Currently, the only diff between the loaders is the ogg support, fix?
Fetch.loader('ogg-sound', function ( url, callback ) {
	function loaded() {
		// For some reason, if we don't remove the handler, the callback gets called twice in Firefox
		this.removeEventListener('canplaythrough', loaded, false);
		callback();
	}

	var a = new Audio();
	a.src = url + getExtension( url );
	a.addEventListener('canplaythrough', loaded , false);
	return a;
});

window.onload = function () {
	Fetch.load({
		'image': [
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
		'script': [
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
		'sound': [
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
		'ogg-sound': [
			// background sounds
			"audio/musical_dongxi/goblinTheme",
			"audio/musical_dongxi/rap_better",
			"audio/musical_dongxi/lighthearty"
		]
	});
};

var $loadBar;
$(function () {
	$loadBar = $('<div></div>')
	$loadBar.width( 0 );
	
	$('<div></div>')
		.attr('id', 'load-wrapper')
		.append( $loadBar )
		.appendTo( $('#loading') );
		
});
Fetch.on('update',function ( percent ) {
	$loadBar.width( percent * 300 );
});

Fetch.on('done',function () {
	$.publish('loaded-assets');
});
	
$.subscribe('loaded-assets',function () {
	page('main');
	// console.log('Load Complete');
});