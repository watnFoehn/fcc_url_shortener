require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let storedUrls = [];
const setStoredUrls = (url, shortUrl) => {
  const newUrl = {original_url:url, shortened_url:shortUrl};
  storedUrls = [...storedUrls, newUrl];
}

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/


  

app.post('/api/shorturl', function(req, res) {
  // use regex to check valid http
  //Also, you can use the function dns.lookup(host, cb) from the //dns core module to verify a submitted URL.
  // find out what shortened url means in this context
  //save original_url and send user there if he clicks on short_url
  //handle error (invalid http) and return { error: 'invalid url' }
  const shortenedUrl = Math.floor(Math.random() * 10);
  const validation = dns.lookup(req.body.url, (url)=> {
    if(url && url.hostname){return url.hostname}
    return { error: 'invalid url' }
    });
  const urlValidator = regex.test(validation.hostname);
  if(!urlValidator){
    return res.json({ error: 'invalid url' })
  }
  setStoredUrls(req.body.url, shortenedUrl);
  res.json({ original_url: req.body.url, short_url: shortenedUrl });
console.log("inside post",storedUrls)
});


app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id;
  let urlToForward = [{original_url:""}];
  if(storedUrls.length > 0){
    storedUrls.map(url => {
    console.log("filter",url, id);
    if(url.shortened_url === id){
      res.redirect(url.original_url);
      };
    
    });
  }
  console.log("result",urlToForward);

  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
