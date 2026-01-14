const { browserSync } = require('vibium');

async function elementDisplayedExample() {
	console.log('--- ELEMENT DISPLAYED EXAMPLE ---');
	
	const vibe = browserSync.launch({ headless: false });
	
	try {
		// 1. Navigate to the practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		await vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		
		// 2. Take initial screenshot
		console.log('Taking initial screenshot...');
		await vibe.screenshot('basic23-screenshot-initial.png');
		console.log('Initial screenshot saved');
		
		// 3. Find all elements with Hide/Show text
		console.log('\n=== SEARCHING FOR HIDE/SHOW ELEMENTS ===');
		
		try {
			const findElementsResult = vibe.evaluate(`
				let hideShowElements = [];
				let allElements = document.querySelectorAll('button, input, a, [role="button"]');
				
				for(let el of allElements) {
					let text = (el.value || el.textContent || '').trim();
					if(text === 'Hide' || text === 'Show' || text.toLowerCase().includes('hide') || text.toLowerCase().includes('show')) {
						hideShowElements.push({
							text: text,
							tag: el.tagName
						});
					}
				}
				
				return hideShowElements;
			`);
			
			console.log('Found elements:', findElementsResult);
		} catch(e) {
			console.log('Error searching for elements:', e.message);
		}
		
		// 4. Click Hide button
		console.log('\n=== CLICKING HIDE BUTTON ===');
		
		try {
			const hideResult = vibe.evaluate(`
				let elements = document.querySelectorAll('button, input, a');
				for(let el of elements) {
					let text = (el.value || el.textContent || '').trim();
					if(text === 'Hide') {
						el.click();
						return true;
					}
				}
				return false;
			`);
			
			console.log('Hide button clicked:', hideResult);
		} catch(e) {
			console.log('Error clicking Hide button:', e.message);
		}
		
		// 5. Take screenshot after hiding
		console.log('\n=== TAKING SCREENSHOT AFTER HIDE ===');
		await vibe.screenshot('basic23-screenshot-after-hide.png');
		console.log('Screenshot saved');
		
		// 6. Check if element is hidden/displayed
		console.log('\n=== CHECKING ELEMENT VISIBILITY AFTER HIDE ===');
		const visibilityAfterHide = vibe.evaluate(`
			// Look for the element that was hidden
			let element = document.getElementById('displayed-text');
			if(!element) {
				// Try to find by text content
				let allElements = document.querySelectorAll('*');
				for(let el of allElements) {
					if(el.textContent && el.textContent.includes('Displayed')) {
						element = el;
						break;
					}
				}
			}
			
			if(element) {
				let isVisible = element.offsetParent !== null;
				let display = window.getComputedStyle(element).display;
				let visibility = window.getComputedStyle(element).visibility;
				
				return {
					element: element.tagName,
					isVisible: isVisible,
					display: display,
					visibility: visibility
				};
			}
			return { error: 'Element not found' };
		`);
		
		console.log('Element visibility status after Hide:', visibilityAfterHide);
		
		// 7. Find and click Show button
		console.log('\n=== CLICKING SHOW BUTTON ===');
		
		try {
			const showResult = vibe.evaluate(`
				let elements = document.querySelectorAll('button, input, a');
				for(let el of elements) {
					let text = (el.value || el.textContent || '').trim();
					if(text === 'Show') {
						el.click();
						return true;
					}
				}
				return false;
			`);
			
			console.log('Show button clicked:', showResult);
		} catch(e) {
			console.log('Error clicking Show button:', e.message);
		}
		
		// 8. Take screenshot after showing
		console.log('\n=== TAKING SCREENSHOT AFTER SHOW ===');
		await vibe.screenshot('basic23-screenshot-after-show.png');
		console.log('Screenshot saved');
		
		// 9. Check if element is displayed again
		console.log('\n=== CHECKING ELEMENT VISIBILITY AFTER SHOW ===');
		const visibilityAfterShow = vibe.evaluate(`
			// Look for the element that was hidden
			let element = document.getElementById('displayed-text');
			if(!element) {
				// Try to find by text content
				let allElements = document.querySelectorAll('*');
				for(let el of allElements) {
					if(el.textContent && el.textContent.includes('Displayed')) {
						element = el;
						break;
					}
				}
			}
			
			if(element) {
				let isVisible = element.offsetParent !== null;
				let display = window.getComputedStyle(element).display;
				let visibility = window.getComputedStyle(element).visibility;
				
				return {
					element: element.tagName,
					isVisible: isVisible,
					display: display,
					visibility: visibility,
					text: element.textContent.substring(0, 100)
				};
			}
			return { error: 'Element not found' };
		`);
		
		console.log('Element visibility status after Show:', visibilityAfterShow);
		
		console.log('\n=== TEST COMPLETE ===');
		console.log('✓ Element Display Example Completed');
		console.log('Screenshots saved:');
		console.log('  - basic23-screenshot-initial.png');
		console.log('  - basic23-screenshot-after-hide.png');
		console.log('  - basic23-screenshot-after-show.png');
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await vibe.quit();
	}
}

elementDisplayedExample().catch(console.error);
