// ====================================================================
// Collection of category views
	
YT_category_collection= Backbone.Collection.extend();



YT_category_collection_view = Backbone.View.extend({
	el:$("#Section_options"),

	initialize:function(){
		window.collection = new YT_category_collection(yourTMoptions);
		
		this.render();
	},
	
	render: function(){
		var that = this;
		_.each(window.collection.models, function(item){		
			that.renderYourTMoptions(item);
		}, this);
		
	},

	renderYourTMoptions:function(item){
		
		var yt_category_view = new YT_category_view({
			model: item,							
		});
		
		// this.optionitemScroll(item);
		
		/*optionHelper.playVideo($("#" + item.attributes.opID));*/
		this.$el.append(yt_category_view.render().el);
		
	}
	
	// optionitemScroll:function(item){
	
	// 	$('.link-list a').click(function(e){
	// 		$(this).addClass("active");
	// 		var target = $(this).attr("href"),
	// 			videoUrl = $(this).attr("data-video"),
	// 			text = $(this).text();

	// 		selectedVideos.push(videoUrl);
	// 		console.log(selectedVideos);

	// 		$(".subtitles").append("<li>"+text+"</li>");

	// 		setTimeout(function(){
	// 			var optionHelper = new Helper();
	// 			if(!Modernizr.touch){
	// 				optionHelper.moveBGvideo(scrollDirection);
	// 			}
	// 			optionHelper.scrollToDiv(scrollDirection,target);
				
	// 		},200);

	// 		e.preventDefault();
	// 	});
	// }
});
	
	
	