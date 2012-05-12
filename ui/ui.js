function load_level(level) {
	page('canvas');

	init(level);
}

$.subscribe('loaded-assets',function () {
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


	$('#play').click(function() {
		page('choose-level');
	});
	$('#credits').click(function() {
		page('credits');
	});
	$('button.back').click(function() {
		page('main');
	});

	InitSound();

});
