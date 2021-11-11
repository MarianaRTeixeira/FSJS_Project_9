'use strict';

const express = require('express');
const { User } = require('../models');
//const { Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');

const router = express.Router();


// This array is used to keep track of user records
// as they are created.
const user = [];

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }

//GET route that will return all properties and values for the currently authenticated User along with a `200` HTTP status code.
router.get('/users', authenticateUser, asyncHandler(async(req, res)=>{
  const user = req.currentUser;
  res.status(200),
  res.json(user)
}))

//POST route that will create a new user, set the `Location` header to "/", and return a `201` HTTP status code and no content.
//Extra credit: check for and handle `SequelizeUniqueConstraintError`errors ;
//Extra credit: if `SequelizeUniqueConstraintError` is thrown a `400` HTTP status code and an error message should be returned.

router.post('/users', asyncHandler(async(req,res)=> {
  try{
     const user = await User.create(req.body);
      res.location('/'); //set location header
      res.status(201); //set up the 201 response and end the response process - 
      res.end();// end the response without any data
  } catch(error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') { 
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
  }))

  module.exports = router;