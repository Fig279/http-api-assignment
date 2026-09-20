// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {


  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });



  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};



const handleStatusCode = (request, response, parsedUrl) => {
  // default json message
  var responseJSON = {
    message: 'ERROR',
  };

  var statusCode;

  // find corect message and code
  switch (parsedUrl.pathname) {
    case '/success':
      statusCode = 200;
      responseJSON.message = "This is a successful response";

      break;
    case '/badRequest':
      statusCode = 400;
      responseJSON.message = "Missing valid query parameter set to true";
      responseJSON.id = 'badRequest';

      break;
    case '/unauthorized':
      statusCode = 401;
      responseJSON.message = "Missing logedIn query parameter set to yes";
      responseJSON.id = 'unauthorized';
      break;
    case '/forbidden':
      statusCode = 403;
      responseJSON.message = "You do not have access to this content";
      responseJSON.id = 'forbidden';
      break;
    case '/internal':
      statusCode = 500;
      responseJSON.message = "Internal Server Error. Something went wrong.";
      responseJSON.id = 'internalError';
      break;
    case '/notImplemented':
      statusCode = 501;
      responseJSON.message = "A request for this page has not been implemented yet. Check again later for updated content.";
      responseJSON.id = 'notImplemented';
      break;
    default:
      statusCode = 404;
      responseJSON.message = "The Page you were looking for was not found.";
      responseJSON.id = 'notFound';

      break;
  }



  respondJSON(request, response, statusCode, responseJSON)

}

// public exports
module.exports = {
  handleStatusCode,
};
