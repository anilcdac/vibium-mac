const fs = require('fs');
const { browserSync } = require('vibium');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- STARTING AUTOMATION PRACTICE FORM FILLING ---');

		// 1. Launch Browser
		const vibe = browserSync.launch({ headless: false });

		// 2. Navigate to Rahul Shetty Academy Automation Practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		await wait(3000);

		// 3. Take initial screenshot
		console.log('Taking initial screenshot...');
		const png1 = vibe.screenshot();
		fs.writeFileSync('basic14-screenshot-initial.png', png1);
		console.log('Initial screenshot saved');
		await wait(1000);

		// 4. Select Radio Button
		console.log('Selecting radio button...');
		try {
			// Select the second radio button
			const radioBtn = vibe.find('input[type="radio"]');
			radioBtn.click();
			console.log('Radio button selected');
			
			// Check if radio button is selected
			const isRadioSelected = vibe.evaluate("document.querySelector('input[type=\"radio\"]').checked");
			console.log('Radio button selected status:', isRadioSelected);
		} catch (e) {
			console.log('Radio button selection failed:', e.message);
		}
		await wait(1000);

		// 5. Select Checkbox
		console.log('Selecting checkbox...');
		try {
			// Select the first checkbox
			const checkbox = vibe.find('input[type="checkbox"]');
			checkbox.click();
			console.log('Checkbox selected');
			
			// Check if checkbox is checked
			const isCheckboxChecked = vibe.evaluate("document.querySelector('input[type=\"checkbox\"]').checked");
			console.log('Checkbox checked status:', isCheckboxChecked);
		} catch (e) {
			console.log('Checkbox selection failed:', e.message);
		}
		await wait(1000);

		// 6. Select from Dropdown
		console.log('Selecting from dropdown...');
		try {
			// Get all dropdown options
			const optionsResult = vibe.evaluate(`
				let select = document.querySelector('select');
				let values = [];
				for(let i = 0; i < select.options.length; i++) {
					values.push(select.options[i].text);
				}
				return values;
			`);
			
			console.log('\n=== DROPDOWN OPTIONS AVAILABLE ===');
			console.log('Total Options:', optionsResult.length);
			console.log('\nAll Options:');
			optionsResult.forEach((opt, idx) => {
				// Each item is wrapped as { type: 'string', value: '...' }
				const text = opt.value || opt;
				console.log(`  [${idx}] ${text}`);
			});
			console.log('=== END DROPDOWN OPTIONS ===\n');
			
			// Select second option
			const selectResult = vibe.evaluate(`
				let select = document.querySelector('select');
				select.value = select.options[1].value;
				select.dispatchEvent(new Event('change', { bubbles: true }));
				return select.options[select.selectedIndex].text;
			`);
			const selectedText = selectResult.value || selectResult;
			console.log('Selected dropdown option:', selectedText);
			
			// Check selected value
			const selectedValue = vibe.evaluate("return document.querySelector('select').value");
			console.log('Current dropdown selected value:', selectedValue);
		} catch (e) {
			console.log('Dropdown selection failed:', e.message);
		}
		await wait(1000);

		// 7. Take screenshot after form interactions
		console.log('Taking screenshot after form interactions...');
		const png2 = vibe.screenshot();
		fs.writeFileSync('basic14-screenshot-after-fill.png', png2);
		console.log('Screenshot after interactions saved');
		await wait(1000);

		// 8. Verify selections
		console.log('Verifying all selections...');
		const allSelections = vibe.evaluate(`
			return {
				radioSelected: document.querySelector('input[type="radio"]')?.checked || false,
				checkboxSelected: document.querySelector('input[type="checkbox"]')?.checked || false,
				dropdownSelected: document.querySelector('select')?.value || 'none'
			};
		`);
		console.log('All selections:', JSON.stringify(allSelections, null, 2));

		// 9. Take final screenshot
		console.log('Taking final screenshot...');
		const png3 = vibe.screenshot();
		fs.writeFileSync('basic14-screenshot-final.png', png3);
		console.log('Final screenshot saved');

		// 10. Close browser
		vibe.quit();
		console.log('Done! All screenshots saved');
		console.log('  - basic14-screenshot-initial.png');
		console.log('  - basic14-screenshot-after-fill.png');
		console.log('  - basic14-screenshot-final.png');

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();
