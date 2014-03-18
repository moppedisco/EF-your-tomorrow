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
		$mainAudio = $("#mainAudio"),
		myAudioPlayer,
		distanceScrolled = 0,									// The value is a multiple of 100, for example 100%, 200% etc
		scrollDirection = 1, 									// 1 down, -1 is up
		myPlayer,												// Video player object
		playlistCount = 0,										// Count to keep track of played videos in playlist
		ambients = [],											// Ambient videos
		selectedVideos = [];									// Selected category videos

	// $.cssEase['custom-ease'] = 'cubic-bezier(0.680,0,0.265,1)';
	$.cssEase['custom-ease'] = 'cubic-bezier(1,0,0,1)';

	function init(){

		FP.helpers.adjustImagePositioning($(el_fullScreenImage));

		if(!Modernizr.touch){
			downloadAmbients();
			animateIntro();

			initVideo();
			playVideo("#start");

			bindScrollButtons();
			FP.helpers.bindWindowResize(el_fullScreenImage,el_fullScreenVideo);		

		} else {
			animateIntro();
			bindScrollButtons();
			FP.helpers.bindWindowResize(el_fullScreenImage,el_fullScreenVideo);		
		}
	}

	function animateIntro(){
		console.log("init")
		$(".section-loading").addClass("active");

		$("#intromessage li:eq(0)").fadeIn();
		setTimeout(function(){
			$("#intromessage li:eq(0)").fadeOut(function(){
				$("#intromessage li:eq(1)").fadeIn(function(){
					setTimeout(function(){
						$("#intromessage li:eq(1)").fadeOut(function(){
							console.log("jump to start section");	
							animateStart();
						});
					},2000);
				});
			})
		},3000);
	}

	function animateStart(){
		$(".article-start__title,.article-start__line").addClass("animated fadeInDown");
		$(".article-loading").fadeOut(function(){
			setTimeout(function(){
				$(".article-start__desc,.article-start__btn").addClass("animated fadeIn");
			},1500);			
		});
	}

	function resolveAmbients (resolve) {
		var loader = new PxLoader(),
			resource;

		$(".full-screen-section").each(function(i){
			var videoUrl = $(this).attr("data-video");
		
			if(videoUrl){
				ambients.push(videoUrl);
				resource = new PxLoaderVideo(videoUrl);
				resource.__id__ = i + 1;
				loader.add(resource);		
			}
		});

		loader.addProgressListener(function (e) {
			console.log('Ambient ' + e.resource.__id__ + ' downloaded');
		});

		loader.addCompletionListener(function () {
			console.log('All the ambients are downloaded. Resolve promise');
			resolve(); // all the ambient videos have been downloaded
		});

		loader.start();

	}

	function initFirstFrame(){
		return new Promise(resolveFirstFrame);
	}

	function downloadAmbients () {
		return new Promise(resolveAmbients);
	}

	function downloadVideos () {
		return Promise.all(queueVideoPromises);
	}

	function doFinalStage () {
		console.log('We have all the videos ready to show. Play list');
	}

	function initVideo(){
		console.log(Modernizr.video)
		videojs("mainVideo").ready(function(){
			myPlayer = this;
			myPlayer.loop(true);
			console.log(myPlayer);
		});	

		FP.helpers.adjustVideoPositioning(el_fullScreenVideo);
	}

	function playVideo(target){
		var videoToPlay = $(target).attr("data-video");

		myPlayer.src(videoToPlay); 

		myPlayer.play();

		if(Modernizr.video){ // Only fadeout images if browser supports video element
			if(!Modernizr.touch){ // Dont fadeout image on touch devices
				$(target).find(".full-screen-image").fadeOut();
			}
		}

	}

	function resetSection(){
		if(Modernizr.video){ // Only fadeout images if browser supports video element
			if(!Modernizr.touch){ // Dont fadeout image on touch devices
				$(".full-screen-section:not(.active)").find(".full-screen-image").show();
			}
		}
	}

	function bindScrollButtons(){

		// Intro button
		$('.article-start__btn').click(function(e){	
			var target = $(this).attr('href');
			
			resetSection();
			if(!Modernizr.touch){
				moveBGvideo(scrollDirection);
			}
			goToSection(scrollDirection,target,true);

			e.preventDefault();
		});		

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
				goToSection(scrollDirection,target,true);
			},200);

			e.preventDefault();
		});

		// Play video button
		$('.button--play').click(function(e){
			$(".full-screen-section.active .mega").addClass("animated fadeOutUp");
			$('.full-screen-section.active .button--play').addClass("animated fadeOut");
			
			$(el_fullScreenVideo).fadeOut(2500,function(){
				
				// Resets ambient player
				myPlayer.loop(false);
				myPlayer.src('');
				goToSection(scrollDirection,'#playingPlaylist',false,function(){
					// initAudio();	
					playPlaylist();
				});
			});
			e.preventDefault();
		});	
	}

	function goToSection(direction, target, animate, callback){
		distanceScrolled = distanceScrolled - 100;
		
		if(animate){
			console.log("animate section jump");
			$(el_sectionContainer).transition({ 
				y: distanceScrolled+'%',
				easing: 'custom-ease',
				duration: 800
			},function(){
				$(".full-screen-section").removeClass("active");
				$(target).addClass("active");
				$(el_fullScreenVideo).css({"transform":"translate(0, 0)"});
				if(!Modernizr.touch){
					playVideo(target);
				}
				if (callback && typeof(callback) === "function") {  
					callback();
				}  
			});
		} else {
			console.log("dont animate section jump");
			$(el_sectionContainer).css({"-webkit-transform":"translate(0, -100%)"});
			callback();
		}
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
			easing: 'custom-ease',
			duration: 800
		});
	}

	function initAudio(){
		$mainAudio.show();
		$mainAudio[0].volume = 1;
		// $mainAudio.animate({volume: 1}, 5000);
		$mainAudio[0].currentTime = 30.5;
		$mainAudio[0].play();
	}

	function playPlaylist(){
		
		$(el_fullScreenVideo).show();
		$("#mainVideo video").bind("ended", function() {
			
			// Play each selected video
			if(playlistCount < selectedVideos.length){
			
				playPlaylistIndex(playlistCount);
			
			// Video ends
			} else { 
				
				// $mainAudio.animate({volume: 0}, 5000,function(){
				// 	$mainAudio[0].pause();	
				// });

				// $("#last").addClass("active");

				goToSection(scrollDirection,'#last',true);
				$(".subtitles,#mainVideo").fadeOut(1200,function(){
					// $(".inner-item--one").addClass("animated fadeInDown");
					$(".inner-item--one").fadeIn();
					setTimeout(function(){
						$(".inner-item--two,.inner-item--three").fadeIn();
					},2000);

				});
				console.log("ENDED");	
			}
		});			
		playPlaylistIndex(playlistCount);
	}

	function playPlaylistIndex(index){
		$(".subtitles li").hide();
		$(".subtitles li:eq("+index+")").show();
		myPlayer.src(selectedVideos[index]);		
		myPlayer.play();
		playlistCount++;
	}

	return {
		init : init,
		myPlayer : myPlayer,
		myAudioPlayer : myAudioPlayer,
		initAudio : initAudio
	};

})(window);

FP.helpers = (function(window){
	var	mediaAspect = 16/9,										// Video aspect ratio of videos
		$window = $(window);									// cache window element

	function bindWindowResize(imageElements,videoElement){
		$(window).resize(function() {
			adjustImagePositioning($(imageElements));
			adjustVideoPositioning(videoElement);
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

	function adjustVideoPositioning(element) {
		var windowW = $window.width();
		var windowH = $window.height();
		var windowAspect = windowW/windowH;
		if (windowAspect < mediaAspect) {
			// taller
			$(element).find("video")
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
			$(element).find("video")
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
		bindWindowResize : bindWindowResize,
		adjustVideoPositioning : adjustVideoPositioning,
		adjustImagePositioning : adjustImagePositioning
	};

})(window);