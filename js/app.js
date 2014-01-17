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
		$bigImage = $(".full-screen-image"),
		$bigVideoWrapper = $('#big-video-wrap'),
		$sectionContainer = $(".body"),
		$window = $(window),
		BV = new $.BigVideo({});

	function init(){
		stroll.bind('#link-list');
		initVideo();
		playVideo("#intro");
		bindScrollButtons();
		adjustImagePositioning();
		bindWindowResize();
	}

	function initVideo(){
		BV = new $.BigVideo({});
		BV.init();
	}

	function playVideo(target){
		BV.show($(target).attr("data-video"),{
			ambient:true
		});
		$(target).find(".full-screen-image").fadeOut();
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
					$("h1.mega").addClass("animated fadeOutUp");
					$('#btn-intro i').addClass("animated fadeOutDown");
					setTimeout(function(){
						scrollToDiv(direction,href);
					},600);
				} else {
					console.log("up");
					$("h1.mega").removeClass("animated fadeOutUp");
					$('#btn-intro i').removeClass("animated fadeOutDown");		
					scrollToDiv(direction,href);			
				}
			} else {
				scrollToDiv(direction,href);
			}
			e.preventDefault();
		});		
	}

	function bindWindowResize(){
		$( window ).resize(function() {
			adjustImagePositioning();
		});
	}

	function moveBGvideo(direction){
		var move;
		if(direction === "-1"){
			move = "100%";
		} else {
			move = "-100%";
		}

		$('#big-video-wrap').transition({ 
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
			$('#big-video-wrap').removeAttr("style");
			playVideo(target);
		});
	}

	function adjustImagePositioning() {
		$bigImage.each(function(){
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

	return {
		init : init,
		moveBGvideo : moveBGvideo
	};

})(window);