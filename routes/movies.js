const router = require("express").Router();
const Movie = require("../models/Movie");
const Verify = require("../verifyToken");

router.post("/", Verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const saveMovie = await newMovie.save();
      res.status(200).json(saveMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(201).json("you are not allowed");
  }
});

//updated movie

router.put("/:id", Verify, async (req, res) => {
  if (req.user.id) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        {
          new: true,
        }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(201).json(err);
    }
  } else {
    res.status(404).json("you can update only your id movie");
  }
});

//Delete movie

router.delete("/:id", Verify, async (req, res) => {
  if (req.user.id) {
    try {
       await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("the movie has been deleted");
    } catch (err) {
      res.status(201).json(err);
    }
  } else {
    res.status(404).json("you can are not allowed");
  }
});
//Get
router.get("/find/:id", Verify, async (req, res) => {
   
      try {
       const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
      } catch (err) {
        res.status(201).json(err);
      }
    });

    //get random
    router.get("/random", Verify, async (req, res) => {
           const type = req.query.type;
           let movie;
        try {
            if(type === 'series'){
                movie = await Movie.aggregate([
                    {$match: {isSeries:true}},
                    {$sample: {size: 1}},
                ])
            }else{
                movie = await Movie.aggregate([
                    {$match: {isSeries:false}},
                    {$sample: {size: 1}},
                ])
            }
            res.status(200).json(movie)
        
        } catch (err) {
          res.status(201).json(err);
        }
      });
      router.get("/", Verify, async (req, res) => {
        if (req.user.id) {
          try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
          } catch (err) {
            res.status(500).json(err);
          }
        } else {
          res.status(403).json("You are not allowed!");
        }
      });

module.exports = router;
