const fs = require('fs');
const { browserSync } = require('vibium');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
	try {
		console.log('--- DROPDOWN OPTIONS DIAGNOSTIC ---');

		const vibe = browserSync.launch({ headless: false });

		console.log('Navigating to page...');
		vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		await wait(3000);

		// Test 1: Simple evaluation
		console.log('\n--- Test 1: Simple value evaluation ---');
		const simpleResult = vibe.evaluate('return "test string"');
		console.log('Result type:', typeof simpleResult);
		console.log('Result:', simpleResult);
		console.log('Result as JSON:', JSON.stringify(simpleResult, null, 2));

		// Test 2: Get dropdown element
		console.log('\n--- Test 2: Check dropdown exists ---');
		const dropdownExists = vibe.evaluate('return !!document.querySelector("select")');
		console.log('Dropdown exists:', dropdownExists);

		// Test 3: Get dropdown info piece by piece
		console.log('\n--- Test 3: Get dropdown value ---');
		const dropdownValue = vibe.evaluate('return document.querySelector("select").value');
		console.log('Dropdown value:', dropdownValue);

		// Test 4: Get options count
		console.log('\n--- Test 4: Get options count ---');
		const optCount = vibe.evaluate('return document.querySelector("select").options.length');
		console.log('Options count:', optCount);

		// Test 5: Get first option text
		console.log('\n--- Test 5: Get first option text ---');
		const firstOptText = vibe.evaluate('return document.querySelector("select").options[0].text');
		console.log('First option text:', firstOptText);

		// Test 6: Get all options as simple array
		console.log('\n--- Test 6: Get all option values ---');
		const allValues = vibe.evaluate(`
			let select = document.querySelector('select');
			let values = [];
			for(let i = 0; i < select.options.length; i++) {
				values.push(select.options[i].text);
			}
			return values;
		`);
		console.log('All option texts:', allValues);

		// Test 7: Get all options as detailed array
		console.log('\n--- Test 7: Get all options detailed ---');
		const detailedOptions = vibe.evaluate(`
			let select = document.querySelector('select');
			let opts = [];
			for(let i = 0; i < select.options.length; i++) {
				opts.push({
					index: i,
					value: select.options[i].value,
					text: select.options[i].text
				});
			}
			return opts;
		`);
		console.log('Detailed options:', detailedOptions);

		vibe.quit();

	} catch (error) {
		console.error('ERROR:', error.message);
		process.exit(1);
	}
}

main();
