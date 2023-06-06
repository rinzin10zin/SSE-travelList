export default (stuff, clients) => (req, res) => {
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
};

export const config = {
  runtime: "edge",
};
