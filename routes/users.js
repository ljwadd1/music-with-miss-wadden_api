import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  

// TODO: Routing for...

// signup (../users/signup)

// login (../users/login)

// logout (../users/logout)

// get user session (../users/getSession)


export default router;