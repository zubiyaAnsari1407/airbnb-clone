const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js")


//controller 
const ReviewController = require("../controller/review.js");

//Create review Route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(ReviewController.createreview))

//Delete review Route 
router.delete("/:reviewId", 
  isLoggedIn,
isReviewAuthor,
    wrapAsync(ReviewController.destoryReview));

module.exports = router;