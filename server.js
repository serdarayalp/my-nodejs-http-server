let http = require("http");
let url = require("url");
let qs = require("querystring");

let data = {
  1: {
    id: 1,
    title: "Superman",
    release: 2000,
  },
};

console.log(data);

let idCounter = 1;

http
  .createServer(function (req, res) {

    let method = req.method;
    let query = url.parse(req.url, true).query;

    let body = "";

    console.log(method + ": " + JSON.stringify(query));

    switch (method) {
      case "OPTIONS":
        res.writeHead(204, { Allow: "OPTIONS, GET, POST, PUT, DELETE" });
        res.end();
        break;
      case "GET":
        if (!query.id) {
          res.writeHead(200, { "Content-Type": "text/json" });
          res.end("{ids: " + JSON.stringify(Object.keys(data)) + "}");
        } else if (data[query.id]) {
          res.writeHead(200, { "Content-Type": "text/json" });
          res.end(JSON.stringify(data[query.id]));
        } else {
          res.writeHead(404);
          res.end();
        }
        break;
      case "POST":
        body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          if (body.length > 0) {
            console.log(body);
            let newData = qs.parse(body);
            console.log(newData);
            if (!(newData.title || newData.release || isNaN(newData.release))) {
              res.writeHead(400);
              res.end();
            } else {
              let newId = idCounter++;
              data[newId] = {
                id: newId,
                title: newData.title,
                release: newData.release,
              };
              res.writeHead(201, { "Content-Type": "text/json" });
              res.end(JSON.stringify({ id: newId }));
            }
          }
        });
        break;
      case "PUT":
        body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          if (body.length > 0) {
            console.log(body);
            let newData = qs.parse(body);
            console.log(newData);
            if (!(newData.title || newData.release || isNaN(newData.release))) {
              res.writeHead(400);
              res.end();
            } else if (data[newData.id]) {
              data[newData.id] = newData;
              res.writeHead(200, { "Content-Type": "text/json" });
              res.end();
            } else {
              let newId = idCounter++;
              data[newId] = {
                id: newId,
                title: newData.title,
                release: newData.release,
              };
              res.writeHead(201, { "Content-Type": "text/json" });
              res.end(JSON.stringify({ id: newId }));
            }
          }
        });
        break;
      case "DELETE":
        if (data[query.id]) {
          delete data[query.id];
          res.writeHead(204, { "Content-Type": "text/json" });
          res.end();
        } else {
          res.writeHead(404);
          res.end();
        }
        break;
      default:
        res.writeHead(405);
        break;
    }
  })
  .listen(8080);
