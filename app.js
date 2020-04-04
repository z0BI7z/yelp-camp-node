var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);


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
            res.render('campgrounds', { campgrounds: allCampgrounds });
        }
    });
});

// POST
app.post('/campgrounds', function (req, res) {
    var name = req.body.name;
    var image = req.body.image;

    Campground.create(
        { name: name, image: image },
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
    res.render("new.ejs");
});

// GET
app.get('/campgrounds/:id', function (req, res) {
    var id = req.params.id;
    Campground.findById(id)
        .exec()
        .then(result => {
            res.status(200).json(
                result
            );
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        })
});

app.listen(3000, () => {
    console.log('Yelp Camp server started!');
});