import express from "express";
// morgan: logger
import morgan from "morgan";
import cors from "cors";
import { nanoid } from "nanoid";
import handleServerSentEvents from "./sse";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors("dev"));

const stuff = [
  {
    id: nanoid(),
    from: "David",
    text: "handdoeken",
  },
  {
    id: nanoid(),
    from: "Tenzin",
    text: "badpak",
  },
  {
    id: nanoid(),
    from: "David",
    text: "boek",
  },
];

app.get("/stuff", (req, res) => {
  res.json(stuff);
});

// new Event stream
const clients = [];
app.get("/sse", handleServerSentEvents(stuff, clients));

function sendToAllClients() {
  clients.forEach((c) => c.res.write(`data: ${JSON.stringify(stuff)} \n\n`));
}

app.post("/stuff", (req, res) => {
  stuff.push({
    id: nanoid(),
    ...req.body,
  });
  res.json({ status: "success" });
  sendToAllClients();
});

app.listen("1234", function () {
  console.log("🚀 Server is listening on localhost:1234");
});
