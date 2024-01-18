import express, { Express, Request, Response, NextFunction } from "express";
import errorMiddleware from "./middlewares/error.middleware";
import { ServerConfig } from "./config/config";
import { productionStage } from "./utils/constants";
import i18next from 'i18next';
import { englishLang } from "./assets/locale/en";
import { spanishLang } from "./assets/locale/es";
const config: ServerConfig = require('./config/config')
const helmet = require('helmet')
const cors = require('cors')
const app: Express = express()
const path = require("path")
// Routes
const userRoutes = require("./core/user/router/user.router");
const recipeRoutes = require("./core/recipe/router/recipe.router");

i18next.init({
  lng: 'es',
  // debug: true,
  resources: {
    es: { translation: spanishLang },
    en: { translation: englishLang }
  }
});
app.use(express.json())
app.use(cors({
  origin: [config.app.CLIENT_URL]
}))
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        config.auth0.ISSUER,
        "https://lh3.googleusercontent.com",
      ],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https: 'unsafe-inline'"],
      connectSrc: ["'self'", config.auth0.ISSUER_TOKEN],
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
if (process.env.NODE_ENV === productionStage) {
  app.get("/client/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "service-worker.js"));
  });
  app.use('/', express.static('client', { redirect: false }))
  app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('client/index.html'))
  })
}
app.use(errorMiddleware)

module.exports = app;