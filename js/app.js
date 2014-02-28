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
		scrollDirection = 1, // down, -1 is up
		$fullScreenImage = $(".full-screen-image"),
		fullScreenVideo = "#mainVideo",
		$sectionContainer = $(".body"),
		$window = $(window),
		myPlayer,
		mediaAspect = 16/9,
		selectedVideos = [],
		loader = new PxLoader();



	function init(){
		adjustImagePositioning($fullScreenImage);
		$(".section-intro").addClass("active");
		bindScrollButtons();
		bindWindowResize();
				loadComplete();
		loadProgressListener();
	}

	function addLoadResources(url,type){
		switch (type){
		case "video":
			loader.addVideo(url);
			break;
		case "image":
			loader.addImage(url);
			break;
		case "audio":
			loader.addSound(url);
			break;
		}
	}

	function loadProgressListener(){
		loader.addProgressListener(function(e) { 
		    console.log(e.completedCount + ' / ' + e.totalCount); 
		}); 
	}

	function loadComplete(){
		loader.addCompletionListener(function() { 
			console.log("LOADED");
			$(".loading-videos").hide();
			$(".button--play").css("visibility","visible");			
		}); 
	}

	function initVideo(){
		videojs("mainVideo").ready(function(){
			myPlayer = this;
			myPlayer.loop(false);
			console.log(myPlayer);
		});
		updateSize(fullScreenVideo);
	}

	function playVideo(target){
		var videoToPlay = $(target).attr("data-video");
		myPlayer.src(videoToPlay);
		if(!Modernizr.video){ // Only fadeout images if browser supports video element
			$(target).find(".full-screen-image").fadeOut();
		}
		myPlayer.play();
	}

	function resetSection(){
		if(!Modernizr.video){ // Only fadeout images if browser supports video element
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
	
		$('.link-list a').click(function(e){
			$(this).addClass("active");
			var target = $(this).attr("href"),
				videoUrl = $(this).attr("data-video"),
				text = $(this).text();

			selectedVideos.push(videoUrl);
			addLoadResources(videoUrl,"video");

			if(target === "#playPlaylist"){
				loader.start();
			}

			$(".subtitles").append("<li>"+text+"</li>");

			setTimeout(function(){
				if(!Modernizr.touch){
					moveBGvideo(scrollDirection);
				}
				scrollToDiv(scrollDirection,target);
			},200);

			e.preventDefault();
		});

		$('.button--play').click(function(e){
			// $(".full-screen-section.active .mega").addClass("animated fadeOutUp");
			$('.full-screen-section.active .button--play').addClass("animated fadeOut");
			initVideo();
			setTimeout(function(){
		
				// scrollToDiv(scrollDirection,'#last');
				$(".full-screen-section.active img").fadeOut(1200,function(){
					// resetAmbientPlayer();
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

		directionPosition = directionPosition - 100;

		$sectionContainer.transition({ 
			y: directionPosition+'%',
			easing: 'easeInOutExpo',
			duration: 800
		},function(){
			$(".full-screen-section").removeClass("active");
			$(target).addClass("active");
			$('#mainVideo').css({"transform":"translate(0, 0)"});
			if(!Modernizr.touch){
				// playVideo(target);
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

		$('#mainVideo').transition({ 
			y: move,
			easing: 'easeInOutExpo',
			duration: 800
		});
	}

	function bindWindowResize(){
		$( window ).resize(function() {
			adjustImagePositioning($fullScreenImage);
			// updateSize(fullScreenVideo);
		});
	}

	var count = 0;
	function loadPlaylist(){
		$(".full-screen-section.active .mega").hide();
		$("#mainVideo").show();
		scrollToDiv(scrollDirection,'#last');
		$("#mainVideo video").bind("ended", function() {
			if(count < selectedVideos.length){
				playPlaylist(count);
			} else {
				$(".subtitles,#mainVideo").fadeOut(1200,function(){
					$(".section-last img,.section-last hr").addClass("animated fadeInDown");
					$(".section-last p").addClass("animated fadeInUp");
				});
				console.log("ENDED");	
			}
		});			
		playPlaylist(count)
	}

	function playPlaylist(index){
		$(".subtitles li").hide();
		$(".subtitles li:eq("+index+")").show();
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
		moveBGvideo : moveBGvideo,
		scrollToDiv : scrollToDiv,
		addLoadResources : addLoadResources
	};

})(window);