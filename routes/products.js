import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  

// TODO: Routing for...

// get all products (../products/all)

// get product by id (../products/:id)

// purchase


export default router;