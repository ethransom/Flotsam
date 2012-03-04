function load_level(level) {
	page('canvas');

	init(level);
}
var $page = null;

var pages = {
	'choose-level': '#level-select',
	'main': '#main-menu',
	'credits': '#credits-list',
	'canvas': '#canvas',
	'tut': '#tutorial'
};
function page(name) {
	$($page).hide().children().appendTo('body').hide();
	
	if(name=="credits") {
		PlayBackgroundSound('rap');
	}
	
	if(name=="main") {
		PlayBackgroundSound('light');
	}
	
	if(name=="canvas") {
		PlayBackgroundSound('song');
	}

	if (name) {
		$($page).append(	$(pages[name]).fadeIn('fast')	).fadeIn('fast');
		return;
	} 
}

window.onload = function() {


	for(key in levels) {
		var i = new Image();
		i.src = "art/menu_art/thumbnails/"+levels[key].thumb;
		$('#level-select .list').append(
			$('<a data-level="'+levels[key].map+'"><span class="name">'+levels[key].name+'</span></a>' ).append(i).append('<span class="score">Rank: '+levels[key].rank+'</span>')
		);
	}
	
	$('#level-select .list a').click(function (e) {
		load_level( $(this).data('level') );
		e.preventDefault();
	});


	
	$('.page').hide();
	$page = $('<div id="page"></div>').width( $(document).width() ).height( $(document).height() ).hide();
	$page.appendTo('body');
	$(document).resize(function() {
		$page.width( $(document).width() ).height( $(document).height() );
	});
	

	page('main');
	
	
	
	
	$('#play').click(function() {
		page();
		page('choose-level');
	});
	$('#credits').click(function() {
		page();
		page('credits');
	});
	$('button.back').click(function() {
		page();
		page('main');
	});
	
	InitSound();
};