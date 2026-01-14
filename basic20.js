const { browserSync } = require('vibium');

async function clickConfirmButtonExample() {
	console.log('--- CONFIRM BUTTON TEST ---');
	
	const vibe = browserSync.launch({ headless: false });
	
	try {
		// 1. Navigate to the practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		await vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		
		// 2. Take initial screenshot
		console.log('Taking initial screenshot...');
		await vibe.screenshot('basic20-screenshot-initial.png');
		console.log('Initial screenshot saved');
		
		// 3. Fill in the name field
		console.log('\n=== FILLING NAME FIELD ===');
		const nameInput = vibe.find('input[placeholder*="Name"]');
		nameInput.type('Aniket');
		console.log('✓ Typed "Aniket" into the name field');
		
		// 4. Look for Confirm button - it's right next to the Alert button
		console.log('\n=== FINDING & CLICKING CONFIRM BUTTON ===');
		
		const clickConfirm = vibe.evaluate(`
			// Look for input buttons with "Confirm" in value
			let inputs = document.querySelectorAll('input[type="button"], input[type="submit"]');
			
			for(let i = 0; i < inputs.length; i++) {
				if(inputs[i].value && inputs[i].value.toLowerCase().includes('confirm')) {
					console.log('Found Confirm button at index ' + i + ': "' + inputs[i].value + '"');
					inputs[i].click();
					return true;
				}
			}
			return false;
		`);
		
		if(clickConfirm) {
			console.log('✓ Confirm button clicked successfully');
		} else {
			console.log('Confirm button not found or click failed');
		}
		
		// 5. Set up confirm dialog capture
		console.log('\n=== SETTING UP CONFIRM HANDLER ===');
		vibe.evaluate(`
			window.capturedConfirm = null;
			window.originalConfirm = window.confirm;
			window.confirm = function(msg) {
				window.capturedConfirm = msg;
				console.log('Confirm message: ' + msg);
				return true; // Click "OK" on the confirm dialog
			};
		`);
		console.log('Confirm handler set');
		
		// 6. Take screenshot after confirm
		console.log('\n=== TAKING FINAL SCREENSHOT ===');
		await vibe.screenshot('basic20-screenshot-after-confirm.png');
		console.log('Screenshot saved');
		
		// 7. Verify confirm was triggered
		const confirmMsg = vibe.evaluate('return window.capturedConfirm || "No confirm triggered";');
		console.log('Captured confirm message:', confirmMsg);
		
		console.log('\n=== TEST COMPLETE ===');
		console.log('Done! Screenshots saved:');
		console.log('  - basic20-screenshot-initial.png');
		console.log('  - basic20-screenshot-after-confirm.png');
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await vibe.quit();
	}
}

clickConfirmButtonExample().catch(console.error);
