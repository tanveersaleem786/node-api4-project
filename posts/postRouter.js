const express = require('express');

const router = express.Router();

const postDB = require("./postDb.js");




// Get Post
router.get('/', (req, res, next) => {
    
    postDB.get()
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => {
        next(error)
      })

});

// Get Post By ID
router.get('/:id', validatePostId(), (req, res) => {
   res.status(200).json(req.post)
});

// Delete Post By ID
router.delete('/:id', validatePostId(), (req, res, next) => {

  postDB.remove(req.params.id)
    .then((posts) => {
      res.json(posts)
    })
    .catch((error) => {
      next(error)
    })
  
});

// Update Post By ID
router.put('/:id',validatePost(), validatePostId(), (req, res, next) => {
    
    console.log(req.params.id+'=========='+req.body.text);
    postDB.update(req.params.id,req.body.text)
      .then((post) => {
        res.status(200).json(post)
      })
      .catch((error) => {
        next(error)
      })

});

// custom middleware

function validatePostId(req, res, next) {
  
    return (req, res, next) => {

      postDB.getById(req.params.id)
        .then((post) => {
          
          if(post) {

              req.post = post
              next()

          } else {
            
            res.status(404).json({message: "invalid post id"})
            res.json(post); 
          }
          
        })
        .catch((error) => {
            next(error)
        })

    }  


}

function validatePost(req, res, next) {
    
  return (req, res, next) => {
     
     if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    
       res.status(400).json({
         message: "missing post data"
       })
          
       
     } else if(!req.body.text) {

         res.status(400).json({
         message: "missing required text field"
         })

     } else {
       next()
     }


  }

}

module.exports = router;
