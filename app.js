import express from "express";
// morgan: logger
import morgan from "morgan";
import cors from "cors";
import { nanoid } from "nanoid";

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
app.get("/sse", (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  const data = `data: ${JSON.stringify(stuff)} \n\n`;
  res.write(data);

  const client = {
    time: Date.now(),
    name: req.query.name,
  };
  clients.push({
    ...client,
    res: res,
  });

  setInterval(() => {
    if (clients.length > 0) {
      res.write(`data \n\n`);
    }
  }, 5000);

  req.on("close", () => {
    console.log(`Connection closed from ${client.name}`);
    clients.splice(clients.findIndex((c) => c.time === client.time));
  });
});

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
