import { createApp } from "./config.js";

const app = createApp({
  user: "fabrap",
  host: "bbz.cloud",
  database: "fabrap",
  password: "dV+_qpU(Y5cyaMF/",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("home", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/home", async function (req, res) {
  res.render("home", {});
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/register", async function (req, res) {
  res.render("register", {});
});

app.get("/upload", async function (req, res) {
  res.render("upload", {});
});

app.get("/posts", async function (req, res) {
  res.render("posts", {});
});

app.get("/upload", async (req, res) => {
  const user = await login.loggedInUser(req);
  if (!user) {
    res.redirect("/login");
    return;
  }
  res.render("upload", { user: user });
});

/* Wichtig! Diese Zeilen müssen immer amSchluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
