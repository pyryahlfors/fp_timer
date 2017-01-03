(function() {
	if ( !window.console ) {
		window.console = {log: function() {}};
		}
	})();

// Initialize kiintopiste framework
(function(){
	var initialized = false;
	// If run from local machine use relative path instead of fixed
	var appRoot = ( location.hostname.indexOf('b-spot.mobi') === -1 ) ? '' : 'http://b-spot.mobi/';

	// FP path
	var fpPath = appRoot + 'js/fpfw/';
	var loadFpfw = document.createElement("script");
	loadFpfw.src = fpPath+'fp_fw.js'; // +'?disablecache='+Math.round(Math.random()*9999)
	loadFpfw.language = "javascript";
	document.getElementsByTagName("head")[0].appendChild(loadFpfw);

	loadFpfw.onreadystatechange= function() {
		if (this.readyState == 'complete' || this.readyState == 'loaded') {
			fpInit();
			}
		};

	// ie fallback
	loadFpfw.onload = function() { fpInit(); };

	var fpInit = function( ) {
	// Prevent double firing
		if(initialized) {
			return;
			}
		initialized = true;

		fp.path = fpPath; // Overwrite the default value
		fp.createBuild(
			{ path: fp.path, file: 'fp_poly.js', init: false, confirmLoad: 'typeof(fp.poly)', disableCache: true },						// Polyfills
			{ path: fp.path, file: 'fp_animate.js', init: false, confirmLoad: 'typeof(fpAnimate)', disableCache: true },		// Kiintopiste animate lib
			{ path: fp.path, file: 'fp_dom.js', init: false, confirmLoad: 'typeof(fpDOM)', disableCache: true },						// DOM element renderer
			{ path: fp.path, file: 'fp_localStorage.js', disableCache: true, confirmLoad : 'typeof(fpLS)' },							// Local Storage
			{ path: fp.path, file: 'fp_audio.js', disableCache: true, confirmLoad : 'typeof(fpAudio)' },									// Audio
			{ path: fp.path, file: 'fp_swipe.js', disableCache: true, confirmLoad : 'typeof(fp.swipe)' },									// Local Storage
			{ path: appRoot + 'js/', file: 'timer.js',confirmLoad : 'typeof(fpTimer)',  init: false, disableCache:true },
			{ path: appRoot + 'js/', file: 'fullscreen.js', disableCache:true },
			{
			// Everything is loaded - Initialize the application
				init: function( ) {
					var testTouch = document.createElement("DIV");
					testTouch.setAttribute('ontouchstart', 'return;');

					var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
					window.globalClickEvent = 'click'; // (isTouchDevice) ? 'click' : 'click';
					window.globalMouseDown = (isTouchDevice) ? 'touchstart' : 'mousedown';
					window.globalMouseUp = (isTouchDevice) ? 'touchend' : 'mouseup';
					window.globalMouseMove = (isTouchDevice) ? 'touchmove' : 'mousemove';
					window.globalTouchClick = (isTouchDevice) ? 'touchend' : 'click';
					}
			});
		};
	})();
