import express, { Express, Request, Response, NextFunction } from "express";
import errorMiddleware from "./middlewares/error.middleware";
const config = require('./config/config')
const helmet = require('helmet')
const cors = require('cors')
const app: Express = express()
const path = require("path")
// const errorMiddleware = require('./middlewares/error.middleware')
// const fileUpload = require('express-fileupload')
// Routes
const userRoutes = require("./router/user.router");
const recipeRoutes = require("./router/recipe.router");

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5175']
}))
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        "https://dev-qgjlr8hrde6g23pf.us.auth0.com",
        "https://lh3.googleusercontent.com",
      ],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https: 'unsafe-inline'"],
      connectSrc: ["'self'", "https://dev-qgjlr8hrde6g23pf.us.auth0.com/oauth/token"],
      "img-src": ["'self'", "https: data:"],
      upgradeInsecureRequests: [],
    },
  },
}))
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Cross-Origin-Embedder-Policy", "cross-origin")
  next()
})
app.use(`/api/${config.app.API_VERSION}`, userRoutes);
app.use(`/api/${config.app.API_VERSION}`, recipeRoutes);
if (process.env.NODE_ENV === 'production') {
  app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "service-worker.js"));
  });
  app.use('/', express.static('client', { redirect: false }))
  app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('client/index.html'))
  })
}
app.use(errorMiddleware)

module.exports = app;