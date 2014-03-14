window.YT_play_selected_collection_view = Backbone.View.extend({
    
	el : ".play",
    className:"play",
    template:$("#playTemplate").html(),
	

    render:function () {
        var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

        this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        return this;
    }
});

yt_play_selected_collection_view = new YT_play_selected_collection_view({
    model: yt_play_selected_collection_model
});

// Render play selected collection
$("#Section_play").html(this.yt_play_selected_collection_view.render().el); 