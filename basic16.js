const fs = require('fs');
const { browserSync } = require('vibium');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- SWITCH TAB EXAMPLE ---');

		// 1. Launch Browser
		const vibe = browserSync.launch({ headless: false });

		// 2. Navigate to the page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		await wait(3000);

		// 3. Take initial screenshot
		console.log('Taking initial screenshot...');
		const png1 = vibe.screenshot();
		fs.writeFileSync('basic16-screenshot-initial.png', png1);
		console.log('Initial screenshot saved\n');

		// 4. Get initial page info
		console.log('=== INITIAL PAGE INFO ===');
		const initialTitle = vibe.evaluate('return document.title');
		console.log('Page Title:', initialTitle);
		const initialUrl = vibe.evaluate('return window.location.href');
		console.log('Page URL:', initialUrl);
		console.log('=== END INITIAL INFO ===\n');

		// 5. Find and click "Open Tab" button/link
		console.log('Searching for "Open Tab" element...');
		try {
			// Get all elements with text content
			const tabElements = vibe.evaluate(`
				let found = [];
				document.querySelectorAll('*').forEach(el => {
					let text = el.textContent;
					if(text && text.includes('Open Tab') && text.length < 100) {
						found.push({
							tag: el.tagName,
							text: text.trim().substring(0, 50),
							class: el.className,
							id: el.id,
							onclick: el.getAttribute('onclick')
						});
					}
				});
				return found;
			`);
			
			console.log('Elements containing "Open Tab":', tabElements);
			
			// Click the button - try different selectors
			const clickResult = vibe.evaluate(`
				// Try finding by text and clicking parent if needed
				let elements = document.querySelectorAll('a, button, input[type="button"], [onclick*="Tab"]');
				for(let el of elements) {
					if(el.textContent.includes('Open Tab')) {
						el.click();
						return 'Clicked ' + el.tagName + ': ' + el.textContent.substring(0, 30);
					}
				}
				return 'Not found with click attempt';
			`);
			
			console.log('Click result:', clickResult);
			await wait(2000);
			
		} catch (e) {
			console.log('Error:', e.message);
		}

		// 6. Get page info after clicking
		console.log('\n=== PAGE INFO AFTER ACTION ===');
		const afterTitle = vibe.evaluate('return document.title');
		console.log('Page Title:', afterTitle);
		const afterUrl = vibe.evaluate('return window.location.href');
		console.log('Page URL:', afterUrl);
		
		// Get page heading
		const heading = vibe.evaluate('return document.querySelector("h1, h2, h3") ? document.querySelector("h1, h2, h3").textContent : "No heading"');
		console.log('Main Heading:', heading);
		
		// Get some page content
		const content = vibe.evaluate('return document.body.innerText.substring(0, 200)');
		console.log('\nPage Content (first 200 chars):');
		console.log(content);
		console.log('=== END PAGE INFO ===\n');

		// 7. Take screenshot after click
		console.log('Taking screenshot after clicking button...');
		const png2 = vibe.screenshot();
		fs.writeFileSync('basic16-screenshot-after-tab.png', png2);
		console.log('Screenshot saved');

		// 8. Close browser
		vibe.quit();
		console.log('\nDone! Screenshots saved:');
		console.log('  - basic16-screenshot-initial.png');
		console.log('  - basic16-screenshot-after-tab.png');

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();
