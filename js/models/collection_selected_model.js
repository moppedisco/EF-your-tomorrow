window.YT_selected_collection_model = Backbone.Model.extend({
    defaults:{
        myheading:"1",
        mypara:"2",
        bgImgChosen:"img/baseball.jpg",
        vidChosen:"vids/baseball.mp4"
    }
});

yt_selected_collection_model = new YT_selected_collection_model({
    myheading:"Make your tomorrow",
    mypara:"Play",
    bgImgChosen:"img/baseball.jpg",
    vidChosen:"vids/baseball.mp4"
});