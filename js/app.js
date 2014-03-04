(function(window){

	function init(){
		FP.app.init();
	}

	window.FP = {
		init: init
	};

}(window)); // Self execute

FP.app = (function(window){

	var el_fullScreenImage = ".full-screen-image",				// Cover image element before the video is loaded
		el_fullScreenVideo = "#mainVideo",						// Background video element 
		el_fullScreenSection = ".full-screen-section",			// Page sections
		el_sectionContainer = ".wrapper",						// Main element we animate
		$window = $(window),									// Window element
		distanceScrolled = 0,									// The value is a multiple of 100, for example 100%, 200% etc
		scrollDirection = 1, 									// 1 down, -1 is up
		myPlayer,												// Video object
		mediaAspect = 16/9,										// Video aspect ratio of videos
		playlistCount = 0;										// Count to keep track of played videos in playlist
		ambientVideos = [];										// Ambient videos
		selectedVideos = [];									// Selected category videos

	function init(){
		$(el_fullScreenSection).each(function(){
			ambientVideos.push($(this).attr("data-video"));
		});

		adjustImagePositioning($(el_fullScreenImage));
		$(".section-intro").addClass("active");

		initVideo();
		playVideo("#intro");
		
		bindScrollButtons();
		bindWindowResize();
	}

	function initVideo(){
		videojs("mainVideo").ready(function(){
			myPlayer = this;
			myPlayer.loop(true);
			console.log(myPlayer);
		});
		updateSize(el_fullScreenVideo);
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
		$(".section-intro__title,.section-intro__desc,.section-intro hr").addClass("animated fadeOutUp");
		$('#section-intro__btn').addClass("animated fadeOutDown");		
	}

	function bindScrollButtons(){

		// Intro button
		$('#section-intro__btn').click(function(e){	
			var target = $(this).attr('href');
			
			resetSection();

			animatedIntroSection();
			setTimeout(function(){
				if(!Modernizr.touch){
					moveBGvideo(scrollDirection);
				}
				scrollToDiv(scrollDirection,target);
			},600);

			e.preventDefault();
		});		

		// Category buttons	
		$('.link-list a').click(function(e){
			$(this).addClass("active");
			var target = $(this).attr("href"),
				videoUrl = $(this).attr("data-video"),
				text = $(this).text();

			selectedVideos.push(videoUrl);
			console.log(selectedVideos);

			$(".subtitles").append("<li>"+text+"</li>");

			setTimeout(function(){
				if(!Modernizr.touch){
					moveBGvideo(scrollDirection);
				}
				scrollToDiv(scrollDirection,target);
			},200);

			e.preventDefault();
		});

		// Play video button
		$('.button--play').click(function(e){
			$(".full-screen-section.active .mega").addClass("animated fadeOutUp");
			$('.full-screen-section.active .button--play').addClass("animated fadeOut");
			
			initVideo();

			// Wait for the text to disapear before fading out background
			setTimeout(function(){ 
				$(el_fullScreenVideo).fadeOut(1200,function(){
					resetAmbientPlayer();

					// Create delay effect before we start playing the playlist
					setTimeout(function(){
						$(".full-screen-section").removeClass("active");
						$("#last").addClass("active");		
						loadPlaylist();
					},1000);					
				});
			},800);			
			e.preventDefault();
		});	

	}

	function scrollToDiv(direction, target){

		distanceScrolled = distanceScrolled - 100;

		$(el_sectionContainer).transition({ 
			y: distanceScrolled+'%',
			easing: 'easeInOutExpo',
			duration: 800
		},function(){
			$(".full-screen-section").removeClass("active");
			$(target).addClass("active");
			$(el_fullScreenVideo).css({"transform":"translate(0, 0)"});
			if(!Modernizr.touch){
				playVideo(target);
			}
			
		});
	}

	function moveBGvideo(direction){
		var move;
		if(direction === "-1"){
			move = "100%";
		} else {
			move = "-100%";
		}

		$(el_fullScreenVideo).transition({ 
			y: move,
			easing: 'easeInOutExpo',
			duration: 800
		});
	}

	function bindWindowResize(){
		$( window ).resize(function() {
			adjustImagePositioning($(el_fullScreenImage));
			updateSize(el_fullScreenVideo);
		});
	}

	function loadPlaylist(){
		$(".full-screen-section.active .mega").hide();
		$(el_fullScreenVideo).show();
		// scrollToDiv(scrollDirection,'#last');
		$("#mainVideo video").bind("ended", function() {
			if(playlistCount < selectedVideos.length){
				playPlaylist(playlistCount);
			} else {
				$(".subtitles,#mainVideo").fadeOut(1200,function(){
					$(".section-last img,.section-last hr").addClass("animated fadeInDown");
					$(".section-last p").addClass("animated fadeInUp");
				});
				console.log("ENDED");	
			}
		});			
		playPlaylist(playlistCount);
	}

	function playPlaylist(index){
		$(".subtitles li").hide();
		$(".subtitles li:eq("+index+")").show();
		myPlayer.src(selectedVideos[index]);		
		myPlayer.play();
		playlistCount++;
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
		moveBGvideo : moveBGvideo,
		scrollToDiv : scrollToDiv
	};

})(window);