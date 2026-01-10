const fs = require('fs');
const { browserSync } = require('vibium');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- STARTING GOOGLE SEARCH ---');

		// 1. Launch Browser
		const vibe = browserSync.launch({ headless: false });

		// 2. Go to Google
		console.log('Navigating to Google...');
		vibe.go('https://google.com');
		await wait(2000);

		// 3. Find search box and type
		console.log('Typing "Apple iphone"...');
		const searchBox = vibe.find('textarea[name="q"]');
		searchBox.type('Apple iphone');
		await wait(1000);

		// 4. Try to find and click Google Search button
		console.log('Looking for Google Search button...');
		try {
			// Try multiple selectors for the search button
			const searchBtn = vibe.find('input[type="submit"]');
			searchBtn.click();
			console.log('Clicked Google Search button');
		} catch {
			// Fallback: use keyboard to submit
			console.log('Button not found, using keyboard submit...');
			vibe.evaluate("document.querySelector('textarea[name=\"q\"]').form.submit()");
		}
		await wait(3000);

		// 5. Find and click first result
		console.log('Finding first result...');
		const firstResult = vibe.find('div#search a');
		firstResult.click();
		console.log('Clicked first result');
		await wait(2000);

		// 6. Take screenshot
		console.log('Taking screenshot...');
		const png = vibe.screenshot();
		fs.writeFileSync('basic13-screenshot.png', png);
		console.log('Screenshot saved to basic13-screenshot.png');

		// 7. Close browser
		vibe.quit();
		console.log('Done!');

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();
