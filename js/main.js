(function ($,window) {

	var Helper = Backbone.Helper.extend({
		adjustImagePositioning: function(element) {

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
		},
		adjustVideoPositioning: function(element) {
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
	});

	window.AppView = Backbone.View.extend({
			
		el: $(".body"),	
		isAnimating: false,
		currentPosition: 0,
		pxLoader: new PxLoader(),
		initialize: function() {
			this.model = new yourTMAppViewModel;
			this.render();
			$("#intro").addClass("active");
	    },
		
		render: function () {		

			// =========================================================
			// Init intro view
			this.yt_intro_view = new YT_intro_view({
	        	model: yt_intro_model
	    	});		
			
			// Render intro view
		 	$("#Section_intro").html(this.yt_intro_view.render().el);			



		 	// =========================================================
		 	// Init collection of categories
			yt_category_collection_view = new YT_category_collection_view();		



		 	// =========================================================
		 	// Init selected collection view	
			this.yt_selected_collection_view = new YT_selected_collection_view({
				model: yt_selected_collection_model
			});	
			
			// Render selected collection view
	   		$("#Section_chosen").html(this.yt_selected_collection_view.render().el);




		 	// =========================================================
		 	// Init play selected collection					
			this.yt_play_selected_collection_view = new YT_play_selected_collection_view({
	        	model: YT_play_selected_collection_model
	    	});

				
		}				
	});
	
	yourTMAppViewModel = Backbone.Model.extend({
		defaults: {},
		initialize: function(){
		
		
		
		}	
	});
	
	App = new AppView();

})(jQuery,window);