// ====================================================================
// Collection of category views
	
YT_category_collection= Backbone.Collection.extend();



YT_category_collection_view = Backbone.View.extend({
	initialize: function(options) {
		console.log("init collection");
		this.parent = options.parent;
    },	
	render: function(){
		console.log("render collection");
		var _this = this;
		_.each(this.collection, function (item) {
			console.log("render collection item");
			var categoryModel = new YT_category_model(item);
			var categoryView = new YT_category_view({model: categoryModel});
			_this.parent.append(categoryView.$el);
		},this);
		return this.parent; // returning this for chaining..
	}
});
	
	
	