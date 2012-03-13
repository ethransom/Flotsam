
var gSoundOn = true;

var SOUND_FIRE_SELECT = 'fire';
var SOUND_PICKUP_SELECT = 'pickup';
var SOUND_HIT_HERO_SELECT = 'hitHero';
var SOUND_HIT_ENEMY_SELECT = 'hitHero';
var SOUND_DIE_SELECT = 'hitHero';

var BG_SOUND_SONG = 'song';

var sounds = {
	'fire': [
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
	],
	'hitHero': [
		"audio/Explosions/Explosion1.wav",
		"audio/Explosions/Explosion2.wav",
		"audio/Explosions/Explosion3.wav"
	],
	'pickup': [
		"audio/odd_noises/item_pickup.wav"
	]
};

var bgSounds = {
	'song': "audio/musical_dongxi/goblinTheme.wav",
	'rap': "audio/musical_dongxi/rap_better.wav",
	'light': "audio/musical_dongxi/lighthearty.wav"
};

var gHitSoundPlaying = false;
function InitSound()
{

	for (var key in sounds) {
		for( var i = 0; i<sounds[key].length; i++) {
			var s = sounds[key][i];
			var a = Preloader.asset('sounds',s);
			
			if(key=='fire') {
				a.volume = .9;
				a.addEventListener('ended', function(){
					gHitSoundPlaying = false;
				});
			} else {
				a.volume = .3;
			}
			
			sounds[key][i] = a;
		}
	}
	
}

//	Play sound.
//	todo:  preload some/all of these?
//	todo:  don't keep creating new objects.  reuse old objects.
//	todo:  avoid playing same sound again quickly if already playing, but allow some overlap.
//  todo:  when we use a "select" name above, automatically select from a list

function PlaySound(soundID)
{

	if (!gSoundOn)
		return;
	if(!sounds[soundID])
		return;
		
	if(soundID==SOUND_FIRE_SELECT) {
		if(gHitSoundPlaying) return false;
		gHitSoundPlaying = true;
	}
		
	var soundPossibles = sounds[soundID];
	soundPossibles[Math.floor(Math.random()*soundPossibles.length)].play();

}

function InitBGSounds() {
	
	for (var key in bgSounds) {
		var s = bgSounds[key];
		bgSounds[key] = Preloader.asset('sounds',s);
		bgSounds[key].loop = true;
 		bgSounds[key].addEventListener('ended', function(){
			this.currentTime = 0;
		}, false); 
	}
}

InitBGSounds();

function PlayBackgroundSound(id) {
 	for (var key in bgSounds) {
		console.log( key );
		bgSounds[key].pause();
		bgSounds[key].currentTime = 0;
	} 
	console.log(bgSounds[id]);
	bgSounds[id].play();
}