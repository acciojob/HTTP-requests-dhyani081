// download.js
const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const urls = process.argv.slice(2);

// Case 1: No URLs provided
if (urls.length === 0) {
  console.error('Error: No URLs provided');
  process.exit(1);
}

urls.forEach((url) => {
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const filename = parsedUrl.hostname + '.txt'; // must save as .txt

    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error: Failed to download ${url}`);
        res.resume();
        return;
      }

      const file = fs.createWriteStream(filename);
      res.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded and saved: ${filename}`);
      });
    }).on('error', () => {
      console.error(`Error: Failed to download ${url}`);
    });
  } catch (err) {
    console.error(`Error: Invalid URL ${url}`);
  }
});
