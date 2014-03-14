
// ====================================================================
// Single category view

window.YT_category_view = Backbone.View.extend({
	tagName: "section",
	className: "full-screen-section",
	template: _.template($('#optionTemplate').html()),
	render:function () {
        this.$el.html( this.template(this.model.toJSON()));
        return this;  // returning this from render method..
	}
});
