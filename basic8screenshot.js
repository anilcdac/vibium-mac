const fs = require('fs')
const { browserSync } = require('vibium')

// 1. HELPER: A function to pause the code for X milliseconds
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    try {
        // 2. Launch Browser
        const vibe = browserSync.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })

        // 3. Go to Wikipedia
        console.log('Navigating to Wikipedia...')
        vibe.go('https://www.wikipedia.org')
        
        // --- WAIT 2 SECONDS ---
        console.log('Waiting for page to load...')
        await wait(2000) 

        // 4. Type "Ram"
        console.log('Typing "Ram"...')
        vibe.type('#searchInput', 'Ram')

        // 5. Click Search
        console.log('Clicking Search...')
        // Wikipedia's search button class usually works with this:
        vibe.click('button[type="submit"]') 

        // --- WAIT 3 SECONDS ---
        console.log('Waiting for results...')
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
    }
}

main()
