const fs = require('fs');
const { browserSync } = require('vibium');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- SWITCH WINDOW EXAMPLE ---');

		// 1. Launch Browser
		const vibe = browserSync.launch({ headless: false });

		// 2. Navigate to the page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		await wait(3000);

		// 3. Take initial screenshot
		console.log('Taking initial screenshot...');
		const png1 = vibe.screenshot();
		fs.writeFileSync('basic15-screenshot-initial.png', png1);
		console.log('Initial screenshot saved');
		await wait(1000);

		// 4. Get initial window title
		console.log('\n=== INITIAL WINDOW INFO ===');
		const initialTitle = vibe.evaluate('return document.title');
		console.log('Initial Window Title:', initialTitle);
		const initialUrl = vibe.evaluate('return window.location.href');
		console.log('Initial Window URL:', initialUrl);
		console.log('=== END INITIAL INFO ===\n');

		// 5. Find and click "Open Window" button
		console.log('Looking for "Open Window" button...');
		try {
			// Find the button with "Open Window" text
			const openWindowIndex = vibe.evaluate(`
				let allElements = document.querySelectorAll('button, input[type="button"]');
				for(let i = 0; i < allElements.length; i++) {
					let text = (allElements[i].textContent || allElements[i].value || '').trim();
					if(text.includes('Open Window')) {
						return i;
					}
				}
				return -1;
			`);
			
			const btnIndex = openWindowIndex.value !== undefined ? openWindowIndex.value : openWindowIndex;
			console.log('Open Window button found at index:', btnIndex);
			
			if (btnIndex >= 0) {
				// Get the onclick handler to see what URL will be opened
				const onclickHandler = vibe.evaluate(`
					let allElements = document.querySelectorAll('button, input[type="button"]');
					return allElements[${btnIndex}].getAttribute('onclick');
				`);
				
				const handler = onclickHandler.value || onclickHandler;
				console.log('Button onclick handler:', handler);
				
				// Click the button
				const clickResult = vibe.evaluate(`
					let allElements = document.querySelectorAll('button, input[type="button"]');
					allElements[${btnIndex}].click();
					return "Clicked";
				`);
				console.log('Button clicked successfully');
				await wait(3000);
			}
		} catch (e) {
			console.log('Failed to find/click button:', e.message);
		}

		// 6. Get window information after clicking
		console.log('\n=== WINDOW INFORMATION AFTER CLICK ===');
		const windowInfo = vibe.evaluate(`
			return {
				title: document.title,
				url: window.location.href,
				windowName: window.name,
				allText: document.body.innerText.substring(0, 200)
			};
		`);
		
		const winData = windowInfo.value || windowInfo;
		console.log('Window Title:', winData.title);
		console.log('Window URL:', winData.url);
		console.log('Window Name:', winData.windowName || '(empty/main)');
		console.log('\n=== PAGE CONTENT (First 200 chars) ===');
		console.log(winData.allText);
		console.log('=== END PAGE CONTENT ===\n');

		// 7. Take screenshot
		console.log('Taking screenshot after button click...');
		const png2 = vibe.screenshot();
		fs.writeFileSync('basic15-screenshot-after-click.png', png2);
		console.log('Screenshot saved');
		await wait(1000);

		// 8. Close browser
		vibe.quit();
		console.log('Done! Screenshots saved:');
		console.log('  - basic15-screenshot-initial.png');
		console.log('  - basic15-screenshot-after-click.png');

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();

