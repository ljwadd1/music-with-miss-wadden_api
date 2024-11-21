import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  

// get all products
router.get('/all', async (req, res) => {
  const products = await prisma.product.findMany();

  res.json(products);
})


// get product by id
router.get('/:product_id', async (req, res) => {
  // capture product id from request
  const prod_id = req.params.product_id;

  // validate id is an int - send bad response msg if not
  if(isNaN(prod_id)) {
    res.status(400).send('\n Bad request: Product id must be an integer.');
    return;
  }

  // if id is valid, find product by id
  const product = await prisma.product.findUnique({
    where: {
      product_id: parseInt(prod_id)
    }
  });

  // if id exists, return the record; if not, return 404
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('\n Error: No product with id of ' + prod_id + ' found.');
    return;
  }

})


// TODO: Routing for...
// purchase
router.post('/purchase', async (req, res) => {
  // Ensure user is logged in
  if (req.session.email) {
    //res.send('User is logged in');  // test
    const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart, invoice_amt, invoice_tax, invoice_total } = req.body; // should cart be separate?
  } else {
    return res.status(401).send('You must be logged in to make a purchase.');
  }

  // Check if cart is empty ??
  if (!cart) {
    return res.status(400).send('Your cart is empty.')
  }

  // Input validation
  if(!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !invoice_amt || !invoice_tax || !invoice_total) {
    return res.status(400).send('Bad request: All required fields must have a value.');
  }

  // If input is valid, create a new purchase
  const purchase = await prisma.purchase.create({
    data: {
      customer_id: req.session.customer_id,   // ?
      street: street,
      city: city,
      province: province,
      country: country,
      postal_code: postal_code,
      credit_card: credit_card,
      credit_expire: credit_expire,
      credit_cvv: credit_cvv,
      invoice_amt: invoice_amt,
      invoice_tax: invoice_tax,
      invoice_total: invoice_total
    }
  });

  res.json(purchase);


})


export default router;