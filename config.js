import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bbz307 from "bbz307";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  const login = new bbz307.Login(
    "users",
    ["benutzername", "passwort", "vollername"],
    pool
  );

  // Registrieren überprüfen
  app.post("/register", upload.none(), async (req, res) => {
    const user = await login.registerUser(req);
    if (user) {
      res.redirect("/login");
      return;
    } else {
      res.redirect("/register");
      return;
    }
  });

  // Login überprüfen
  app.post("/login", upload.none(), async (req, res) => {
    const user = await login.loginUser(req);
    if (!user) {
      res.redirect("/login");
      return;
    } else {
      res.redirect("/home");
      return;
    }
    b;
  });

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.post("/posts", upload.single("headerfoto"), async function (req, res) {
    const user = await login.loggedInUser(req);
    await pool.query(
      "INSERT INTO posts (titel, hashtags, headerfoto) VALUES ($1, $2, $3)",
      [req.body.titel, req.body.hashtags, req.file.filename]
    );
    res.redirect("/");
  });

  app.post("/like/:id", async function (req, res) {
    const user = await login.loggedInUser(req);
    if (!user) {
      res.redirect("/login");
      return;
    }
    await app.locals.pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
      [req.params.id, user.id]
    );
    res.redirect("/");
  });

  app.locals.pool = pool;

  return app;
}

export { upload };
