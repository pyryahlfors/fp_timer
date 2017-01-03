// custom event
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

fpAudio = {
	support: false,
	soundBanks : {},

	init: {},
	
	loadAudio: function(soundBank, sound, url, vol){
		var audio = new Audio();
		audio.src = url;
		audio.preload = "auto";
		audio.volume = vol;

		if(!fpAudio.soundBanks[soundBank]) {fpAudio.soundBanks[soundBank] = {};};
		fpAudio.soundBanks[soundBank][sound] = audio;

		audio.addEventListener("loadeddata", function(){
			fpAudio.soundBanks[soundBank][sound] = audio;
			fpAudio.soundBanks[soundBank][sound].channel = 0;
			fpAudio.soundBanks[soundBank][sound].channels = [];
			for( var i = 0; i <8; i++ ) {
				fpAudio.soundBanks[soundBank][sound].channels.push(audio.cloneNode(true) );
				};
			}, false);
		},
		
	playAudio: function(audioDetails){
		var soundBank = audioDetails.soundbank,
			sound = audioDetails.fx;
		if(!fpAudio.soundBanks[audioDetails.soundbank]) return;

		var channel = fpAudio.soundBanks[soundBank][sound].channel;
		channel+=1;
		if(channel >= 7) {channel = 0};
		fpAudio.soundBanks[soundBank][sound].channel = channel;
		fpAudio.soundBanks[soundBank][sound].channels[channel].pause();
		fpAudio.soundBanks[soundBank][sound].channels[channel].currentTime = 0;
		fpAudio.soundBanks[soundBank][sound].channels[channel].play();
		}
	};


(function(){
	var myAudio = document.createElement('audio'); 
    if (myAudio.canPlayType) {
		this.support = (function(){
			if(!!myAudio.canPlayType && "" != myAudio.canPlayType('audio/mpeg')){
				return 'mp3';
			}
			if(!!myAudio.canPlayType && "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"')){
				return 'ogg';
				}
		})();
		}
	}).call(fpAudio);

document.addEventListener('playsound', function(e){
	fpAudio.playAudio(e.detail);
	}, false);
	


(function(){
	"use strict" 

		
		fpAudio.loadAudio('timer', 'mouseup', 'sounds/cowbell.'+fpAudio.support, 1);
		fpAudio.loadAudio('timer', 'levelcleared', 'sounds/level_clear.'+fpAudio.support, 1);

/* Polar arc */
	(function(){
		var animate = true;
		var pixelRatio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

		var colorTable = [
			'rgba(255,255,255,.4)',
			'rgba(255,0,255,.8)',
			'rgba(0,255,255,.6)',
			'rgba(255,255,255,.8)',
			'rgba(255,214,25,1)'];

		var dataSet = new Array(0, 0);

		var canvas = document.createElement ( "CANVAS" ) ;
		canvas.width = pixelRatio*200;
		canvas.height = pixelRatio*200;

		canvas.style.width = "200px";
		canvas.style.height = "200px";
		
		document.querySelector('.timer-holder').appendChild(canvas);
		var ctx = canvas.getContext ( '2d' );
		
		canvas.x = canvas.width / 2; 
		canvas.y = canvas.height / 2; 

		// 100% equals 2 in canvas arc
		var max = 2 / 100 ;

		var a = 0;
		var b = 0;
		var c = 0;
		
		var timerStart = new Date().getTime() / 1000;
		var timerNow = timerStart;
		var timerLength = 10;
		var timerContainer = document.querySelector('.title');

		var draw = function(){
			ctx.clearRect(0,0,200*pixelRatio,200*pixelRatio);
			// White background
			ctx.beginPath();
			var radius = 60*pixelRatio;
			ctx.fillStyle  = "rgba(255,255,255,.1)";
			ctx.arc(canvas.x, canvas.y, radius, 0, 2*Math.PI, true);
			ctx.fill();

			radius = 75*pixelRatio;
			b= 25;

			for ( var i = 0, j = dataSet.length; i < j ; i ++ ) {
				a = dataSet [ i ];
				var startAngle = (2-(max*b)) * Math.PI;
				var endAngle = (2-(max*(b+a)))	 * Math.PI;
				var counterClockwise = true;
				ctx.beginPath();
				ctx.arc(canvas.x, canvas.y, radius, startAngle, endAngle, counterClockwise);
				ctx.lineWidth = 2;
				ctx.strokeStyle = colorTable[i] ; 
				ctx.stroke();
				b = b+a;
				}
			ctx.closePath();
			};
		draw();

		
		// Animate chart
		if(!animate) {return;}
		
		setInterval(function(){
			window.requestAnimationFrame( function () {
			timerNow = new Date().getTime() / 1000;
			// Reset timer
			if(timerNow-timerStart >= timerLength){
				timerStart = new Date().getTime() / 1000;
				timerNow = timerStart;
				var fxEvent = new CustomEvent("playsound", {detail: {soundbank: 'timer', fx: 'mouseup'}});
				document.dispatchEvent(fxEvent);
				}
				
			dataSet[0] = 100 - ((100/timerLength)*(timerNow-timerStart));
//			dataSet[1] = 100-dataSet[0];

//			c+=.01; b=c; 
			draw();
			timerContainer.innerHTML = (timerNow-timerStart).toFixed(1);

			})
			
			}, 30);
		})();
    })();