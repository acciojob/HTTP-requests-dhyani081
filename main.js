// download.js
const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const urls = process.argv.slice(2);

// If no URLs are provided
if (urls.length === 0) {
  console.error('Error: No URLs provided');
  process.exit(1);
}

// Function to download a single URL
function download(url) {
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const filename = parsedUrl.hostname;

    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error: Failed to download ${url}`);
        res.resume();
        return;
      }

      const fileStream = fs.createWriteStream(filename);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded and saved: ${filename}`);
      });
    }).on('error', () => {
      console.error(`Error: Failed to download ${url}`);
    });
  } catch {
    console.error(`Error: Invalid URL ${url}`);
  }
}

// Process all URLs
urls.forEach(download);
