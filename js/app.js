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
		distanceScrolled = 0,									// The value is a multiple of 100, for example 100%, 200% etc
		scrollDirection = 1, 									// 1 down, -1 is up
		myPlayer,												// Video object
		playlistCount = 0,										// Count to keep track of played videos in playlist
		ambients = [],											// Ambient videos
		queueVideoPromises = [],
		selectedVideos = [];									// Selected category videos

	function init(){

		FP.helpers.adjustImagePositioning($(el_fullScreenImage));

		if(!Modernizr.touch){
			downloadAmbients().then(initFirstFrame);
		} else {
			initFirstFrame();
		}

		// Category buttons	
		// $('.link-list a').click(function(e){
		// 	$(this).addClass("active");
		// 	var target = $(this).attr("href"),
		// 		videoUrl = $(this).attr("data-video"),
		// 		text = $(this).text();

		// 	selectedVideos.push(videoUrl);
		// 	console.log(selectedVideos);

		// 	$(".subtitles").append("<li>"+text+"</li>");

		// 	setTimeout(function(){
		// 		if(!Modernizr.touch){
		// 			moveBGvideo(scrollDirection);
		// 		}
		// 		scrollToDiv(scrollDirection,target);
		// 	},200);

		// 	e.preventDefault();
		// });

	}

	function resolveFirstFrame(){
		$(".section-intro").addClass("active");

		initVideo();
		playVideo("#intro");
		
		bindScrollButtons();
		FP.helpers.bindWindowResize(el_fullScreenImage,el_fullScreenVideo);
		return resolve();
	}

	function resolveVideo (i) {

		return function (resolve) {
			var loader = new PxLoader();

			document.getElementById('opt' + i).addEventListener('click', function (e) {
				var target = e.target,
					option = parseInt(target.dataset['option']),
					video = target.dataset['video'] + '&time=' + Math.random();

				loader.add(new PxLoaderImage(video));

				loader.addCompletionListener(function () {
					console.log('Video ' + i + ' downloaded');
					resolve({ option: option, video: video });
				});

				loader.start();

				e.target.parentNode.innerHTML = 'Option ' + i + ' DONE';

			});

		};

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

				// queueVideoPromises.push(new Promise(resolveVideo(i + 1)));				
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
		if(Modernizr.video){ // Only fadeout images if browser supports video element
			if(!Modernizr.touch){ // Dont fadeout image on touch devices
				$(target).find(".full-screen-image").fadeOut();
			}
		}
		myPlayer.play();
	}

	function resetSection(){
		if(Modernizr.video){ // Only fadeout images if browser supports video element
			if(!Modernizr.touch){ // Dont fadeout image on touch devices
				$(".full-screen-section:not(.active)").find(".full-screen-image").show();
			}
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

		// Play video button
		$('.button--play').click(function(e){
			// $(".full-screen-section.active .mega").addClass("animated fadeOutUp");
			$('.full-screen-section.active .button--play').addClass("animated fadeOut");
			
			initVideo();

			// Wait for the text to disapear before fading out background
			// setTimeout(function(){ 
				$(el_fullScreenVideo).fadeOut(1200,function(){
					
					// Resets ambient player
					myPlayer.loop(false);
					myPlayer.src('');

					// Create delay effect before we start playing the playlist
					setTimeout(function(){
						$(".full-screen-section.active .mega").hide();
						$(".full-screen-section").removeClass("active");
						loadPlaylist();
					},1300);					
				});
			// },800);			
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

	function loadPlaylist(){
		
		$(el_fullScreenVideo).show();

		$("#mainVideo video").bind("ended", function() {
			if(playlistCount < selectedVideos.length){
				playPlaylist(playlistCount);
			} else {
				$("#last").addClass("active");
				scrollToDiv(scrollDirection,'#last');
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

	return {
		init : init,
		myPlayer : myPlayer
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