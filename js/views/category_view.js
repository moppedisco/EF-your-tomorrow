
// ====================================================================
// Single category view

window.YT_category_view = Backbone.View.extend({
		   
		/*el : ".options",*/
	   /* className:"options",*/
	   
	initialize: function (options) {
		this.parent = options.parent;
		this.model
			.set("videoBgUrl",this.el.dataset.video)
			.set("isActive",false);
		
		this.render();
	},
	
	events: function(){
		var _this = this;
		this.$el.find(".link-list a").on('click',function(){
		
			/*introHelper.bindScrollButtons();*/
			var selectedVideoUrl = "vids/video-1.mp4";
			_this.addCategoryItem(selectedVideoUrl);
			
		});
	},
	addCategoryItem: function(video){
		var tempPlaylist = this.parent.model.get("playlist");
		tempPlaylist.push(video);
		this.parent.model.set("playlist",tempPlaylist);
		this.parent.model.trigger("change");
	},
	   
	   
	template:$("#optionTemplate").html(),

	render:function () {
		var tmpl2 = _.template(this.template); 
		
		
		this.$el.html(tmpl2(this.model.toJSON())); 
		return this;
	}
});
