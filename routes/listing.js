const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controller/listing.js"); //Controller
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//router.route() to combine routes with same path and different methods(like get, post, put, delete) 
// to make code cleaner and more readable
router
.route("/")
.get(wrapAsync(ListingController.index))//Index Route
// .post(validateListing,
//     isLoggedIn,
//     wrapAsync(ListingController.createListing)) //create route 
.post(upload.single('listing[image][url]'),(req,res)=>{
    res.send(req.file);
});
    
//New Route 
router.get("/new", isLoggedIn,ListingController.renderNewForm);

router.route("/:id")
.put( validateListing,
      isLoggedIn,
      isOwner,
    wrapAsync(ListingController.updateListing)) //update route
.get( wrapAsync(ListingController.showListing)) //show route
.delete(isLoggedIn,
     isOwner,
    wrapAsync(ListingController.destroyListing)); //delete route



//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(ListingController.renderEditForm));



module.exports = router;