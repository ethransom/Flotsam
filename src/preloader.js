/* Preloader module
 * Loads all of the other scripts and assets, and displays a pretty loading bar in the process
 *
*/

var Preloader = (function () {
	var toLoad = 0;
	var haveLoaded = 0;

	var assets = {};
	
	var loaders = {};
	
	// loading bar visual stuff
	var $loadBar;
	$(function () {
		$loadBar = $('<div></div>')
		$loadBar.width( 0 );
		
		$('<div></div>')
			.attr('id', 'load-wrapper')
			.append( $loadBar )
			.appendTo( $('#loading') );
			
	});
	
	var updateLoader = function () {
		var percent = (haveLoaded / toLoad);
		// update GUI with new info
 		$loadBar.width(
			percent * 300
		);
		
		if( percent >= 1 )
			$.publish('loaded-assets');
	}
	
	// called when an asset is loaded
	var callback = function () {
		haveLoaded++;
		updateLoader();
	}
	
	// load: adds assets to list, triggers loading
	// @param hash of arrays of strings of assets
	var load = function (list) {
		// each type of assets is loaded with a loader function 
		// begin the loading of the assets by calling the corresponding functions
		for( type in list ) {
			assets[type] = {};
			if( loaders[type] ) {
					// each asset type has many sub assets, load each one using loader function
					for( var i = 0; i < list[type].length; i++ ) {
						assets[type][ list[type][i] ] = loaders[type]( list[type][i], callback );
						toLoad++;
					}
			} else {
				throw new Error("No loader for type: " + type );
			}
		}
		
		updateLoader();
	};
	
	// def: defines a loader
	// @param: string name of loader
	// @param: loader function 
	var def = function (name, loader) {
		loaders[name] = loader;
	};
	
	// asset: fetches an asset value
	// @param: string name of asset type
	// @param: string name of asset
	var asset = function ( type, name ) {
		a = false;
		try {
			// attempt to fetch the image from cache
			a = assets[type][name];
			if( !a )
				throw "Asset not in cache!";
		} catch (e) {
			// try to load a fresh one, or just die
			if( !loaders[type] )
				throw new Error("No loader for type: " + type );
			a = loaders[type]( name, function () {} );
			console.log( e + ' Loaded fresh: ' + name );
		}
		return a;
	};
	
	// expose only public methods and vars
	return {
		'load': load,
		'def': def,
		'asset': asset,
	};
})();