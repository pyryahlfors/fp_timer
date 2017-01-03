(function(){
	"use strict";

	/* Parallax */
		var parallaxElem = document.querySelector('.tilt-container');

		var tilt = function(LR, FB, dir){
			var r = Math.round(128+LR);
			var g = Math.round(128+FB);
			var b = Math.round(dir);

			document.body.style.background = "rgb("+r+","+g+","+b+")";
		};

		var lastExecution = 0;
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', function(eventData) {
				var now = Date.now();
				if (now - lastExecution < 100) return; // 17 = ~60Hz
				lastExecution = now;

				var tiltLR = -1*eventData.gamma;		// left to right
				var tiltFB = -1*eventData.beta;			// front to back
				var dir = eventData.alpha;					// Compass orientation
				tilt(tiltLR, tiltFB, dir);
				}, false);
			}
	})();
