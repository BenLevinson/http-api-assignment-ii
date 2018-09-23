const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const res = response;
    const body = [];
      
    request.on('error', (err) => {
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk); 
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addUser(request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  switch(request.method) {
    case 'GET':
        if(parsedUrl.pathname === '/') {
            htmlHandler.getIndex(request, response);
        } else if(parsedUrl.pathname === '/style.css') {
            htmlHandler.getCSS(request, response);
        } else if(parsedUrl.pathname === '/getUsers') {
            jsonHandler.getUsers(request, response);
        } else if(parsedUrl.pathname === '/notReal') {
            jsonHandler.notFound(request, response);
        } else {
            jsonHandler.notFound(request, response);
        }
        break;
    case 'HEAD':
        if(parsedUrl.pathname === '/getUsers') {
            jsonHandler.getUsersMeta(request, response);
        } else if(parsedUrl.pathname === '/notReal') {
            jsonHandler.notFoundMeta(request, response);
        } else {
            jsonHandler.notFoundMeta(request, response);
        }
        break;
    case 'POST':
        if(parsedUrl.pathname === '/addUser') {
            handlePost(request, response, parsedUrl);
        }
        else {
            jsonHandler.notFound(request, response);
        }
        break;
  }
 
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
