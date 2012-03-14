var $page = null;

var pages = {
	'choose-level': '#level-select',
	'main': '#main-menu',
	'credits': '#credits-list',
	'canvas': '#canvas',
	'tut': '#tutorial',
	'loading': '#loading'
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

$(function () {
	$('.page').hide();
	$page = $('<div id="page"></div>').width( $(document).width() ).height( $(document).height() ).hide();
	$page.appendTo('body');
	$(document).resize(function() {
		$page.width( $(document).width() ).height( $(document).height() );
	});
	
	// load default page
	page('loading');
});