const http = require('http'); // pull in http module
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
  else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  }
  // for XML responses
  else if (request.headers.accept === 'text/xml') {
    xmlHandler.handleStatusCode(request, response, parsedUrl);
  }
  // default to JSON
  else {
    //htmlHandler.getIndex(request, response);
    jsonHandler.handleStatusCode(request, response, parsedUrl)
  }
};

const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
