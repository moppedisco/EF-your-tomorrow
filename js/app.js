(function(window){

	function init(){
		var appView = new YOUR_TMR.AppView();
	}

	window.YOUR_TMR = {
		init: init
	};

}(window)); // Self execute

YOUR_TMR.AppView = Backbone.View.extend({
	el: $('.body'),
	isLoaded: true,
	isAnimating: false,
	currentPosition: 0,
	initialize: function () {
		// _.bindAll(this, 'render', 'addToPlaylist');
		this.model = new YOUR_TMR.AppViewModel;
		console.log(this.model);
		// console.log(this.model);
		this.render();
	},
	events: function () {
		var _this = this;
		this.$el.find("#section-intro__btn").on('click',function(){
			_this.addToPlaylist();
			//YOUR_TMR.AppView.prototype.addToPlaylist("urban");
		});
	},	
	render: function () {
		this.introView = new YOUR_TMR.IntroView({
			el : ".section-intro"
		});

		this.categoryView1 = new YOUR_TMR.CategoryView({
			el : "#one",
			model : new YOUR_TMR.CategoryModel
		});
		this.categoryView2 = new YOUR_TMR.CategoryView({
			el : "#two",
			model : new YOUR_TMR.CategoryModel
		});
		this.categoryView3 = new YOUR_TMR.CategoryView({
			el : "#three",
			model : new YOUR_TMR.CategoryModel
		});
		this.categoryView4 = new YOUR_TMR.CategoryView({
			el : "#four",
			model : new YOUR_TMR.CategoryModel
		});
		this.categoryView5 = new YOUR_TMR.CategoryView({
			el : "#five",
			model : new YOUR_TMR.CategoryModel
		});

		if(this.isLoaded){
			//this.appViewModel = new YOUR_TMR.AppViewModel;
			//console.log(this.appViewModel);
		}

	},
	addToPlaylist: function(){
		console.log(this.model);
		console.log("asdasdasda");
		// var playlist = this.model.playlist;
		// playlist[0] = pelle;
		// playlist[1] = 'belarbi';
		
		// this.model.set("playlist",playlist)
		// YOUR_TMR.AppViewModel.set('isAnimating',true);		
	},
	nextSection: function(element){
		console.log("scroll bitches");
		$el.transition({ 
			y: currentPosition+'%',
			easing: 'easeInOutExpo',
			duration: 800
		},function(){
			$(".full-screen-section").removeClass("active");
			$(target).addClass("active");
			$('#mainVideo').css({"transform":"translate(0, 0)"});
			playVideo(target);
		});		
	}
});

YOUR_TMR.IntroView = Backbone.View.extend({
	initialize: function () {
		this.loadVideos();
		this.render();
	},
	events: function () {
		var that = this;
		this.$el.find("#section-intro__btn").on('click',function(e){
			//YOUR_TMR.AppView.prototype.nextSection(that.el);
			// console.log(that);
			//e.preventDefault();
		});
	},	
	loadVideos: function(){
		return this.isLoaded = true;
	},
	hideLoader: function(){

	},
	render: function(){
		this.$el.html();
		return this;
	}
});

YOUR_TMR.CategoryView = Backbone.View.extend({
	initialize: function (options) {
		//console.log(this.model);
		this.model
			.set("videoBgUrl",this.el.dataset.video)
			.set("isActive",false);

		this.render();
	},
	events: function () {
		var _this = this;
		this.$el.find(".link-list a").on('click',function(){
			//console.log(_this.model);
			YOUR_TMR.AppView.prototype.addToPlaylist("urban");
		});
	},
	addCategoryItem: function(){
		//console.log(this.model.attributes.videoBGUrl);
		//var playlist = YOUR_TMR.AppViewModel.prototype.playlist;

	},
	render: function(){
		this.$el.html();
		return this;
	}
});

YOUR_TMR.AppViewModel = Backbone.Model.extend({
	defaults: {
		ready: false,
		playlist: [],
	},
	initialize: function(){
		//console.log("hea");
	}
});

YOUR_TMR.CategoryModel = Backbone.Model.extend({
	defaults: {
		index:"",
		videoBgUrl: "",
		isActive: false,
	},
	initialize: function(){
		//console.log(this.cid);
		//console.log('CategoryModel has been initialized.');
	}
});


/*FP.app = (function(window){

	var directionPosition = 0,
		scrollDirection = 1, // down, -1 is up
		$fullScreenImage = $(".full-screen-image"),
		fullScreenVideo = "#mainVideo",
		$sectionContainer = $(".body"),
		$window = $(window),
		myPlayer,
		mediaAspect = 16/9,
		selectedVideos = ["vids/tapas.mp4","vids/flipflops.mp4","vids/baseball.mp4"];

	function init(){

		var loader = new PxLoader(), 
			vid1 = loader.addVideo('vids/baseball.mp4'), 
			vid2 = loader.addVideo('vids/flipflops.mp4'), 
			vid3 = loader.addVideo('vids/surfsunset.mp4'),
			vid4 = loader.addVideo('vids/tapas.mp4'), 
			vid5 = loader.addVideo('vids/surf.mp4'); 

			// callback that runs every time a video loads 
			loader.addProgressListener(function(e) { 
				 // the event provides stats on the number of completed items 
				console.log(e.completedCount + ' / ' + e.totalCount); 
				$(".section-intro__loadbar").text("Loading video " + e.completedCount + " of 5");
			}); 

		// callback that will be run once video are ready 
		loader.addCompletionListener(function() { 
			console.log("LOADED");

			$(".section-intro").addClass("active");
			initVideo();
			playVideo("#intro");

			bindScrollButtons();	
			bindWindowResize();

		}); 

		adjustImagePositioning($fullScreenImage);
		loader.start(); 
	}

	function initVideo(){

		videojs("mainVideo").ready(function(){
			myPlayer = this;
			myPlayer.loop(true);
			console.log(myPlayer);
		});

		updateSize(fullScreenVideo);

	}


	function playVideo(target){
		var videoToPlay = $(target).attr("data-video");
		myPlayer.src(videoToPlay);
		if(Modernizr.video){ // Only fadeout images if browser supports video element
			$(target).find(".full-screen-image").fadeOut();
		}
		myPlayer.play();
	}

	function resetSection(){
		if(Modernizr.video){ // Only fadeout images if browser supports video element
			$(".full-screen-section:not(.active)").find(".full-screen-image").show();
		}
	}

	function animatedIntroSection(){
		$(".section-intro__title,.section-intro__desc").addClass("animated fadeOutUp");
		$('#section-intro__btn').addClass("animated fadeOutDown");		
	}

	function bindScrollButtons(){

		// Intro button
		$('#section-intro__btn').click(function(e){		
			var target = $(this).attr('href');
			
			resetSection();

			animatedIntroSection();
			setTimeout(function(){
				moveBGvideo(scrollDirection);
				scrollToDiv(scrollDirection,target);
			},600);

			e.preventDefault();
		});		
	
		$('.link-list a').click(function(e){
			$(this).addClass("active");
			var target = $(this).attr("href");

			setTimeout(function(){
				moveBGvideo(scrollDirection);
				scrollToDiv(scrollDirection,target);
			},200);

			e.preventDefault();
		});

		$('.button--play').click(function(e){
			$(".full-screen-section.active .mega").addClass("animated fadeOutUp");
			$('.full-screen-section.active .button--play').addClass("animated fadeOutDown");

			setTimeout(function(){
				$(".full-screen-section").removeClass("active");
				$("#last").addClass("active");				
				scrollToDiv(scrollDirection,'#last');
				$("#mainVideo").fadeOut(1500,function(){
					resetAmbientPlayer();
					setTimeout(function(){
						loadPlaylist();
					},1000);					
				});
			},1200);			
			e.preventDefault();
		});	

	}

	function scrollToDiv(direction, target){

		directionPosition = directionPosition - 100;

		$sectionContainer.transition({ 
			y: directionPosition+'%',
			easing: 'easeInOutExpo',
			duration: 800
		},function(){
			$(".full-screen-section").removeClass("active");
			$(target).addClass("active");
			$('#mainVideo').css({"transform":"translate(0, 0)"});
			playVideo(target);
		});
	}

	function moveBGvideo(direction){
		var move;
		if(direction === "-1"){
			move = "100%";
		} else {
			move = "-100%";
		}

		$('#mainVideo').transition({ 
			y: move,
			easing: 'easeInOutExpo',
			duration: 800
		});
	}

	function bindWindowResize(){
		$( window ).resize(function() {
			adjustImagePositioning($fullScreenImage);
			updateSize(fullScreenVideo);
		});
	}

	var count = 0;
	function loadPlaylist(){
		$("#mainVideo").show();
		$("#mainVideo video").bind("ended", function() {
			if(count < selectedVideos.length){
				playPlaylist(count);
			} else {
				console.log("ENDED");	
				$(".section-last h1").addClass("animated fadeInDown");
				$(".section-last h2").addClass("animated fadeInUp");

			}
		});			
		playPlaylist(count)
	}

	function playPlaylist(index){
		myPlayer.src(selectedVideos[index]);		
		myPlayer.play();
		count++;
	}

	function resetAmbientPlayer(){
		myPlayer.loop(false);
		myPlayer.src('');
	}



	function adjustImagePositioning(element) {
		element.each(function(){
			var $img = $(this),
				img = new Image();
	 
			img.src = $img.attr('src');
	 
			var windowWidth = $window.width(),
				windowHeight = $window.height(),
				r_w = windowHeight / windowWidth,
				i_w = img.width,
				i_h = img.height,
				r_i = i_h / i_w,
				new_w, new_h, new_left, new_top;
	 
			if( r_w > r_i ) {
				new_h   = windowHeight;
				new_w   = windowHeight / r_i;
			}
			else {
				new_h   = windowWidth * r_i;
				new_w   = windowWidth;
			}
	 
			$img.css({
				width   : new_w,
				height  : new_h,
				left    : ( windowWidth - new_w ) / 2,
				top     : ( windowHeight - new_h ) / 2
			})
	 
		});
	 
	}

	function updateSize(element) {
		var windowW = $(window).width();
		var windowH = $(window).height();
		var windowAspect = windowW/windowH;
		if (windowAspect < mediaAspect) {
			// taller
			myPlayer
				.width(windowH*mediaAspect)
				.height(windowH);
			$(element)
				.css('top',0)
				.css('left',-(windowH*mediaAspect-windowW)/2)
				.css('height',windowH);
			$(element+'_html5_api').css('width',windowH*mediaAspect);
			$(element+'_flash_api')
				.css('width',windowH*mediaAspect)
				.css('height',windowH);
		} else {
			// wider
			myPlayer
				.width(windowW)
				.height(windowW/mediaAspect);
			$(element)
				.css('top',-(windowW/mediaAspect-windowH)/2)
				.css('left',0)
				.css('height',windowW/mediaAspect);
			$(element+'_html5_api').css('width','100%');
			$(element+'_flash_api')
				.css('width',windowW)
				.css('height',windowW/mediaAspect);
		}
	}

	return {
		init : init,
		moveBGvideo : moveBGvideo
	};

})(window);*/