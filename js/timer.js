// Disable overscroll / viewport moving on everything but scrollable divs
document.body.addEventListener('touchmove', function (e) {e.preventDefault();}, false);

var fpTimer = {
	colorTable: [
		'rgba(255,255,255,.5)',
		'rgba(0,0,0,.1)',
		'rgba(0,255,255,.6)',
		'rgba(255,255,255,.8)',
		'rgba(255,214,25,1)'],

	pixelRatio : (window.devicePixelRatio) ? window.devicePixelRatio : 1,

	timerLength :0,
	timerShelve : 0,
  countdown: true,
	timerDifference : 0,
	dataSet : [0, 100 ], // circles

	paused: false,

	init: function(){
		"use strict" ;

		var togglePortrait = function(){
			var aspectRatio = (document.documentElement.clientWidth / document.documentElement.clientHeight);
			if(aspectRatio > 1) {
				document.body.classList.add('landscape');
				}
			else {
				document.body.classList.remove('landscape');
				}

				var setTranslateCoords = function ( elem, xyz ) {
					var cssEngine = ( function ( ) {
						var navUA = navigator.userAgent.toLowerCase();
						if ( navUA.indexOf('webkit') != -1 ) { return 'webkit'; }
						else if ( navUA.indexOf('safari') != -1 ) { return 'webkit'; }
						else if ( navUA.indexOf('opera') != -1) { return 'O'; }
						else if ( navUA.indexOf ('msie') != -1 ) { return 'ms'; }		// < IE 11
						else if ( navUA.indexOf ('iemobile') != -1 ) { return 'ms'; } 	// IE 11
						else if ( navUA.indexOf ('trident') != -1 ) { return 'ms'; } 	// IE 11
						else if ( navUA.indexOf ('mozilla') != -1 ) { return 'Moz'; }
						else { return '';}
						} )( );
						elem.style[cssEngine+'Transform']= "translate3d("+xyz[0]+"px,"+xyz[1]+"px,0)";
					};
				// Re-position swipe elements
				var elems = document.querySelectorAll('INPUT.swipe-input');
				for(var i=0, j=elems.length; i<j;i++){
						var elemsLenght = elems[i].parentNode.querySelector('.select-dialog').querySelectorAll('DIV').length;
						var stepLength = elems[i].parentNode.querySelector('.select-dialog').getBoundingClientRect().height / elemsLenght;
						setTranslateCoords(elems[i].parentNode.querySelector('.select-dialog'), [ 0, -1*(elems[i].value*stepLength) ] );
				}
			};

		togglePortrait();

		window.addEventListener('resize', togglePortrait, false);

		// load sound effects
		fpAudio.loadAudio('timer', 'mouseup', 'sounds/cowbell.'+fpAudio.support, 1);

		// bind controls
		this.control();
	},

	control: function(){
		var createTable = [['hours', 24], ['minutes', 60], ['seconds', 60]];
		for(var i=0, j=createTable.length;i<j;i++){
			var container = document.querySelector('.'+createTable[i][0].toString()+' DIV.select-dialog');
			for(var k=0, l=createTable[i][1];k<l;k++){
				var timeContainer = document.createElement("DIV");
				timeContainer.appendChild(document.createTextNode((k < 10) ? '0'+k : k));
				container.appendChild(timeContainer);
			}
		}

		this.createCanvas();
		this.animate();

		var btnStart = document.querySelector('.start-timer');
		var btnStop = document.querySelector('.stop-timer');
		var btnPause = document.querySelector('.pause-timer');

// Play
		var playTimer = function(togglePause){
			clearInterval(this.timer);

			if(togglePause===true && !this.paused){
				this.paused = true;
				this.timerPauseStarted = new Date().getTime() / 1000;
				btnPause.classList.add('active');
				btnStart.classList.remove('active');
			}
			else {
				btnStart.classList.add('active');

				var timerSeconds = Number(document.querySelector('INPUT[name="duration-seconds"]').value);
				var timerMinutes = Number(document.querySelector('INPUT[name="duration-minutes"]').value);
				var timerHours = Number(document.querySelector('INPUT[name="duration-hours"]').value);

				this.timerLength = (timerHours*3600) + (timerMinutes * 60) + timerSeconds;
				if(!this.timerStart) {
					this.timerStart = new Date().getTime() / 1000;
				}

	// Apply time on pause to the timer start clock
				if(this.timerPauseStarted){
					this.timerDifference = (new Date().getTime() / 1000) - this.timerPauseStarted;
					btnPause.classList.remove('active');
					btnStart.classList.add('active');
					this.paused = false;
					delete this.timerPauseStarted;
					this.timerStart+=this.timerDifference;
				}
				this.timer = setInterval(this.animateInterval.bind(this),30);
			}
		}.bind(this);

	var testTouch = document.createElement("DIV");
	testTouch.setAttribute('ontouchstart', 'return;');
	var isTouchDevice = (typeof testTouch.ontouchstart === 'function' && window.screenX === 0) ? true : false;
	window.globalClickEvent = (isTouchDevice) ? 'touchend' : 'click';

// Start timer


	btnStart.addEventListener(window.globalClickEvent, playTimer.bind(this) ,false);
// Pause
	btnPause.addEventListener(window.globalClickEvent, function(){playTimer(true);}.bind(this), false);


// Stop
	btnStop.addEventListener(window.globalClickEvent, function(){
		clearInterval(this.timer);
		this.animate();
		btnStart.classList.remove('active');
		btnPause.classList.remove('active');
		setTimeout(function(){delete this.timerStart;}.bind(this), 30);
	}.bind(this) ,false);

},

	formatDate : function(params){
		if(!params.dateString) return;
		var dateString = new Date(params.dateString),
			dateFormat = (params.dateFormat) ? params.dateFormat : 'mm.dd.yyyy';

		var json = {
			dd : dateString.getDate(),
			yyyy : dateString.getFullYear(),
			mm : dateString.getMonth()+1,
			HH : ('0'+dateString.getHours()).substr(-2),
			MM : ('0'+dateString.getMinutes()).substr(-2),
			SS : ('0'+dateString.getSeconds()).substr(-2),
			MS : ('0'+dateString.getMilliseconds()).substr(-2)
			};

		for(var i in json) {
			var patt=new RegExp(i ,'gm');
			if(dateFormat.match(patt) !== null){
				dateFormat =    dateFormat.replace(patt, json[i]);
				}
			}
		return dateFormat;
	},

 	animateInterval : function(){
			window.requestAnimationFrame( function () {
				this.timerNow = new Date().getTime() / 1000;

				// Reset timer
				if(this.timerNow-this.timerStart >= this.timerLength){
					this.timerStart = new Date().getTime() / 1000;

					// Sound fx
					var fxEvent = new CustomEvent("playsound", {detail: {soundbank: 'timer', fx: 'mouseup'}});
     			document.dispatchEvent(fxEvent);
					}

				this.dataSet[0] = 100 - ((100/this.timerLength)*(this.timerNow-this.timerStart));
				this.dataSet[1] = 100-this.dataSet[0];
				this.animate();

				var counter = (this.timerNow-this.timerStart);
				var countercountdown = (this.timerLength - counter); // count down

				counter = this.formatDate({dateString: new Date().setHours(0,0,counter, counter % 1 * 100), dateFormat : 'HH:MM:SS;MS'});
				countercountdown  = this.formatDate({dateString: new Date().setHours(0,0,countercountdown, countercountdown % 1 * 100), dateFormat : 'HH:MM:SS:MS'});

				var timerContainer = document.querySelector('.title');
				timerContainer.innerHTML = "<span>" + countercountdown + "</span>";
				}.bind(this));
			},

		createCanvas: function(){
			"use strict";

			var canvas = document.createElement ( "CANVAS" );
			canvas.width = this.pixelRatio*320;
			canvas.height = this.pixelRatio*320;

			canvas.style.width = "320px";
			canvas.style.height = "320px";

			document.querySelector('.timer-holder').appendChild(canvas);
			this.ctx = canvas.getContext ( '2d' );

			canvas.x = canvas.width / 2;
			canvas.y = canvas.height / 2;

			this.canvas = canvas;
			},

		animate: function(){
			// 100% equals 2 in canvas arc
			var max = 2 / 100 ;

			var a = 0;
			var b = 0;
			var c = 0;

			this.ctx.clearRect(0,0,320*this.pixelRatio,320*this.pixelRatio);
			// White background
			this.ctx.beginPath();
			var radius = 140*this.pixelRatio;
			this.ctx.fillStyle  = "rgba(255,255,255,.1)";
			this.ctx.arc(this.canvas.x, this.canvas.y, radius, 0, 2*Math.PI, true);
			this.ctx.fill();

			radius = 158*this.pixelRatio;
			b = 25;

			for ( var i = 0, j = this.dataSet.length; i < j ; i ++ ) {
				a = this.dataSet [ i ];
				var startAngle = (2-(max*b)) * Math.PI;
				var endAngle = (2-(max*(b+a)))	 * Math.PI;
				var counterClockwise = true;
				this.ctx.beginPath();
				this.ctx.arc(this.canvas.x, this.canvas.y, radius, startAngle, endAngle, counterClockwise);
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = this.colorTable[i] ;
				this.ctx.stroke();
				b = b+a;
				}
			this.ctx.closePath();
		}
	};

fpTimer.init();

// Counters
(function(){
	var addButtons = document.querySelectorAll('BUTTON.counter');
	var counter = function(){
		var inputContainer = this.parentNode.querySelector('INPUT');
		var result = Number(inputContainer.value) + Number(this.getAttribute('data-count'));

		if(result < inputContainer.getAttribute('data-min')) {
			result = inputContainer.getAttribute('data-min');
			}

		inputContainer.value = result;
		};

	for(var i=0, j=addButtons.length; i<j;i++){
		addButtons[i].addEventListener('click', counter.bind(addButtons[i]), false);
		}
	})();

var swipeSelect = document.querySelectorAll('.select-dialog');

var stopKinetic = function(swipeData){
		var el = swipeData.el;
		var elData = el.getAttribute('data-input');

		var elemsLenght = el.querySelectorAll('DIV').length;
		var stepLength = el.getBoundingClientRect().height / elemsLenght;
		document.querySelector('INPUT[name='+elData+']').value= Math.round(Math.abs(swipeData.easeEndY) / stepLength);

		swipeData.easeEndY = -1*Math.round(Math.abs(swipeData.easeEndY) / stepLength)*stepLength;
		swipeData.el.style[swipeData.cssEngine+'Transition']= "all "+swipeData.timer+"ms";
		swipeData.setTranslateCoords( swipeData.el, [ swipeData.easeEndX, swipeData.easeEndY ] );
	};

for(var i=0, j=swipeSelect.length;i<j;i++){
	var swipe = (window.fp.swipe) ? fp.swipe : fpSwipe;
	swipe.init({
		elem : swipeSelect[i],
		y : true,
		x : false,
		swipeStart: function(){
				this.elem.parentNode.classList.add('on-swipe');
				},
		endSwipe: function(swipeEl){
				swipeEl.el.parentNode.classList.remove('on-swipe');
				stopKinetic(swipeEl);
		}.bind(swipeSelect[i]),
		treshold : 1
	});
}
