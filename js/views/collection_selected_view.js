window.YT_selected_collection_view = Backbone.View.extend({
    
    el : ".chosen",
    className:"chosen",
    template:$("#chosenTemplate").html(),

    render:function () {
        var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

        this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        return this;
    }
});