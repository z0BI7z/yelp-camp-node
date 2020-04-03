var express = require('express');
var app = express()
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


var campgrounds = [
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8605/16573646931_22fc928bf9_o.jpg"},
    {name: "Granite Hill", image: "https://q9m3bv0lkc15twiiq99aa1cy-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/TENT.jpeg"},
    {name: "Mountain Goat", image: "https://www.planetware.com/wpimages/2019/10/montana-glacier-national-park-best-campgrounds-fish-creek-campground.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8605/16573646931_22fc928bf9_o.jpg"},
    {name: "Granite Hill", image: "https://q9m3bv0lkc15twiiq99aa1cy-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/TENT.jpeg"},
    {name: "Mountain Goat", image: "https://www.planetware.com/wpimages/2019/10/montana-glacier-national-park-best-campgrounds-fish-creek-campground.jpg"},
]


app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, () => {
    console.log('Yelp Camp server started!');
});