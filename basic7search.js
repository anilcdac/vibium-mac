const fs = require('fs')
const { browserSync } = require('vibium')

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    try {
        console.log("--- STARTING ROBOT ---")

        // 1. Launch Browser (Visible Mode)
        const vibe = browserSync.launch({
            headless: false, 
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })

        // 2. Go to Wikipedia
        console.log('Navigating to Wikipedia...')
        vibe.go('https://www.wikipedia.org')
        await wait(2000) 

        // 3. TYPE "Ram"
        // We find the box first, then type into it
        console.log('Typing "Ram"...')
        // We use evaluate to safely set the value
        vibe.evaluate("document.getElementById('searchInput').value = 'Ram'")

        // 4. CLICK Search (THE FIX IS HERE)
        console.log('Locating Search button...')
        // We must FIND the button first
        const searchBtn = vibe.find('button[type="submit"]')
        
        console.log('Clicking button...')
        searchBtn.click()

        // 5. Wait for results
        console.log('Waiting for results page...')
        await wait(3000)

        // 6. Screenshot
        const png = vibe.screenshot()
        fs.writeFileSync('ram_page.png', png)
        console.log('Success! Saved "ram_page.png"')

        // 7. Close
        vibe.quit()
        console.log('Done!')

    } catch (error) {
        console.error("CRITICAL ERROR:", error.message)
        // If it fails, keep browser open so you can see why
        // vibe.quit() 
    }
}

main()
