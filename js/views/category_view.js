
// ====================================================================
// Single category view

window.YT_category_view = Backbone.View.extend({
	tagName: "section",
	className: "full-screen-section",
	template: $("#optionTemplate").html(),
	events: {
		"click .link-list" : "testing"
	},	
	initialize: function(){
		console.log("init category");
		this.render();
		this.$el.attr('data-video',this.model.attributes.vidOption);
		this.$el.attr('id',this.model.attributes.opID);
	},
	testing: function(){
		console.log("click");
	},
	render:function () {
		console.log("render category");
		var tmpl = _.template(this.template);
		this.$el.html(tmpl(this.model.toJSON()));		
        return this;  // returning this from render method..
	}
});
