'use strict';
//add a call to the Node.js require() method to import the basic-auth module
const auth = require('basic-auth');
const bcrypt = require('bcryptjs'); // for hashing passwords
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  let message;
  // Parse the user's credentials from the Authorization header.

  const credentials = auth(req);
  // If the user's credentials are available...
        // Attempt to retrieve the user from the data store
        // by their enmail 
        // from the Authorization header).
  if (credentials) {
    // If a user was successfully retrieved from the data store...
            // Use the bcrypt npm package to compare the user's password
            // (from the Authorization header) to the user's password
            // that was retrieved from the data store.
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });
  // If the passwords match...
            // Store the retrieved user object on the request object
            // so any middleware functions that follow this middleware function
            // will have access to the user's information.
      // If the passwords match
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        // Log a friendly message
        console.log(`Authentication successful for user ${user.firstName} ${user.lastName}`);
         // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for user ${user.firstName} ${user.lastName}`;
      }
    } else {
      message = 'User not found';
    }
  } else {
    message = 'Authorization header not found';
  }
 // If user authentication failed...
     // Return a response with a 401 Unauthorized HTTP status code. 
  if (message) {
    console.log(message);
    res.status(401).json({ message: 'Access Denied'});
  } else {
    next();
  }
} 