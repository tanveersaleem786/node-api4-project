const express = require('express');
const userDB = require('./userDb.js');
const postDB = require('../posts/postDb.js')

const router = express.Router();

// Create New User
router.post('/', validateUser(), (req, res, next) => {  
        
    userDB.insert(req.body) 
      .then((user) => {
        res.status(201).json(user)
      })
      .catch((error) => {
        next(error)
      })   

});


// Create New Post By User ID
router.post('/:id/posts', validatePost(), validateUserId() ,(req, res, next) => {
  
     const user_id = req.params.id 
    // const { text } = req.body;
    // const { id: user_id } = req.params;
    // insert({ text, user_id })
    req.body = {...req.body, "user_id": user_id}
    //console.log(req.body);
    postDB.insert(req.body)
      .then((post) => {
        res.status(201).json(post)
      })
      .catch((error) => {
        next(error)
      })    
        
});


// Get Users
router.get('/', (req, res, next) => {
    
    userDB.get()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        next(error)
      })
  
});

// Get User By ID
router.get('/:id', validateUserId(), (req, res) => {    
    res.status(200).json(req.user)    
});

// Get User Posts By User ID
router.get('/:id/posts', validateUserId(), (req, res, next) => {
  
    userDB.getUserPosts(req.params.id)
      .then((posts) => {
        res.json(posts)
      })
      .catch((error) => {
        next(error)
      })

});


// Delete User By ID
router.delete('/:id', (req, res, next) => {
  
    userDB.remove(req.params.id)
      .then((users) => {
        res.json(users)
      })
      .catch((error) => {
        next(error)
      })

});


// Update User By ID
router.put('/:id', validateUser(), validateUserId(), (req, res, next) => {
 
    userDB.update(req.params.id,req.body)
      .then((user) => {
        res.status(200).json(user)
      })
      .catch((error) => {
        next(error)
      })
   

});


//custom middleware

function validateUserId(req, res, next) {
  
    return (req, res, next) => {

      userDB.getById(req.params.id)
        .then((user) => {
          
          if(user) {

              req.user = user
              next()

          } else {
             
             res.status(404).json({message: "invalid user id"})
             res.json(user); 
          }
          
        })
        .catch((error) => {
            next(error)
        })

    }  
  
  
}

function validateUser(req, res, next) {

    return (req, res, next) => {
       
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {

            res.status(400).json({
              message: "missing user data"
            })

        } else if(!req.body.name) {
           
            res.status(400).json({
              message: "missing required name field"
            })

        } else {
          next()
        }
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
