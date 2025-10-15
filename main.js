// download.js
const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const urls = process.argv.slice(2);

// ✅ Handle no URLs case
if (urls.length === 0) {
  console.error('Error: No URLs provided');
  process.exit(1);
}

// ✅ Function to download a single URL
function download(url) {
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const filename = parsedUrl.hostname;

    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error: Failed to download ${url} (Status Code: ${res.statusCode})`);
        res.resume();
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFile(filename, data, (err) => {
          if (err) {
            console.error(`Error: Unable to write file ${filename}`);
          } else {
            console.log(`Downloaded and saved: ${filename}`);
          }
        });
      });
    }).on('error', (err) => {
      console.error(`Error: Failed to download ${url} (${err.message})`);
    });
  } catch (err) {
    console.error(`Error: Invalid URL ${url}`);
  }
}

// ✅ Loop through URLs
urls.forEach(download);
