// download.js
const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

// Get URLs from command-line arguments
const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error('Error: No URLs provided.');
  console.error('Usage: node download.js <url1> <url2> ...');
  process.exit(1);
}

// Function to download content
function download(url) {
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const filename = parsedUrl.hostname;

    console.log(`Downloading from: ${url}`);

    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${url}. Status Code: ${res.statusCode}`);
        res.resume(); // consume response to free up memory
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFile(filename, data, (err) => {
          if (err) {
            console.error(`Error writing file ${filename}: ${err.message}`);
          } else {
            console.log(`✅ Saved ${url} as ${filename}`);
          }
        });
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${url}: ${err.message}`);
    });

  } catch (error) {
    console.error(`Invalid URL: ${url}`);
  }
}

// Download all URLs
urls.forEach(download);
