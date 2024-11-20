import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  

// TODO: Routing for...

// get all products (../products/all)
router.get('/all', async (req, res) => {
  const products = await prisma.product.findMany();

  res.json(products);
})

// get product by id (../products/:id)

// purchase


export default router;