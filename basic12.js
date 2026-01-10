const fs = require('fs');
const { browserSync } = require('vibium');

// Launch a browser
const vibe = browserSync.launch();

// Go to the website
vibe.go('https://example.com');
console.log('Opened: https://example.com');

// Take a screenshot
const png = vibe.screenshot();
fs.writeFileSync('basic12-screenshot.png', png);
console.log('Screenshot saved to basic12-screenshot.png');

// Close the browser
vibe.quit();
console.log('Done!');
