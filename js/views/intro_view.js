window.YT_intro_view = Backbone.View.extend({ 
	id: "intro",
	tagName: "section",
	className: "full-screen-section section-intro",
    template:$("#introTemplate").html(),
    model: yt_intro_model,
	events: {
		"click #section-intro__btn" : "testing"
	},
	initialize: function(){
		this.$el.attr('data-video',this.model.attributes.vidIntro);
	},
	testing: function(){
		console.log("click");
	},
	render:function () {
		console.log("render intro");
		var tmpl = _.template(this.template); 
		this.$el.html(tmpl(this.model.toJSON())); 
		return this;
	},	
});