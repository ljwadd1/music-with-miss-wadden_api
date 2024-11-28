import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, validatePassword } from '../lib/utility.js'

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  

// TODO: Routing for...

// signup (../users/signup) - POST
router.post('/signup', async (req,res) => {
  // get user inputs
  const { email, password, first_name, last_name } = req.body;

  // input validation to make sure fields are not null
  if(!email || !password || !first_name || !last_name) {
    return res.status(400).send('Missing required fields.');
  }

  // lookup user email in db to check for existing user
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email
    }
  });
  if(existingUser) {
    return res.status(400).send('User already exists.');
  }

  // validate user-generated pw against rules
  const validatedPassword = await validatePassword(password);
  if (!validatedPassword) {
    //JSON.parse(validatedPassword);
    //console.log(validatedPassword);
    return res.status(401).send('invalid password');  // 401: unauthorized
  }

  // encrypt password using bcrypt (no plaintext passwords allowed!!)
  const hashedPassword = await hashPassword(password);

  // add customer to db using prisma create
  const customer = await prisma.customer.create({
    data: {
      email: email,
      password: hashedPassword,
      first_name: first_name,
      last_name: last_name
    }
  });

  // send response
  res.json({ 'user' : email });
});


// login (../users/login) - POST
router.post('/login', async (req,res) => {
  // get user inputs
  const { email, password } = req.body;

  // validate inputs - no nulls allowed
  if(!email || !password) {
    return res.status(400).send('Missing required fields.');
  }

  // find user in database or return error message if non-existent
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(404).send('User not found.');
  }

  // compare/verify the password entered, match against the hashed password
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password.');  // 401: unauthorized
  }

  // if valid, setup user session data
  req.session.customer_id = existingUser.customer_id;
  req.session.email = existingUser.email;
  req.session.first_name = existingUser.first_name;
  req.session.last_name = existingUser.last_name;
  req.session.full_name = existingUser.first_name + ' ' + existingUser.last_name; // not required, but for my own use

  console.log('Logged in user: ' + req.session.full_name + '.');

  // send response
  res.send('Login successful. Hello, ' + req.session.full_name + '!' );
});


// logout (../users/logout)
router.post('/logout', (req, res) => {
  // check if a user is logged in - if not, return 401 'not logged in'
  if(req.session.email) {
    // destroy session cookie
    req.session.destroy();
    // send successful logout response
    res.send('Logout successful.');
  } else {
    //req.session.destroy();
    return res.status(401).send('Bad request: Not logged in.');
    
  }
})


// get user session (../users/getSession)
router.get('/getSession', (req, res) => {
  // if user is logged in, return user's session data as json (not including full name)
  if(req.session.email) {
    res.json({
      'customer_id': req.session.customer_id,
      'email': req.session.email,
      'first_name': req.session.first_name,
      'last_name': req.session.last_name
    });
  } else {
    // if user is not logged in, return 401 'not logged in'
    return res.status(401).send('Bad request: Not logged in.');
  }
})



export default router;