const fs = require('fs');
const http = require('http');
const https = require('https');

const urls = process.argv.slice(2);

urls.forEach((url) => {
  const protocol = url.startsWith('https') ? https : http;
  const options = { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } };

  protocol.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      // TODO: Write the data to a file with the hostname as the filename
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err}`);
  });
});
