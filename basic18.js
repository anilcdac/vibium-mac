const fs = require('fs');
const { browserSync } = require('vibium');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- ENTER NAME FIELD TEST ---');

		// 1. Launch Browser
		const vibe = browserSync.launch({ headless: false });

		// 2. Navigate to the page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		await wait(3000);

		// 3. Take initial screenshot
		console.log('Taking initial screenshot...');
		const png1 = vibe.screenshot();
		fs.writeFileSync('basic18-screenshot-initial.png', png1);
		console.log('Initial screenshot saved\n');

		// 4. Get initial page info
		console.log('=== INITIAL PAGE INFO ===');
		const initialTitle = vibe.evaluate('return document.title');
		console.log('Page Title:', initialTitle);
		console.log('=== END INITIAL INFO ===\n');

		// 5. Find all input fields
		console.log('Looking for input fields on the page...');
		try {
			const inputFields = vibe.evaluate(`
				let inputs = [];
				document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="number"], textarea').forEach((inp, idx) => {
					inputs.push({
						index: idx,
						type: inp.type || inp.tagName,
						id: inp.id,
						name: inp.name,
						placeholder: inp.placeholder,
						value: inp.value,
						parent: inp.parentElement ? inp.parentElement.innerText.substring(0, 30) : 'no parent'
					});
				});
				return inputs;
			`);
			
			console.log('Found input fields:');
			inputFields.forEach(inp => {
				console.log(`  [${inp.index}] Type: ${inp.type} | ID: ${inp.id} | Name: ${inp.name} | Placeholder: ${inp.placeholder}`);
				if(inp.parent) console.log(`      Parent text: ${inp.parent}`);
			});
			
		} catch (e) {
			console.log('Error finding inputs:', e.message);
		}

		// 6. Find and fill the name field using find()
		console.log('\n=== FINDING AND FILLING NAME FIELD ===');
		try {
			// First, let's identify the name field
			console.log('Searching for input with placeholder "Enter Your Name"...');
			
			try {
				// Try to find by placeholder
				const nameInput = vibe.find('input[placeholder*="Name"]');
				console.log('Found name input field');
				
				// Type the name
				nameInput.type('Aniket');
				console.log('✓ Typed "Aniket" into the name field');
				
				await wait(1000);
				
				// Verify the value
				const enteredValue = vibe.evaluate('return document.querySelector("input[placeholder*=\\"Name\\"]") ? document.querySelector("input[placeholder*=\\"Name\\"]").value : "not found"');
				console.log('Entered value:', enteredValue);
				
			} catch (e) {
				console.log('Could not find by placeholder, trying by name attribute...');
				
				// Try to find by name attribute
				const nameInput = vibe.find('input[name*="name"]');
				console.log('Found input by name attribute');
				
				// Type the name
				nameInput.type('Aniket');
				console.log('✓ Typed "Aniket" into the name field');
				
				await wait(1000);
				
				// Verify the value
				const enteredValue = vibe.evaluate('return document.querySelector("input[name*=\\"name\\"]") ? document.querySelector("input[name*=\\"name\\"]").value : "not found"');
				console.log('Entered value:', enteredValue);
			}
			
		} catch (e) {
			console.log('Error: Could not find or fill name field:', e.message);
			console.log('Attempting to find first text input...');
			
			try {
				const firstInput = vibe.find('input[type="text"]');
				firstInput.type('Aniket');
				console.log('✓ Typed "Aniket" into first text input');
				await wait(1000);
			} catch (e2) {
				console.log('Error typing:', e2.message);
			}
		}

		// 7. Verify the entered value
		console.log('\n=== VERIFYING ENTERED VALUE ===');
		try {
			// Check if the name field has the value
			const verifyValue = vibe.evaluate('return document.querySelector("input[placeholder*=\\"Name\\"], input[name*=\\"name\\"]") ? document.querySelector("input[placeholder*=\\"Name\\"], input[name*=\\"name\\"]").value : "not found"');
			console.log('Verified entered value:', verifyValue);
			
			// Also check all text inputs for Aniket
			const allInputValues = vibe.evaluate(`
				let results = [];
				document.querySelectorAll('input[type="text"]').forEach((inp, idx) => {
					if(inp.value) {
						results.push('Input ' + idx + ': ' + inp.value);
					}
				});
				return results.join(' | ');
			`);
			
			console.log('All text input values:', allInputValues);
			
		} catch (e) {
			console.log('Error verifying:', e.message);
		}

		// 8. Take screenshot after entering name
		console.log('\nTaking screenshot after entering name...');
		const png2 = vibe.screenshot();
		fs.writeFileSync('basic18-screenshot-after-name.png', png2);
		console.log('Screenshot saved');

		// 9. Close browser
		vibe.quit();
		console.log('\nDone! Screenshots saved:');
		console.log('  - basic18-screenshot-initial.png');
		console.log('  - basic18-screenshot-after-name.png');

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();
