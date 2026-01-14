const fs = require('fs');
const { browserSync } = require('vibium');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- SWITCH TO ALERT EXAMPLE ---');

		// 1. Launch Browser
		const vibe = browserSync.launch({ headless: false });

		// 2. Navigate to the page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		await wait(3000);

		// 3. Take initial screenshot
		console.log('Taking initial screenshot...');
		const png1 = vibe.screenshot();
		fs.writeFileSync('basic17-screenshot-initial.png', png1);
		console.log('Initial screenshot saved\n');

		// 4. Get initial page info
		console.log('=== INITIAL PAGE INFO ===');
		const initialTitle = vibe.evaluate('return document.title');
		console.log('Page Title:', initialTitle);
		const initialUrl = vibe.evaluate('return window.location.href');
		console.log('Page URL:', initialUrl);
		console.log('=== END INITIAL INFO ===\n');

		// 5. Find and click alert button
		console.log('Looking for alert-related elements...');
		try {
			// Get all elements containing "Alert" text
			const alertElements = vibe.evaluate(`
				let found = [];
				document.querySelectorAll('*').forEach(el => {
					let text = el.textContent;
					if(text && text.includes('Alert') && text.length < 100) {
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
			
			console.log('Elements containing "Alert":', alertElements);
			
			// Find alert button/link and get its onclick handler
			const alertButtonInfo = vibe.evaluate(`
				let elements = document.querySelectorAll('a, button, input[type="button"], [onclick*="alert"]');
				for(let el of elements) {
					if(el.textContent.includes('Alert')) {
						return {
							tag: el.tagName,
							text: el.textContent.substring(0, 50),
							onclick: el.getAttribute('onclick')
						};
					}
				}
				return { tag: 'not-found', text: 'no alert element found' };
			`);
			
			console.log('Alert button info:', alertButtonInfo);
			
		} catch (e) {
			console.log('Error searching for alert elements:', e.message);
		}

		// 6. Try to interact with alert
		console.log('\n=== ATTEMPTING ALERT INTERACTION ===');
		try {
			// Set up alert listener before clicking
			const alertInfo = vibe.evaluate(`
				window.alertMessage = null;
				window.originalAlert = window.alert;
				
				// Override alert to capture message
				window.alert = function(msg) {
					window.alertMessage = msg;
					console.log('Alert captured:', msg);
					return true;
				};
				
				// Find and click alert button
				let elements = document.querySelectorAll('a, button, input[type="button"]');
				for(let el of elements) {
					if(el.textContent.includes('Alert')) {
						el.click();
						break;
					}
				}
				
				// Return alert message if captured
				return window.alertMessage;
			`);
			
			const capturedAlert = alertInfo.value || alertInfo;
			console.log('Alert Message:', capturedAlert);
			
			await wait(1500);
			
			// Restore original alert
			vibe.evaluate('window.alert = window.originalAlert');
			
		} catch (e) {
			console.log('Error during alert interaction:', e.message);
		}

		// 7. Get page info after alert
		console.log('\n=== PAGE INFO AFTER ALERT ===');
		const afterTitle = vibe.evaluate('return document.title');
		console.log('Page Title:', afterTitle);
		const afterUrl = vibe.evaluate('return window.location.href');
		console.log('Page URL:', afterUrl);
		
		// Get page heading
		const heading = vibe.evaluate('return document.querySelector("h1, h2, h3") ? document.querySelector("h1, h2, h3").textContent : "No heading"');
		console.log('Main Heading:', heading);
		
		// Get some page content
		const content = vibe.evaluate('return document.body.innerText.substring(0, 250)');
		console.log('\nPage Content (first 250 chars):');
		console.log(content);
		console.log('=== END PAGE INFO ===\n');

		// 8. Find other alert test inputs
		console.log('Looking for alert test inputs/fields...');
		try {
			const inputs = vibe.evaluate(`
				let inputInfo = [];
				document.querySelectorAll('input[type="text"], input[type="button"], input[type="submit"]').forEach((inp, idx) => {
					if(inp.id || inp.name || inp.placeholder) {
						inputInfo.push({
							type: inp.type,
							id: inp.id,
							name: inp.name,
							value: inp.value,
							placeholder: inp.placeholder
						});
					}
				});
				return inputInfo.slice(0, 5);
			`);
			
			console.log('Found input fields:');
			inputs.forEach(inp => {
				console.log(`  - Type: ${inp.type}, ID: ${inp.id}, Name: ${inp.name}, Value: ${inp.value}`);
			});
			
		} catch (e) {
			console.log('Error finding inputs:', e.message);
		}

		// 9. Take screenshot after alert interaction
		console.log('\nTaking screenshot after alert...');
		const png2 = vibe.screenshot();
		fs.writeFileSync('basic17-screenshot-after-alert.png', png2);
		console.log('Screenshot saved');

		// 10. Close browser
		vibe.quit();
		console.log('\nDone! Screenshots saved:');
		console.log('  - basic17-screenshot-initial.png');
		console.log('  - basic17-screenshot-after-alert.png');

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();
