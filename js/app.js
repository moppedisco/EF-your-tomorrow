(function(window){

	function init(){
		YT.animations.intro();

		YT.app.init();

		YT.helpers.init();
	}

	window.YT = {
		init: init
	};

}(window)); // Self execute


YT.animations = (function(window){

	function intro(){
		console.log("intro animation");
		$(".section-loading").addClass("active");

		$("#intromessage li:eq(0)").fadeIn(800);
		setTimeout(function(){
			$("#intromessage li:eq(1)").fadeIn(function(){
				setTimeout(function(){
					showFirstScreen();
				},2000);
			});
		},3000);
	}

	function showFirstScreen(){
		$(".article-start__title,.article-start__line").addClass("animated fadeInDown");
		$(".article-loading").fadeOut(function(){
			setTimeout(function(){
				$(".article-start__desc,.article-start__btn").addClass("animated fadeIn");
			},1000);			
		});
	}

	function outro(callback){
		$('.full-screen-section.active .button--play').addClass("animated fadeOut");
		$("#mainVideo").fadeOut(2500,function(){
			callback();
		});
	}

	function share(){
		$(".article-message h1:nth-of-type(1)").fadeOut(function(){
			$(".article-message h1:nth-of-type(2)").fadeIn();
		});
		$(".article-message p:nth-of-type(1)").fadeOut(function(){
			$(".article-message p:nth-of-type(2)").fadeIn(function(){
				$("#last .full-screen-image").fadeIn();
			});
		});
	}

	return {
		intro : intro,
		outro : outro,
		share : share
	};

})(window);

YT.app = (function(window){

	var $fullScreenImage = $(".full-screen-image"),				// Cover image element before the video is loaded 
		$fullScreenSection = $(".full-screen-section"),			// Page sections
		$sectionContainer = $(".wrapper"),						// Main element we animate
		$mainAudio = $("#mainAudio"), 							// Main audio element
		$mainAudioCtrl = $("#volumeCtrl"), 						// Volume controller
		el_fullScreenVideo = "#mainVideo",						// Background video element
		myAudioPlayer,											// Audio player instance
		distanceScrolled = 0,									// The value is a multiple of 100, for example 100%, 200% etc
		scrollDirection = 1, 									// 1 down, -1 is up
		playlistCount = 0,
		myPlayer,												// Video player object
		ambients = [],											// Ambient videos
		videoPromises = [],										// Video download promises
		selectedVideos = [];									// Selected category videos

	// $.cssEase['custom-ease'] = 'cubic-bezier(0.680,0,0.265,1)';
	$.cssEase['custom-ease'] = 'cubic-bezier(1,0,0,1)';

	function init(){

			downloadAmbients();
			downloadVideos(6); // Nr of categories

			initVideo(function(){
				playVideo("#start");	
			});

			initAudio();

			$.when.apply(null, videoPromises).done(function() {
				console.log("ALL VIDEOS HAVE DOWNLOADED MOTHERFUCKER");
				$('.button--play').css("visibility","visible");
			});

			bindActionButtons();

	}

	function downloadAmbients () {
		
		return new Promise(resolveAmbients);
	}

	function downloadVideos(nrOfcategories){
		for(var i=0;i<nrOfcategories;i++){
			var categoryPromise = $.Deferred();
			videoPromises.push(categoryPromise);				
		}		
	}

	function resolveAmbients (resolve) {
		var loader = new PxLoader(),
			resource;

		$fullScreenSection.each(function(i){
			var videoUrl = $(this).attr("data-video");
		
			if(videoUrl){
				ambients.push(videoUrl);
				resource = new PxLoaderVideo(videoUrl);
				loader.add(resource);		
			}
		});

		loader.addProgressListener(function (e) {
			console.log('Ambient ' + e.completedCount + ' downloaded');
		});

		loader.addCompletionListener(function () {
			console.log('All the ambients are downloaded. Resolve promise');
			resolve(); // all the ambient videos have been downloaded
		});

		loader.start();
	}

	function resolveVideos(url,index){
		var loader = new PxLoader();

		loader.add(new PxLoaderVideo(url));
		loader.addCompletionListener(function () {
			console.log('Video ' + index + ' downloaded');
			videoPromises[index].resolve();
		});

		loader.start();
	}

	function initVideo(callback){

		// Using videojs plugin to handle source etc. Actually not necessary
		videojs("mainVideo").ready(function(){
			myPlayer = this;
			myPlayer.loop(true);
		});	

		// Init Make our video player fit entire screen
		YT.helpers.adjustVideoPositioning(el_fullScreenVideo);
		callback();
	}

	function playVideo(target){
		var videoToPlay = $(target).attr("data-video"),
			poster = $(target).find(".full-screen-image").attr("src");

		// We set html5 poster attribute incase video fails to load.
		$(el_fullScreenVideo).find("video").attr("poster",poster); 
		
		// Set target video src
		myPlayer.src(videoToPlay); 

		// Play new video src
		myPlayer.play();

		// Only fadeout images if browser supports video element
		if(Modernizr.video){ 
			$(target).find(".full-screen-image").fadeOut();				
		}
	}

	function bindActionButtons(){

		// Intro button
		$('.article-start__btn').click(function(e){	
			var target = $(this).attr('href');
			
			// resetSection();
			if(!Modernizr.touch){
				moveBGvideo(scrollDirection);
			}

			goToSection(1,target,true);

			e.preventDefault();
		});		

		// Category buttons
		$('.link-list a').click(function(e){
			var target = $(this).attr("href"),
				videoUrl = $(this).attr("data-video"),
				text = $(this).attr("data-text");

			$(this).siblings().unbind('click');

			if($(this).hasClass("active")){
				return false;
			}
			
			$(this).addClass("active");

			selectedVideos.push(videoUrl);

			resolveVideos(videoUrl,selectedVideos.indexOf(videoUrl));
			console.log(selectedVideos);

			$(".subtitles").append("<li>"+text+"</li>");

			setTimeout(function(){
				if(!Modernizr.touch){
					moveBGvideo(scrollDirection);
				}
				goToSection(1,target,true);
			},200);

			e.preventDefault();
		});

		// Play video button
		$('.button--play').click(function(e){

			YT.animations.outro(function(){
				myPlayer.loop(false);
				myPlayer.src('');
				goToSection(1,'#playingPlaylist',false,function(){
					if(!Modernizr.touch){
						// Resets ambient player					
						console.log("desktop playlist");
						playPlaylist();
					} else {
						console.log("mobile playlist");					
					}
				});					
			})

			e.preventDefault();
		});	

		$("#replay").on('click',function(){
			$(".article-share").fadeOut(1000,function(){
				goToSection(-1,'#playingPlaylist',false,function(){
					console.log("replay video");
					playPlaylist();
					$(".subtitles").show();
					$(".article-message").show();
				});						
			})
		})
	}

	function goToSection(steps, target, animate, callback){
		distanceScrolled = distanceScrolled - 100*steps;

		if(animate){
			console.log("animate section jump");
			$sectionContainer.transition({ 
				y: distanceScrolled+'%',
				easing: 'custom-ease',
				duration: 800
			},function(){
				$fullScreenSection.removeClass("active");
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
			$fullScreenSection.removeClass("active");
			$(target).addClass("active");			
			$sectionContainer.css({"transform":"translate(0, "+distanceScrolled+"%)"});
			if (callback && typeof(callback) === "function") {  
				callback();
			}  
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
		$mainAudioCtrl.show();
		$mainAudio[0].volume = 0.5;

		$("#volumeCtrl").on("change",function(){
			var val = $(this).val();
			console.log($(this).val());
			$mainAudio[0].volume = val/100;
		})

	}

	function playPlaylist(){
		playlistCount = 0;		

		$(el_fullScreenVideo).find("video").attr("poster",""); 
		$(el_fullScreenVideo).show();
		
		playPlaylistIndex(playlistCount);
		
		$mainAudio[0].play();
		
		$("#mainVideo video").bind("ended", function() {
			
			// Play each selected video
			if(playlistCount < selectedVideos.length){
				console.log(playlistCount);
				playPlaylistIndex(playlistCount);
			
			// Video ends
			} else { 
				
				$mainAudio.animate({volume: 0}, 5000,function(){
					$mainAudio[0].pause();	
				});

				$(".subtitles,#mainVideo").hide()
				goToSection(1,'#last',false,function(){
					setTimeout(function(){
						YT.animations.share();
					},3000);

				});
				$(this).unbind("ended"); // Reset video
				console.log("ENDED");	
			}
		});			
	}

	function playPlaylistIndex(index){
		$(".subtitles li").hide();
		$(".subtitles li:eq("+index+")").show();

		setTimeout(function(){
			$(".subtitles li:eq("+index+")").hide();
		},3000);		

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

YT.helpers = (function(window){
	var	mediaAspect = 16/9,										// Video aspect ratio of videos
		$window = $(window),									// cache window element
		$fullScreenImage = $(".full-screen-image"),
		el_fullScreenVideo = "#mainVideo";

	function init(){
		bindWindowResize($fullScreenImage,el_fullScreenVideo);		
		adjustImagePositioning($fullScreenImage);

		namePlaceholder();

		shareInput();
	}

	function bindWindowResize(imageElements,videoElement){
		$(window).resize(function() {
			adjustImagePositioning(imageElements);
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

	function shareInput(){
		$(".input-share").click(function () {
			$(this).select();
		});		
	}

	function namePlaceholder(){
		var isPlaceholder = true;
		// $('.name-field__inputarea'),focuson();
		$('.name-field__inputarea').on('keypress', function(event) {
			if(isPlaceholder){
				$(this).empty();
				isPlaceholder = false;	
			}

			if (event.which == 13 ) {
				return false;
			}
		}).on('focusout', function() {
			var currentName = $(this).html();
				placeholderText = $(this).attr('data-text');
			if(currentName.length === 0 || isPlaceholder){
				$(this).text(placeholderText);
				isPlaceholder = true;
				$(this).removeClass("ready");
			} else {
				$(this).addClass("ready");
			}
		}).on('focuson', function() {
			$(this).removeClass("ready");
		});		
	}


	return {
		init : init,
		bindWindowResize : bindWindowResize,
		adjustVideoPositioning : adjustVideoPositioning,
		adjustImagePositioning : adjustImagePositioning
	};

})(window);