var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seedDB');

// mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// seedDB();

// GET
app.get('/', function (req, res) {
    res.render('landing');
});

// GET
app.get('/campgrounds', function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

// POST
app.post('/campgrounds', function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description

    Campground.create(
        { name: name, image: image, description: description },
        function (err, newCampground) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/campgrounds');
            }
        }
    );
});

// NEW -form to create new campground
app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new');
});

// SHOW
app.get('/campgrounds/:id', function (req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function (err, campground) {
            if (err) {
                console.log(err);
            } else {
                console.log(campground.comments);
                res.render('campgrounds/show', { campground: campground });
            }
        });
});

// ================

// NEW
app.get('/campgrounds/:id/comments/new', function (req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', function (req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                console.log(comment);
                campground.comments.push(comment);
                campground.save();
            });
        }
    });
    res.redirect('/campgrounds/' + req.params.id);
})

app.listen(3000, () => {
    console.log('Yelp Camp server started!');
});