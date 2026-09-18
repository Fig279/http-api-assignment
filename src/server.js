const http = require('http'); // pull in http module
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Recompiles the body of a request, and then calls the
// appropriate handler once completed
const parseBody = (request, response, handler) => {
  console.log("parseBody");

  // pieces of the request are stored here
  const body = [];

  // If there is an error write it to the console and send
  // back a 400-Bad Request error
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // fired when we get a piece (or "chunk") of the body
  // always recieve these chunks in the correct order.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // request is finished sending and we have recieved the information
  // When the request "ends", we can proceed
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const type = request.headers['content-type'];
    // xml
    if (type === 'application/x-www-form-urlencoded') {
      request.body = query.parse(bodyString);
    } else if (type === 'application/json') {
      // JSON
      request.body = JSON.parse(bodyString);
    } else {
      // neither format = error
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ error: 'invalid data format' }));
      return response.end();
    }

    // call the handler with the bodyparams
    // proceed much like we would with a GET request.
    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  console.log("handlePost");

  // If they go to /addUser
  if (parsedUrl.pathname === '/addUser') {
    // Call our below parseBody handler, and in turn pass in the
    // jsonHandler.addUser function as the handler callback function.
    parseBody(request, response, jsonHandler.addUser);
  }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  console.log("handleGet");
  console.log(parsedUrl)

  // route to correct method based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } 
  else if(parsedUrl.pathname === '/success'){
    
  }
  else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  console.log("onRequest");
  // parse url into individual parts
  // returns an object of url parts by name
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // check if method was POST or GET
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
