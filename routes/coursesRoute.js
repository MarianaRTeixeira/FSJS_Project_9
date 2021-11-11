'use strict';

const express = require('express');
const { Courses } = require('../models');
const { User } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const user = require('../models/user');
const router = express.Router();

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}
//A /api/courses GET route that will return all courses including the User associated with each course and a `200` HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Courses.findAll({
    include: [{
      model: User,
    }]
  })
  res.status(200).json(courses);
})
);

//A /api/:id GET route that will return the corresponding course including the User associated with that course and a `200` HTTP status code.
router.get('/courses/:id', asyncHandler(async(req, res)=>{
  const course = await Courses.findByPk(req.params.id) 
   res.status(200)
   res.json(course)
   req.end();
}))

/**
 * A `/api/courses` POST route that will create a new course,
 * set the `Location` header to the URI for the newly created course, 
 * return a `201` HTTP status code and no content.
 */
 router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  try {
      const course = await Courses.create(req.body);
      if(course.userId == req.currentUser.id){ 
          res.location(`/courses/${course.id}`);
          res.status(201); // a new resource being created
          res.end();// end the response without any data
      } else {
          res.status(401); //The request requires user authentication. 
          res.end();
          }

  } catch(error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') { 
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
      } else {
          throw error;
      } 
    }
}))

//A `/api/courses/:id` PUT route that will update the corresponding course 
//return a `204` HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async(req,res)=> {
  try {
      const course = await Courses.findByPk(req.params.id);
      if(course) {
       if(course.userId == req.currentUser.id) { //check if the user that wants to update the course is the same current user
          await course.update(
              { //uptdade the 2 fields required
                  title: req.body.title, 
                  description: req.body.description
              }
          )
          res.status(204); //The server has fulfilled the request but does not need to return an entity-body
          res.end();
          }
      } else {
          res.status(404);
          res.end();
      }
  }
  catch(error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') { 
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
      } else {
          throw error;
      }
      
  }
}))

//A `/api/courses/:id` `DELETE` route that will delete the corresponding course 
// return a `204` HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req,res)=>{
  const course = await Courses.findByPk(req.params.id);
      if(course) {
          await Courses.destroy(
            { where:
              {
                id: req.params.id //the right course to be deleted
              }
            })
          res.status(204),
          res.end()  
      } else {
          res.status(404);
          res.end();
      }
  } 
  
))
module.exports = router;