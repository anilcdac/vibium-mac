const fs = require('fs')
const { browserSync } = require('vibium')

// Launch a browser (you'll see it open!)
const vibe = browserSync.launch()

// Go to a website
vibe.go('https://example.com')
console.log('Loaded example.com')

// Take a screenshot
const png = vibe.screenshot()
fs.writeFileSync('screenshot.png', png)
console.log('Saved screenshot.png')

// Find and click the link
const link = vibe.find('a')
console.log('Found link:', link.text())
link.click()
console.log('Clicked!')

// Close the browser
vibe.quit()
console.log('Done!')