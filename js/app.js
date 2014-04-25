(function(window){


	// Main app
	function init(){
		// CHECK IF MOBILE REDIRECT TO MOBILE LANDING PAGE
		if(!Modernizr.touch){
			YT.app.init();
			YT.createVideoPage.init();
		} else {
			window.location.href = "http://www.ef.com";
		}
	}

	// Share page
	function share(){
		YT.app.init();
		YT.sharePage.init();
	}

	window.YT = {
		init: init,
		share: share
	};

}(window));

YT.createVideoPage = (function(window){
	function init(){
		
		// Animate welcome screen
		welcomeScreen(function(){
			if(Modernizr.audio){
				YT.app.myAudioPlayer()[0].play();
				YT.app.myAudioPlayer().animate({volume: 0.5}, 1500);
				$("#mep_0").fadeIn(500);
			}
		});

		// Init video and play video
		YT.app.initVideo(function(){
			YT.app.playVideo("#start");	
		});

		// Start button and category buttons
		bindActionButtons();

		// Enter name functionality
		namePlaceholder();

		// Share field functionality
		shareInput();

		// Create promises for all videos  // Nr of categories
		downloadVideos(6);

		// Show play button once all video promises resolved
		$.when.apply(null, YT.app.videoPromises).done(function() {
			setTimeout(function(){
				$('.button--play').addClass('loaded');
			},1500);
		});

	}

	// Sets focus in the middle on enter name
	function setCaret() {
		var el = $(".name-field__inputarea").get(0);
		var center_text = $(".name-field__inputarea").text().length/2;
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(el.childNodes[0], center_text);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		el.focus();
	}

	function downloadVideos(nrOfcategories){
		for(var i=0;i<nrOfcategories;i++){
			var categoryPromise = $.Deferred();
			YT.app.videoPromises.push(categoryPromise);				
		}
	}

	function bindActionButtons(){
		// Intro button
		$('.article-start__btn').click(function(e){	
			var target = $(this).attr('href');

			if($(this).hasClass("active")){
				return false;
			}

			if (typeof ga !== 'undefined') {
				ga('send','event', 'Button - Start here', 'click', 'Clicked Start here');
			}

			$(this).addClass("active");
			
			if(!Modernizr.touch){
				YT.app.moveBGvideo(1);
			}

			YT.app.goToSection(1,true);

			e.preventDefault();
		});
	
		// Category buttons
		$('.link-list a').click(function(e){
			var target = $(this).attr("href"),
				videoUrl = $(this).attr("data-video"),
				text_button = $.trim($(this).text()),
				text = $(this).attr("data-text"),
				ulElement = $(this).closest("ul"),
				liElement = $(this).closest("li").index(),
				textPosition = $(this).attr('data-position');

			if($(this).hasClass("active")){
				return false;
			}

			if (typeof ga !== 'undefined') {			
				ga('send','event', 'Button - Category'+YT.app.active_section, 'click', 'Clicked index: '+liElement + ' - '+text);
			}

			$(this).addClass("active");

			// Add video to playlist
			YT.app.playlist.push(videoUrl);

			// Creates unique url of playlist
			YT.app.selectedCatogories[getNumberOfCategory(ulElement)] = getNumberOfOption($(this), ulElement);
			
			// Resolve download of video
			YT.app.resolveVideos(videoUrl,YT.app.playlist.indexOf(videoUrl));
			
			// Create subtitle
			$(".subtitles").append("<li>"+text+"</li>");
			$(".subtitles li:last-child").addClass(textPosition);

			// If language section, add the selected text to the next section byline
			if($('section.active').hasClass('language-category')){
				var string = $('.full-screen-section:eq('+(YT.app.active_section+1)+') h2').text();

				string = string.replace('$lang',$.trim(text_button));

				$('.full-screen-section:eq('+(YT.app.active_section+1)+')').find('h2').html(string);
			}

			setTimeout(function(){

				YT.app.moveBGvideo(1);

				YT.app.goToSection(1,true,function(){
					if(YT.app.active_section === (YT.app.pageSections.length-3)){
						setCaret();
					}
				});
			},200);

			e.preventDefault();
		});

		$('#two .link-list a').click(function(e){
			$("#three h2 u").html($.trim($(this).text()));
		});
	}

	function welcomeScreen(callback){
		$("#intromessage li:eq(0)").fadeIn(800);
		setTimeout(function(){
			$("#intromessage li:eq(1)").fadeIn(function(){
				setTimeout(function(){
					showFirstScreen();
					callback();
				},2000);
			});
		},3000);
	}

	function showFirstScreen(){
		$(".article-start__title,.article-start__line").transition({ opacity: 1 });
		$(".article-loading").fadeOut(function(){
			setTimeout(function(){
				$(".article-start__desc,.article-start__btn").transition({ opacity: 1 });
			},1000);			
		});
	}

	function shareInput(){
		$(".input-share").on({
			click : function () {
				$(this).select();
				if (typeof ga !== 'undefined') {			
					ga('send','event', 'Button - URL field', 'click', 'Clicked share your video field');
				}	
			},
			copy : function(){
				if (typeof ga !== 'undefined') {			
					ga('send','event', 'Button - URL field', 'click', 'Copyied URL field');
				}
			}
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
				$('.button--play').removeClass('ready');
			} else {
				$(this).addClass("ready");
				$('.button--play').addClass('ready');
			}
		}).on('focuson', function() {
			$(this).removeClass("ready");
			$('.button--play').removeClass('ready');
		});		
	}

	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++){
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	var getNumberOfCategory = function(ulElement) {
		var categories = $("ul.link-list");
		for (var i = 0; i < categories.length; i++) {
			if (categories[i] == ulElement[0])
				return i;
		}
		return null;
	};

	var getNumberOfOption = function(anchorElement, ulElement) {
		var options = ulElement.find("li a");
		for (var i = 0; i < options.length; i++) {
			if (options[i] == anchorElement[0])
			    return i;
		}
		return null;
	};

	return {
		init: init
	};

})(window);

YT.sharePage = (function(window){

	var data = window.Settings.PlayList;

	function init(){
		downloadVideos(data['Videos']);

		// Init video and play video
		YT.app.initVideo(function(){
			YT.app.playVideo("#playPlaylist");
		});

		// Show play button once all video promises resolved
		$.when.apply(null, YT.app.videoPromises).done(function() {
			$('.button--play').addClass('loaded');
			$("#mep_0").fadeIn(500);
		});

	}

	function downloadVideos(data,callback){
		for(var i = 0; i < data.length; i++) {
			var categoryPromise = $.Deferred();
			YT.app.videoPromises.push(categoryPromise);
			$(".subtitles").append("<li>"+data[i].Title+"</li>");
			YT.app.playlist.push(data[i].Url);
			YT.app.resolveVideos(data[i].Url,i);
		}
	}

	return {
		init: init
	};

})(window);

YT.app = (function(window){

	var $fullScreenImage = $(".full-screen-image"),				// Cover image element before the video is loaded 
		$fullScreenSection = $(".full-screen-section"),			// Page sections
		$sectionContainer = $(".wrapper"),						// Main element we animate
		$mainAudio = $("#mainAudio"), 							// Main audio element
		el_fullScreenVideo = "#mainVideo",						// Background video element
		myAudioPlayer,											// Audio player instance
		distanceScrolled = 0,									// The value is a multiple of 100, for example 100%, 200% etc
		scrollDirection = 1, 									// 1 down, -1 is up
		myPlayer,												// Video player object
		prePlayer,												// For pre-loading
		videoPlayers = [],										// The two video players for preloading
		ambients = [],											// Ambient videos
		videoPromises = [],										// Video download promises
		selectedCatogories = [],
		playlist = [],
		playlistCount = 0,
		mediaAspect = 16/9,										// Video aspect ratio of videos
		pageSections = [],
		active_section = 0,
		$window = $(window);									// cache window element

	// $.cssEase['custom-ease'] = 'cubic-bezier(0.680,0,0.265,1)';
	$.cssEase['custom-ease'] = 'cubic-bezier(1,0,0,1)';

	function init(){

			// Keep track of progress and active view
			createPageSections();

			// Download ambients
			downloadAmbients();

			// Init audio
			initAudio();

			// Bind all buttons
			bindActionButtons();

			// Bind window resize
			bindWindowResize($fullScreenImage,el_fullScreenVideo);		
		
			// Full screen image positioning
			adjustImagePositioning($fullScreenImage);
	}

	function createPageSections(){
		$fullScreenSection.each(function(i,el){
			pageSections.push(el);
		});
	}

	function share(){
		$(".article-outromessage").fadeOut();
	}


	function playlistIntro(callback){
		$('.full-screen-section.active .button--play').fadeOut(2500);
		var volume = YT.app.myAudioPlayer()[0].volume;
			song = YT.app.myAudioPlayer().attr('data-playlist-music');

		YT.app.myAudioPlayer().animate({volume: 0}, 2500);
		
		// IF NOT IE9 CHECK. Just animate different sections to black
		if(Modernizr.cssanimations){
			$("#mainVideo").fadeOut(2500,function(){
				YT.app.myAudioPlayer()[0].setAttribute('src', song);
				YT.app.myAudioPlayer()[0].setAttribute('volume', volume);
				YT.app.myAudioPlayer()[0].setAttribute('loop', false);
				callback();
			});
		} else {
			$(".full-screen-section.active .full-screen-image").fadeOut(2500,function(){
				YT.app.myAudioPlayer()[0].setAttribute('src', song);
				YT.app.myAudioPlayer()[0].setAttribute('volume', volume);
				YT.app.myAudioPlayer()[0].setAttribute('loop', false);
				callback();
			});			
		}
	}

	function replay(callback){
		$(".section-last .full-screen-image").fadeOut(1000);
		$(".article-sharepage").fadeOut(1000,function(){
			callback();
		})		
	}

	function downloadAmbients () {
		
		return new Promise(resolveAmbients);
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
			// console.log('Ambient ' + e.completedCount + ' downloaded');
		});

		loader.addCompletionListener(function () {
			// console.log('All the ambients are downloaded. Resolve promise');
			resolve(); // all the ambient videos have been downloaded
		});

		loader.start();
	}

	function resolveVideos(url,index){
		var loader = new PxLoader();

		loader.add(new PxLoaderVideo(url));
		loader.addCompletionListener(function () {
			// console.log('Video ' + index + ' downloaded');
			videoPromises[index].resolve();
		});

		loader.start();
	}

	function initVideo(callback){

		// THIS CHECK IS FOR FIREFOX ON MAC SINCE IT ONLY SUPPORTS OGG VIDEO FORMAT
		if(Modernizr.video.h264){
			myPlayer = $(el_fullScreenVideo)[0];
			myPlayer.setAttribute('loop', 'true');

			// Init Make our video player fit entire screen
			adjustVideoPositioning(el_fullScreenVideo);
			callback();
		} else {
			// FALLBACK PLAYER GOES HERE

			// jwplayer("jwplayer").setup({
			// 	file: "http://player.vimeo.com/external/90037118.hd.mp4?s=d6848ef8b4d29410b59ec759cbb58270",
			// 	width: 640,
			// 	height: 360,
			// 	events: {
			// 		onComplete: function() {
			// 			alert('ready');
			// 		} 
			// 	}
			// });	
		}
	}

	function playVideo(target){
		var videoToPlay = $(target).attr("data-video"),
			poster = $(target).find(".full-screen-image").attr("src");

		// We set html5 poster attribute incase video fails to load.
		//$(el_fullScreenVideo).find("video").attr("poster",poster); 
		myPlayer.setAttribute('poster', poster);
		
		// Set target video src
		//myPlayer.src(videoToPlay); 
		myPlayer.setAttribute('src', videoToPlay);

		// Play new video src
		myPlayer.play();

		// Only fadeout images if browser supports video element
		if(Modernizr.video && Modernizr.cssanimations){ 
			$(target).find(".full-screen-image").fadeOut();				
		}
	}

	function bindActionButtons(){
		// Play video button
		$('.button--play').click(function(e){
			if($(this).hasClass("active")){
				return false;
			}

			// Analytics tracking of name
			if($(".name-field__inputarea").hasClass('ready')){
				var input_name = $(".name-field__inputarea");
				// console.log('entered name');
				if (typeof ga !== 'undefined') {	
					ga('send','event', 'Name', 'click', 'Did enter name');
				}
			} else {
				// console.log('NO name');
				if (typeof ga !== 'undefined') {	
					ga('send','event', 'Name', 'click', 'Did NOT enter name');
				}				
			}
			
			// Analytics tracking of clicked button
			if (typeof ga !== 'undefined') {	
				ga('send','event', 'Button - Play', 'click', 'Clicked Play playlist');
			}

			$(this).addClass("active");

			playlistIntro(function(){
					
				myPlayer.removeAttribute('loop');
				myPlayer.setAttribute('src', '');
				
				goToSection(1,false,function(){
					playPlaylist();
				});					
			});
			
			// Create unique link for user
			var uniqueURL = getShareLink(input_name,selectedCatogories);
				twitterURL = "https://twitter.com/home?status=This%20is%20my%20tomorrow%20"+uniqueURL+"%20%23EFyourtomorrow",
				mailURL = "mailto:?subject=This is my tomorrow&body="+uniqueURL;

			$(".input-share[type='text']").attr("value",uniqueURL);
			$(".icon--twitter").attr("href",twitterURL);
			$(".icon--mail").attr("href",mailURL);

			e.preventDefault();
		});	

		$("#replay").on('click',function(){
			replay(function(){
				goToSection(-1,false,function(){
					playPlaylist();
					
					if (typeof ga !== 'undefined') {
						ga('send','event', 'Button - replay', 'click', 'Clicked replay button');
					}

					$(".subtitles").show();
					$(".article-outromessage").show();
					$(".section-last .full-screen-image").show();
					$(".article-sharepage").show();
				});						
			});
		})

		// Pause play functionality, not yet implemented
		$('.button--pause').click(function(e){
			$(this).toggleClass("clicked");
			if($(this).hasClass('clicked')){
				myPlayer.pause();
				myAudioPlayer[0].pause();				
			} else {
				myPlayer.play();
				myAudioPlayer[0].play();				
			}
		});
	}

	function goToSection(steps, animate, callback){
		distanceScrolled = distanceScrolled - 100*steps;

		var current = pageSections[YT.app.active_section].id,
			target = pageSections[YT.app.active_section + steps].id;

		YT.app.active_section = YT.app.active_section + steps;

		// TO ANIMATE SECTIONS WE NEED TO CHECK IF ANIMATIONS ARE SUPPORTED // IE9 
		if(animate && Modernizr.cssanimations){
			$sectionContainer.transition({ 
				y: distanceScrolled+'%',
				easing: 'custom-ease',
				duration: 800
			},function(){
				$("#"+current).removeClass("active");
				$("#"+target).addClass("active");
				$(el_fullScreenVideo).css({"transform":"translate(0, 0)"});

				playVideo("#"+target);

				if (callback && typeof(callback) === "function") {
					callback();
				}  
			});
		} else {
			$("#"+current).removeClass("active");
			$("#"+target).addClass("active");
			$(el_fullScreenVideo).css({"transform":"translate(0, 0)"});
			
			// DO SECTION TRANSITIONS USING TOP FOR IE8
			if(!$('html').hasClass('ie8')){
				$sectionContainer.css({"transform":"translate(0, "+distanceScrolled+"%)"});
			} else {
				$sectionContainer.css({"top": distanceScrolled+"%"});
			}

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
		myAudioPlayer = $('audio').mediaelementplayer({
			audioWidth: "26",
			features: ['playpause','volume'],
			audioVolume: 'vertical'
		});
		myAudioPlayer[0].volume = 0;
	}

	function audioPlayer(){
		return myAudioPlayer
	}

	function createPrePlayer($myVideo) {
		// let's clone the video element we already have to have same styles
		// but we change the id and insert after the original one
		var $preVideo = $myVideo.clone();
		prePlayer = $preVideo[0];
		prePlayer.setAttribute('id', 'preVideo');
		$myVideo.after(prePlayer);
	}
	
	function preparePlayListPlayer() {
		var $myVideo = $(el_fullScreenVideo);
		$myVideo.attr('poster', '');
		
		// we create the video element that'll be used for preloading
		// it'll be hosted in prePlayer variable
		createPrePlayer($myVideo);
		
		// we need this array to swap video players when we finish with
		// the current one. We'll always play videoPlayers[0] and hide
		// the other one
		videoPlayers = [myPlayer, prePlayer];
		
		// let's do the hiding and showing using zIndex. I'd say it's better
		// than using display in terms of performance
		myPlayer.style.zIndex = 1;
		prePlayer.style.zIndex = 0;
		
		
		// all the video elements should be visible though
		myPlayer.style.display = 'inline-block';
		prePlayer.style.display = 'inline-block';
		
		// empties the src in case of realoading
		myPlayer.setAttribute('src', '');
		
		$myVideo.show();
	}
	
	function playPlaylist(){
		playlistCount = 0;		
		
		preparePlayListPlayer();
		
		playPlaylistIndex(playlistCount);
		
		myAudioPlayer[0].volume = myAudioPlayer[0].volume + 0.1; // BUG, you dont hear the sound unless you change the volume
		myAudioPlayer[0].play();

		$(".videoPlayer").bind("ended", function() {
			
			// Play each selected video
			if(playlistCount < playlist.length){
				playPlaylistIndex(playlistCount);
			// Video ends
			} else { 
				
				$mainAudio.animate({volume: 0}, 5000,function(){
					myAudioPlayer[0].pause();
					myAudioPlayer[0].currentTime = 0;
				});

				$(".subtitles,#mainVideo").hide()
					goToSection(1,false,function(){
						setTimeout(function(){
							share();
						},4000);
					});
				
				$(".videoPlayer").unbind(); // Reset video

				// we no longer need this element
				$(prePlayer).remove();
			}
		});			
	}

	function swapVideoPlayers() {
		// let's swap video players
		var videoPlayer = videoPlayers[0];
		videoPlayers[0] = videoPlayers[1];
		videoPlayers[1] = videoPlayer;
	}
	
	function playPlaylistIndex(index){
		$(".subtitles li").hide();
		$(".subtitles li:eq("+index+")").show();

		setTimeout(function(){
			$(".subtitles li:eq("+index+")").hide();
		},3000);		
		
		var curVideoPlayer = videoPlayers[0],
			preVideoPlayer = videoPlayers[1];
		
		// makes current one visible by placing in on top
		curVideoPlayer.style.zIndex = 1;
		
		if (!curVideoPlayer.getAttribute('src')) {
			// only sets the attribute if there is no video set.
			// first video will have the horrible back screen of death
			curVideoPlayer.setAttribute('src', playlist[index]);
		}
		myPlayer = curVideoPlayer;
		curVideoPlayer.play();
		
		if (playlist[index+1]) {
			// the magic happens in here, preloading next video
			preVideoPlayer.style.zIndex = 0;
			preVideoPlayer.setAttribute('src', playlist[index+1]);
		}
		
		playlistCount++;
		
		// at the end we swap video players
		swapVideoPlayers();
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

	var getShareLink = function(userName, selectedCatogories) {
		selectedCatogories.sort();
		var serializedString = selectedCatogories.join('_') + '_' + userName;
		if(Modernizr.csstransitions){
			// console.log("base64");
			return window.location.host + window.Settings.VideoPageUrl + "?id=" + window.btoa(escape(serializedString));
		}
	};

	return {
		init : init,
		goToSection : goToSection,
		moveBGvideo : moveBGvideo,
		selectedCatogories : selectedCatogories,
		initVideo : initVideo,
		playVideo : playVideo,
		playlist : playlist,
		resolveVideos : resolveVideos,
		videoPromises : videoPromises,
		active_section : active_section,
		pageSections : pageSections,
		myAudioPlayer : audioPlayer
	};

})(window);

////////////////////////////////////////
////////////////////////////////////////
// POLYFILL FOR indexOF FOR IE8
////////////////////////////////////////
////////////////////////////////////////
if (!Array.prototype.indexOf){
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

