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
		// BV = new $.BigVideo({
		// 	controls: false,
		// 	doLoop: false				
		// }),
		mediaAspect = 16/9;

	function init(){

		// Create the loader and queue our 3 images. Images will not 
		// begin downloading until we tell the loader to start. 
		var loader = new PxLoader(), 
		    vid1 = loader.addVideo('vids/baseball.mp4'), 
		    vid2 = loader.addVideo('vids/flipflops.mp4'), 
		    vid3 = loader.addVideo('vids/surfsunset.mp4'),
		    vid4 = loader.addVideo('vids/tapas.mp4'), 
		    vid5 = loader.addVideo('vids/surf.mp4'); 

			// callback that runs every time an image loads 
			loader.addProgressListener(function(e) { 
			     // the event provides stats on the number of completed items 
			    console.log(e.completedCount + ' / ' + e.totalCount); 
			}); 

		// callback that will be run once images are ready 
		loader.addCompletionListener(function() { 
			console.log("LOADED");
			initVideo();
			playVideo("#intro");
			bindScrollButtons();	
		}); 
		 
		// begin downloading images 
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
		// BV.show(videoToPlay,{
		// 	ambient:true
		// });
		$(target).find(".full-screen-image").fadeOut();
		myPlayer.play();
	}

	function resetSection(){
		$(".full-screen-section:not(.active)").find(".full-screen-image").show();
		$(".full-screen-section").removeClass("active");	
	}

	function bindScrollButtons(){
		$('.innerLink').click(function(e){		
			var direction = $(this).attr("data-direction");
				href = $(this).attr('href');
			
			resetSection();

			if((href === "#one" && direction === "1") || (href === "#intro")){
				if(href === "#one"){
					$("#intro h1.mega").addClass("animated fadeOutUp");
					$('#btn-intro i').addClass("animated fadeOutDown");
					setTimeout(function(){
						scrollToDiv(direction,href);
					},600);
				} else {
					console.log("up");
					$("#intro h1.mega").removeClass("animated fadeOutUp");
					$('#btn-intro i').removeClass("animated fadeOutDown");		
					scrollToDiv(direction,href);			
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
			// BV.remove();
			// yacine = new $.BigVideo({
			// 	controls: false,
			// 	doLoop: false				
			// });

			// yacine.init();

			// yacine.show(videoPlaylist,{
			// 	ambient: false
			// });

			e.preventDefault();
		});	

	}

	function bindWindowResize(){
		$( window ).resize(function() {
			adjustImagePositioning($fullScreenImage);
			updateSize(fullScreenVideo);
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