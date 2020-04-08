var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// GET
router.get('/', function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

// NEW
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

// CREATE
router.post('/', middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description
    var newCampground = {
        name: name,
        image: image,
        price: price,
        description: description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            req.flash('error', 'Something went wrong.')
            console.log(err);
        } else {
            req.flash('success', 'Successfully added campground.')
            res.redirect('/campgrounds');
        }
    }
    );
});

// SHOW
router.get('/:id', function (req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function (err, campground) {
            if (err || !campground) {
                console.log(err);
                req.flash('error', 'Something went wrong.');
                res.redirect('/campgrounds');
            } else {
                res.render('campgrounds/show', { campground: campground });
            }
        });
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        res.render('campgrounds/edit', { campground: campground });
    });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.deleteMany({_id: campground.comments }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('back');
                }
            });
        }
    });
    // Campground.findByIdAndRemove(req.params.id, function (err) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect('/campgrounds');
    //     } else {
    //         req.flash('success', 'Campground deleted.')
    //         res.redirect('/campgrounds');
    //     }
    // });
});


module.exports = router;