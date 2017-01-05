// Disable overscroll / viewport moving on everything but scrollable divs
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);

var fpTimer = {
    colorTable: [
        'rgba(255,255,255,.5)', 'rgba(0,0,0,.1)', 'rgba(0,255,255,.6)', 'rgba(255,255,255,.8)', 'rgba(255,214,25,1)'
    ],

    pixelRatio: (window.devicePixelRatio) ? window.devicePixelRatio : 1,

    timerLength: 0,
    timerShelve: 0,
    countdown: true,
    timerDifference: 0,
    repeat: false,
    dataSet: [
        0, 0
    ], // circles

    paused: false,
    assistant: 'speechSynthesis' in window,
    assistantNotifyInterval : [],

    init: function() {
        this.noSleep = new NoSleep();
        this.btnStart = document.querySelector('.start-timer');
        this.btnStop = document.querySelector('.stop-timer');
        this.btnPause = document.querySelector('.pause-timer');

        document.querySelector('INPUT[name="duration-seconds"]').value = 0;
        document.querySelector('INPUT[name="duration-minutes"]').value = 0;
        document.querySelector('INPUT[name="duration-hours"]').value = 0;


		var isMobile = (function() {
			var check = false;
			(function(a){
				if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
			})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		})();

        var togglePortrait = function() {
            var aspectRatio = (document.documentElement.clientWidth / document.documentElement.clientHeight);
            if (aspectRatio > 1) {
                document.body.classList.add('landscape');
            } else {
                document.body.classList.remove('landscape');
            }
			if(!isMobile){repositionElements();}
        };
		var repositionElements = function(){
			var setTranslateCoords = function(elem, xyz) {
				var cssEngine = (function() {
					var navUA = navigator.userAgent.toLowerCase();
					if (navUA.indexOf('webkit') != -1) {
						return 'webkit';
					} else if (navUA.indexOf('safari') != -1) {
						return 'webkit';
					} else if (navUA.indexOf('opera') != -1) {
						return 'O';
					} else if (navUA.indexOf('msie') != -1) {
						return 'ms';
					} else if (navUA.indexOf('iemobile') != -1) {
						return 'ms';
					} else if (navUA.indexOf('trident') != -1) {
						return 'ms';
					} else if (navUA.indexOf('mozilla') != -1) {
						return 'Moz';
					} else {
						return '';
					}
				})();
				elem.style[cssEngine + 'Transform'] = "translate3d(" + xyz[0] + "px," + xyz[1] + "px,0)";
			};
			// Re-position swipe elements
			var elems = document.querySelectorAll('INPUT.swipe-input');
			var tmp;
			for (var i = 0, j = elems.length; i < j; i++) {
				var elemParent = elems[i].parentNode.querySelector('.select-dialog');
				var elemsLenght = elemParent.querySelectorAll('DIV').length;
				var stepLength = elemParent.getBoundingClientRect().height / elemsLenght;
				setTranslateCoords(elemParent, [0, -1 * (elems[i].value * stepLength)]);
			}
		};

        togglePortrait();
		window.addEventListener("orientationchange", function(){
		setTimeout(repositionElements, 300);}, false);
        window.addEventListener('resize', togglePortrait, false);

        // load sound effects
        // fpAudio.loadAudio('timer', 'mouseup', 'sounds/cowbell.' + fpAudio.support, 1);

        // bind controls
        this.control();
    },

    control: function() {
        var createTable = [
            ['hours', 24],
            ['minutes', 60],
            ['seconds', 60]
        ];
        for (var i = 0, j = createTable.length; i < j; i++) {
            var container = document.querySelector('.' + createTable[i][0].toString() + ' DIV.select-dialog');
            for (var k = 0, l = createTable[i][1]; k < l; k++) {
                var timeContainer = document.createElement("DIV");
                timeContainer.appendChild(document.createTextNode((k < 10) ? '0' + k : k));
                container.appendChild(timeContainer);
            }
        }

        this.createCanvas();
        this.animate();

        // Play
        var playTimer = function(togglePause) {
            clearInterval(this.timer);
            delete this.timer;
            this.updateAssistantInterval();

            if (togglePause === true && !this.paused) {
                this.paused = true;
                this.timerPauseStarted = new Date().getTime() / 1000;
                this.btnPause.classList.add('active');
                this.btnStart.classList.remove('active');
            } else {
                this.btnStart.classList.add('active');

                var timerSeconds = Number(document.querySelector('INPUT[name="duration-seconds"]').value);
                var timerMinutes = Number(document.querySelector('INPUT[name="duration-minutes"]').value);
                var timerHours = Number(document.querySelector('INPUT[name="duration-hours"]').value);

                this.timerLength = (timerHours * 3600) + (timerMinutes * 60) + timerSeconds;
                if (!this.timerStart) {
                    this.timerStart = new Date().getTime() / 1000;
                }

                // Apply time on pause to the timer start clock
                if (this.timerPauseStarted) {
                    this.timerDifference = (new Date().getTime() / 1000) - this.timerPauseStarted;
                    this.btnPause.classList.remove('active');
                    this.btnStart.classList.add('active');
                    this.paused = false;
                    delete this.timerPauseStarted;
                    this.timerStart += this.timerDifference;
                }
                this.timer = setInterval(this.animateInterval.bind(this), 30);
            }
        }.bind(this);

        var testTouch = document.createElement("DIV");
        testTouch.setAttribute('ontouchstart', 'return;');
        var isTouchDevice = (typeof testTouch.ontouchstart === 'function' && window.screenX === 0) ? true : false;
        window.globalClickEvent = (isTouchDevice) ? 'touchend' : 'click';

        // Start timer

        this.btnStart.addEventListener(window.globalClickEvent, function() {
            playTimer();
            this.btnStart.blur();
            }.bind(this), false);
        // Pause
        this.btnPause.addEventListener(window.globalClickEvent, function() {
            playTimer(true);
            this.btnPause.blur();
        }.bind(this), false);

        // Stop
        this.btnStop.addEventListener(window.globalClickEvent, function() {
            this.stop();
            this.btnStop.blur();
        }.bind(this), false);

    },

    stop: function(){
        clearInterval(this.timer);
        delete this.timer;
        this.animate();
        this.btnStop.classList.remove('active');
        this.btnStart.classList.remove('active');
        this.btnPause.classList.remove('active');
        this.updateAssistantInterval();
        setTimeout(function() {
            delete this.timerStart;
        }.bind(this), 30);
    },

    formatDate: function(params) {
        if (!params.dateString)
            return;
        var dateString = new Date(params.dateString),
            dateFormat = (params.dateFormat) ? params.dateFormat : 'mm.dd.yyyy';

        var json = {
            dd: dateString.getDate(),
            yyyy: dateString.getFullYear(),
            mm: dateString.getMonth() + 1,
            HH: ('0' + dateString.getHours()).substr(-2),
            MM: ('0' + dateString.getMinutes()).substr(-2),
            SS: ('0' + dateString.getSeconds()).substr(-2),
            MS: ('0' + dateString.getMilliseconds()).substr(-2)
        };

        for (var i in json) {
            var patt = new RegExp(i, 'gm');
            if (dateFormat.match(patt) !== null) {
                dateFormat = dateFormat.replace(patt, json[i]);
            }
        }
        return dateFormat;
    },

    animateInterval: function() {
        window.requestAnimationFrame(function() {
            this.timerNow = new Date().getTime() / 1000;

            // Reset timer
            if (this.timerNow - this.timerStart >= this.timerLength) {

                this.timerStart = new Date().getTime() / 1000;


                // If speech API is not supported - play sound instead
                if(!this.assistant){
                    // Sound fx
                    var fxEvent = new CustomEvent("playsound", {
                        detail: {
                            soundbank: 'timer',
                            fx: 'mouseup'
                        }
                    });
                    document.dispatchEvent(fxEvent);
                    }
                if(!this.repeat){
                    this.stop();
                    this.speak('Time\'s up!');
                }
            }

            this.dataSet[0] = 100 - ((100 / this.timerLength) * (this.timerNow - this.timerStart));
            this.dataSet[1] = 100 - this.dataSet[0];
            this.animate();

            var counter = (this.timerNow - this.timerStart); // elapsed time
            var countercountdown = (this.timerLength - counter); // count down

/* Notify time left -> */
        if(this.assistantNotifyInterval && this.assistantNotifyInterval.length && countercountdown < this.assistantNotifyInterval[0]){
            var timeLeft = Math.floor((countercountdown) / 60)+1;
            this.speak(timeLeft+ ' minute'+((timeLeft !== 1) ? 's': '') + ' left');
            this.assistantNotifyInterval.splice(0,1);
            }
/* <-- Notify time left  */

            counter = this.formatDate({
                dateString: new Date().setHours(0, 0, counter, counter % 1 * 100),
                dateFormat: 'HH:MM:SS;MS'
            });
            countercountdown = this.formatDate({
                dateString: new Date().setHours(0, 0, countercountdown, countercountdown % 1 * 100),
                dateFormat: 'HH:MM:SS:MS'
            });

            var timerContainer = document.querySelector('.title');
            timerContainer.innerHTML = "<span>" + countercountdown + "</span>";
        }.bind(this));
    },

    createCanvas: function() {
        "use strict";

        var canvas = document.createElement("CANVAS");
        canvas.width = this.pixelRatio * 320;
        canvas.height = this.pixelRatio * 320;

        canvas.style.width = "320px";
        canvas.style.height = "320px";

        document.querySelector('.timer-holder').appendChild(canvas);
        this.ctx = canvas.getContext('2d');

        canvas.x = canvas.width / 2;
        canvas.y = canvas.height / 2;

        this.canvas = canvas;
    },

    animate: function() {
        // 100% equals 2 in canvas arc
        var max = 2 / 100;

        var a = 0;
        var b = 0;
        var c = 0;

        this.ctx.clearRect(0, 0, 320 * this.pixelRatio, 320 * this.pixelRatio);
        // White background
        this.ctx.beginPath();
        var radius = 140 * this.pixelRatio;
        this.ctx.fillStyle = "rgba(255,255,255,.1)";
        this.ctx.arc(this.canvas.x, this.canvas.y, radius, 0, 2 * Math.PI, true);
        this.ctx.fill();

        radius = 158 * this.pixelRatio;
        b = 25;

        for (var i = 0, j = this.dataSet.length; i < j; i++) {
            a = this.dataSet[i];
            var startAngle = (2 - (max * b)) * Math.PI;
            var endAngle = (2 - (max * (b + a))) * Math.PI;
            var counterClockwise = true;
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.x, this.canvas.y, radius, startAngle, endAngle, counterClockwise);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.colorTable[i];
            this.ctx.stroke();
            b = b + a;
        }
        this.ctx.closePath();
    },

    speak: function(text){
        if(!this.assistant){return;}
        this.noSleep.disable();
        window.speechSynthesis.cancel();
        var voices = window.speechSynthesis.getVoices();
        this.hal = new SpeechSynthesisUtterance();
        this.hal.text = text;
        this.hal.volume = 100;
        window.speechSynthesis.speak(this.hal);
        // When speech synthesis is finished, re-enable noSleep
        this.hal.addEventListener('end', function(event){
            this.noSleep.enable();
        }.bind(this), false);
    },

    updateAssistantInterval: function(){
        /* Update assistant notify interval */
        var timerSeconds = Number(document.querySelector('INPUT[name="duration-seconds"]').value);
        var timerMinutes = Number(document.querySelector('INPUT[name="duration-minutes"]').value);
        var timerHours = Number(document.querySelector('INPUT[name="duration-hours"]').value);

        var timerLength = (timerHours * 3600) + (timerMinutes * 60) + timerSeconds;
        var n = Math.floor(timerLength / 60);
        fpTimer.assistantNotifyInterval = Array.apply(null, new Array(n)).map(function(_,i) { return (i+1)*60;}).reverse();
        }
};

fpTimer.init();

// Counters
(function() {
    var addButtons = document.querySelectorAll('BUTTON.counter');
    var counter = function() {
        var inputContainer = this.parentNode.querySelector('INPUT');
        var result = Number(inputContainer.value) + Number(this.getAttribute('data-count'));

        if (result < inputContainer.getAttribute('data-min')) {
            result = inputContainer.getAttribute('data-min');
        }

        inputContainer.value = result;
    };

    for (var i = 0, j = addButtons.length; i < j; i++) {
        addButtons[i].addEventListener('click', counter.bind(addButtons[i]), false);
    }
})();

var swipeSelect = document.querySelectorAll('.select-dialog');

var stopKinetic = function(swipeData) {
    var el = swipeData.el;
    var elData = el.getAttribute('data-input');

    var elemsLenght = el.querySelectorAll('DIV').length;
    var stepLength = el.getBoundingClientRect().height / elemsLenght;
    document.querySelector('INPUT[name=' + elData + ']').value = Math.round(Math.abs(swipeData.easeEndY) / stepLength);

    swipeData.easeEndY = -1 * Math.round(Math.abs(swipeData.easeEndY) / stepLength) * stepLength;
    swipeData.el.style[swipeData.cssEngine + 'Transition'] = "all " + swipeData.timer + "ms";
    swipeData.setTranslateCoords(swipeData.el, [swipeData.easeEndX, swipeData.easeEndY]);
    if(fpTimer.assistant){
        var inputs = document.querySelectorAll('INPUT');
        var temp = '';
        for(var i=0, j=inputs.length; i<j;i++){
            var inputVal = inputs[i].value;
            var inputName = inputs[i].name.split('-')[1];
            temp+= (Number(inputVal) > 0 && i<inputs.length) ? Number(inputVal) + ' ' +((Number(inputVal) === 1) ? inputName.slice(0,-1) : inputName) + ((i < inputs.length-1) ? ', ' : '.') : '';
        }

        if(!fpTimer.timer){
            fpTimer.updateAssistantInterval();
            fpTimer.speak(temp);
        }
    }

};

for (var i = 0, j = swipeSelect.length; i < j; i++) {
    var swipe = fpSwipe;
    swipe.init({
        elem: swipeSelect[i],
        y: true,
        x: false,
        swipeStart: function() {
            this.elem.parentNode.classList.add('on-swipe');
        },
        endSwipe: function(swipeEl) {
            swipeEl.el.parentNode.classList.remove('on-swipe');
            stopKinetic(swipeEl);
        }.bind(swipeSelect[i]),
        treshold: 1
    });
}
