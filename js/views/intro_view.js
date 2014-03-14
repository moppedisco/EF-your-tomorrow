window.YT_intro_view = Backbone.View.extend({
        
		el : ".intro",
		tagName: 'div',
       /* className:"section-intro",*/
        template:$("#introTemplate").html(),
		
		initialize: function () 
		{
		this.render();
		
		
			
	},

	  render:function () {
		  console.log("render");
            var tmpl = _.template(this.template); 
            this.$el.html(tmpl(this.model.toJSON())); 
			
            return this;
        },	
    });