// button click
const fs = require('fs')
const { browserSync } = require('vibium')

// Launch a browser (you'll see it open!)
const vibe = browserSync.launch()

// Go to a website
vibe.go('https://caloriecalculatoronline.com/')
console.log('Loaded caloriecalculatoronline.com')

// Take a screenshot
const png = vibe.screenshot()
fs.writeFileSync('screenshot.png', png)
console.log('Saved screenshot.png')

//Click Demo button
const demoButton = vibe.find('#demoLoss')
console.log('Found button:', demoButton.text())
demoButton.click()
console.log('Clicked Demo button!')

// Close the browser
vibe.quit()
console.log('Done!')