(function(window){

	function init(){
		FP.app.init();
	}

	window.FP = {
		init: init
	};

}(window)); // Self execute

FP.app = (function(window){

	var directionPosition = 0,
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
		}); 

		loader.start(); 
		adjustImagePositioning($fullScreenImage);
		bindWindowResize();

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
		//$(".full-screen-section").removeClass("active");	
	}

	function animatedIntroSection(){
		$(".section-intro__title,.section-intro__desc").addClass("animated fadeOutUp");
		$('#section-intro__btn').addClass("animated fadeOutDown");		
	}

	function bindScrollButtons(){
		$('.innerLink').click(function(e){		
			var direction = $(this).attr("data-direction");
				href = $(this).attr('href');
			
			resetSection();

			if((href === "#one" && direction === "1") || (href === "#intro")){
				if(href === "#one"){
					animatedIntroSection();
					setTimeout(function(){
						scrollToDiv(direction,href);
					},600);
				}
			} else {
				scrollToDiv(direction,href);
			}
			e.preventDefault();
		});		
	
		$('.link-list a').click(function(e){
			$(this).addClass("active");
			var href = $(this).attr("href");
			setTimeout(function(){
				scrollToDiv("1",href);
			},200);

			e.preventDefault();
		});

		$('.button--play').click(function(e){
			$(".full-screen-section.active .mega").addClass("animated fadeOutUp");
			$('.full-screen-section.active .button--play').addClass("animated fadeOutDown");
			setTimeout(function(){
				$("#mainVideo").fadeOut(800,function(){
					console.log("asdasd");
					resetAmbientPlayer();
					loadPlaylist();
				});
			},1200);			
			e.preventDefault();
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

	function scrollToDiv(direction,target){
		if(direction === "1"){
			directionPosition = directionPosition - 100;
		} else {
			directionPosition = directionPosition + 100;
		}

		moveBGvideo(direction);

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

})(window);