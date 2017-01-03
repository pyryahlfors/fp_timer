var fpAnimate = {
	init: function(){
	},

	watch: function( params ){
		if (!params.el) {return;}
		if (!params.execute) {params.execute = function(){};}
		if (!params.listen) {params.listen = function(){};}
		if( !params.iterate ) {params.iterate = function(){};}

// Animation start - listen
		var listen = function(){
			params.listen();
			};

		if(params.unwatch) {
			listen = function(){
				params.listen();
				params.el.removeEventListener("animationstart", listen);
				params.el.removeEventListener("webkitAnimationStart", listen);
				};
			}

// Animation iterate
		var iterate = function(){
			params.iterate();
			};

		if(params.unwatch) {
			iterate = function(){
				params.iterate();
				params.el.removeEventListener("animationiteration", iterate);
				params.el.removeEventListener("webkitAnimationIteration", iterate);
				};
			}

// Execute
		var execute = function(){
			params.execute();
			};

		if(params.unwatch) {
			execute = function(){
				params.execute();
				params.el.removeEventListener("animationend", execute);
				params.el.removeEventListener("webkitAnimationEnd", execute);
				};
			}


		params.el.addEventListener("animationstart", listen, false);
		params.el.addEventListener("animationend", execute, false);
		params.el.addEventListener("animationiteration", iterate, false);

		params.el.addEventListener("webkitAnimationStart", listen, false);
		params.el.addEventListener("webkitAnimationEnd", execute, false);
		params.el.addEventListener("webkitAnimationIteration", iterate, false);
	}
};
