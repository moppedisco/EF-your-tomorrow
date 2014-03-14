window.YT_intro_model = Backbone.Model.extend({
    defaults:{
        heading:"1",
        para:"2",
		vidIntro:"vids/baseball.mp4",
		bgImgIntro:"img/baseball.jpg"
    }
});



yt_intro_model = new YT_intro_model({
    heading:"Make your tomorrow",
    para:"Play",
	vidIntro:"vids/baseball.mp4",
	bgImgIntro:"img/baseball.jpg"
});