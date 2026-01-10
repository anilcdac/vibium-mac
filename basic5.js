const fs = require('fs');
const { browserSync } = require('vibium');

async function main() {
    // 1. Launch the browser
    const vibe = browserSync.launch();

    // 2. Go to Google
    await vibe.go('https://www.google.com');
    console.log('Opened Google');

    // 3. Type your search query
    // Google's search box uses the name 'q'
    const input = vibe.find('input[name="q"]');
    input.type('Node.js automation tutorials');
    console.log('Typed search query');

    // 4. Press Enter to search
   // Find the "Google Search" button and click it
    // Usually, the button has the name 'btnK'
    const searchButton = vibe.find('input[name="btnK"]');
    searchButton.click();
    console.log('Clicked Search Button');
    // 5. Wait for results to load
    vibe.wait(3000);

    // 6. Take a screenshot of the results
    const png = vibe.screenshot();
    fs.writeFileSync('google_search.png', png);
    console.log('Saved google_search.png');

    // 7. Scrape the first result title (usually an h3 tag)
    const firstResult = vibe.find('h3');
    console.log('--- Top Result ---');
    console.log('Title:', firstResult.text());

    console.log('Done!');
    
    // This will close the browser and give you your terminal path back!
    vibe.close(); 
}

main();