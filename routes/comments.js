var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware"); 

//comment new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//comment create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and  id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//COMMENTS - edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
                console.log(err);
            }else{
                res.render("Comments/edit", {campground: foundCampground, comment: foundComment});
            }
        }); 
    });
});

//comment - update route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
         if(err){
             res.redirect("back");
         }else{
             res.redirect("/campgrounds/"+req.params.id);
         }
     });
});

//delete comment
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove({_id:req.params.comment_id}, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});




module.exports = router;