import express from 'express';
import cors from 'cors';
import session from 'express-session';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// cors middleware
app.use(cors({
  origin: 'http://localhost:5173',  // react client
  credentials: true                 // allow cookies
}));

// express-session middleware
app.use(session({
  secret: 'hjbby^we643gDrsdf#9Hjdh',  // basically a way to randomly encrypt session id (can be anything)
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,  // Set to `true` if using HTTPS in production
    sameSite: 'lax',  // Consider 'none' if client and server are on different origins
    maxAge: 3600000 // 1 hour in milliseconds
  }
}));

// routes
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});