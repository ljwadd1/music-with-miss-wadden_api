import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js'

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  

// TODO: Routing for...

// signup (../users/signup) - POST
router.post('/signup', async (req,res) => {
  // get uesr inputs
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

// login (../users/login)

// logout (../users/logout)

// get user session (../users/getSession)


export default router;