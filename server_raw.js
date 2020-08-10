const http = require("http");

const server = http.createServer((request, response) => {
  response.statusCode = 200;

  response.setHeader("Content-Type", "text/html");
  response.write("<h1>Hello, World</>");
  response.end();
});

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
