const { browserSync } = require('vibium');

async function clickAlertButtonExample() {
	console.log('--- ALERT BUTTON TEST ---');
	
	const vibe = browserSync.launch({ headless: false });
	
	try {
		// 1. Navigate to the practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		await vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		
		// 2. Take initial screenshot
		console.log('Taking initial screenshot...');
		await vibe.screenshot('basic19-screenshot-initial.png');
		console.log('Initial screenshot saved');
		
		// 3. Fill in the name field
		console.log('\n=== FILLING NAME FIELD ===');
		const nameInput = vibe.find('input[placeholder*="Name"]');
		nameInput.type('Aniket');
		console.log('✓ Typed "Aniket" into the name field');
		
		// 4. Look for Alert button - it's just below the name field
		console.log('\n=== FINDING & CLICKING ALERT BUTTON ===');
		
		const clickAlert = vibe.evaluate(`
			// Look for input buttons with "Alert" in value
			let inputs = document.querySelectorAll('input[type="button"], input[type="submit"]');
			
			for(let i = 0; i < inputs.length; i++) {
				if(inputs[i].value && inputs[i].value.toLowerCase().includes('alert')) {
					console.log('Found Alert button at index ' + i + ': "' + inputs[i].value + '"');
					inputs[i].click();
					return true;
				}
			}
			return false;
		`);
		
		if(clickAlert) {
			console.log('✓ Alert button clicked successfully');
		} else {
			console.log('Alert button not found or click failed');
		}
		
		// 5. Set up alert capture before clicking
		console.log('\n=== SETTING UP ALERT HANDLER ===');
		vibe.evaluate(`
			window.capturedAlert = null;
			window.originalAlert = window.alert;
			window.alert = function(msg) {
				window.capturedAlert = msg;
				console.log('Alert message: ' + msg);
				return true;
			};
		`);
		console.log('Alert handler set');
		
		// 6. Take screenshot after alert
		console.log('\n=== TAKING FINAL SCREENSHOT ===');
		await vibe.screenshot('basic19-screenshot-after-alert.png');
		console.log('Screenshot saved');
		
		// 7. Verify alert was triggered
		const alertMsg = vibe.evaluate('return window.capturedAlert || "No alert triggered";');
		console.log('Captured alert message:', alertMsg);
		
		console.log('\n=== TEST COMPLETE ===');
		console.log('Done! Screenshots saved:');
		console.log('  - basic19-screenshot-initial.png');
		console.log('  - basic19-screenshot-after-alert.png');
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await vibe.quit();
	}
}

clickAlertButtonExample().catch(console.error);
