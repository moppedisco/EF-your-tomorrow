// ====================================================================
// Collection of category views
	
YT_category_collection= Backbone.Collection.extend({
        model: YT_category_model
});



YT_category_collection_view = Backbone.View.extend({
	tagName: 'ul',
	initialize: function() {
		this.render();
    },	
	render: function(){
		this.collection.each(function(YT_category_model){
			var personView = new YT_category_view({ model: YT_category_model });
			// console.log(personView.$el);
			console.log("asdasd");
		},this);
		return this; // returning this for chaining..
	}
});
	
	
	