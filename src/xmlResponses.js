// function to respond with an xml string
// takes request, response, status code and object to send
const respondXML = (request, response, status, object) => {
  // build a simple <response> root element with a child element
  // for each key in the object
  let content = '<response>';

  Object.keys(object).forEach((key) => {
    content += `<${key}>${object[key]}</${key}>`;
  });

  content += '</response>';

  response.writeHead(status, {
    'Content-Type': 'application/xml',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }
  console.log(content);

  response.end();
};


const handleStatusCode = (request, response, parsedUrl) => {
  // default xml message
  var responseXML = {
    message: 'ERROR',
  };

  var statusCode;

  // find correct message and code
  switch (parsedUrl.pathname) {
    case '/success':
      statusCode = 200;
      responseXML.message = "This is a successful response";

      break;
    case '/badRequest':
      statusCode = 400;
      responseXML.message = "Missing valid query parameter set to true";
      responseXML.id = 'badRequest';

      break;
    case '/unauthorized':
      statusCode = 401;
      responseXML.message = "Missing logedIn query parameter set to yes";
      responseXML.id = 'unauthorized';
      break;
    case '/forbidden':
      statusCode = 403;
      responseXML.message = "You do not have access to this content";
      responseXML.id = 'forbidden';
      break;
    case '/internal':
      statusCode = 500;
      responseXML.message = "Internal Server Error. Something went wrong.";
      responseXML.id = 'internalError';
      break;
    case '/notImplemented':
      statusCode = 501;
      responseXML.message = "A request for this page has not been implemented yet. Check again later for updated content.";
      responseXML.id = 'notImplemented';
      break;
    default:
      statusCode = 404;
      responseXML.message = "The Page you were looking for was not found.";
      responseXML.id = 'notFound';

      break;
  }

  respondXML(request, response, statusCode, responseXML)

}

module.exports = {
  handleStatusCode,
};