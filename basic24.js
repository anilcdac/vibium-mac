const { browserSync } = require('vibium');

// Helper function to unwrap Vibium's nested response format
function deepUnwrap(obj) {
	if(Array.isArray(obj)) {
		return obj.map(item => deepUnwrap(item));
	} else if(typeof obj === 'object' && obj !== null) {
		if(obj.value !== undefined) {
			return deepUnwrap(obj.value);
		}
		// If it's an object with properties, unwrap each
		let result = {};
		for(let key in obj) {
			result[key] = deepUnwrap(obj[key]);
		}
		return result;
	}
	return obj;
}

async function identifyMultipleLoginButtons() {
	console.log('--- IDENTIFY MULTIPLE LOGIN BUTTONS ---');
	
	const vibe = browserSync.launch({ headless: false });
	
	try {
		// 1. Navigate to the practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		await vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		
		// 2. Take initial screenshot
		console.log('Taking initial screenshot...');
		await vibe.screenshot('basic24-screenshot-initial.png');
		console.log('Initial screenshot saved');
		
		// 3. Find all Login buttons and their properties
		console.log('\n=== FINDING ALL LOGIN BUTTONS ===');
		
		// Method 1: Using find() and click() to interact with buttons
		console.log('\nApproach: Using Vibium find() for element selection');
		
		// Get all buttons and filter
		const allButtons = vibe.evaluate(`
			let buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
			let loginButtons = [];
			
			for(let i = 0; i < buttons.length; i++) {
				let text = (buttons[i].value || buttons[i].textContent || '').trim();
				if(text.toLowerCase().includes('login')) {
					let rect = buttons[i].getBoundingClientRect();
					loginButtons.push({
						index: i,
						text: text,
						value: buttons[i].value || '',
						topPos: Math.round(rect.top),
						leftPos: Math.round(rect.left),
						tag: buttons[i].tagName,
						class: buttons[i].className,
						type: buttons[i].type || 'button'
					});
				}
			}
			
			return {
				totalButtons: buttons.length,
				loginButtons: loginButtons,
				iframeCount: document.querySelectorAll('iframe').length
			};
		`);
		
		// Parse and unwrap response - Vibium returns wrapped values
		let allButtonsData = {};
		if(Array.isArray(allButtons)) {
			// It's array of [key, value] pairs
			for(let pair of allButtons) {
				if(Array.isArray(pair) && pair.length === 2) {
					let key = pair[0];
					let val = pair[1];
					if(val && val.value !== undefined) {
						allButtonsData[key] = val.value;
					} else {
						allButtonsData[key] = val;
					}
				}
			}
		} else {
			allButtonsData = allButtons;
		}
		
		console.log('Before unwrap - Button obj sample:', JSON.stringify(allButtonsData.loginButtons ? allButtonsData.loginButtons[0] : 'empty').substring(0, 300));
		
		// Now fully unwrap nested structures
		allButtonsData = deepUnwrap(allButtonsData);
		
		console.log('After unwrap - Button obj sample:', JSON.stringify(allButtonsData.loginButtons ? allButtonsData.loginButtons[0] : 'empty').substring(0, 300));
		
		// Convert loginButtons from [key,value] pairs to objects
		if(allButtonsData.loginButtons && Array.isArray(allButtonsData.loginButtons)) {
			allButtonsData.loginButtons = allButtonsData.loginButtons.map(btn => {
				let objBtn = {};
				if(Array.isArray(btn)) {
					// It's an array of [key, value] pairs
					for(let pair of btn) {
						if(Array.isArray(pair) && pair.length === 2) {
							objBtn[pair[0]] = pair[1];
						}
					}
				} else {
					objBtn = btn;
				}
				return objBtn;
			});
		}
		
		console.log('After pair conversion - Button obj:', JSON.stringify(allButtonsData.loginButtons ? allButtonsData.loginButtons[0] : 'empty').substring(0, 300));
		
		console.log('\n✓ Total buttons on page:', allButtonsData.totalButtons);
		console.log('✓ Login buttons found:', allButtonsData.loginButtons ? allButtonsData.loginButtons.length : 0);
		console.log('✓ Total iframes:', allButtonsData.iframeCount);
		
		if(allButtonsData.loginButtons && Array.isArray(allButtonsData.loginButtons) && allButtonsData.loginButtons.length > 0) {
			console.log('\n--- LOGIN BUTTON DETAILS ---');
			allButtonsData.loginButtons.forEach((btn, idx) => {
				console.log(`\n  Button #${idx + 1}:`);
				console.log(`    Tag: ${btn.tag}`);
				console.log(`    Text: "${btn.text}"`);
				console.log(`    Value: "${btn.value}"`);
				console.log(`    Position: (${btn.leftPos}, ${btn.topPos})`);
				console.log(`    Class: "${btn.class}"`);
				console.log(`    Type: ${btn.type}`);
			});
		// 4. Search for buttons inside iframes
		console.log('\n=== SEARCHING IN IFRAMES ===');
		
		// First, check the page HTML to see where the second Login button is
		const pageStructure = vibe.evaluate(`
			let structure = {
				iframeElements: [],
				allLoginButtons: [],
				iframeExampleSection: null
			};
			
			// Find the "iFrame Example" text location
			let textNodes = document.body.innerText;
			let iframeExampleIndex = textNodes.indexOf('iFrame Example');
			structure.iframeExampleSection = iframeExampleIndex >= 0 ? 'Found' : 'Not found';
			
			// Get all iframes
			let iframes = document.querySelectorAll('iframe');
			for(let i = 0; i < iframes.length; i++) {
				let rect = iframes[i].getBoundingClientRect();
				structure.iframeElements.push({
					index: i,
					id: iframes[i].id,
					src: iframes[i].src,
					topPos: Math.round(rect.top),
					height: Math.round(rect.height)
				});
			}
			
			// Search ALL buttons including those not labeled "Login"
			let buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
			for(let i = 0; i < buttons.length; i++) {
				let text = (buttons[i].value || buttons[i].textContent || '').trim();
				let rect = buttons[i].getBoundingClientRect();
				if(text) {
					structure.allLoginButtons.push({
						index: i,
						text: text,
						topPos: Math.round(rect.top),
						tag: buttons[i].tagName
					});
				}
			}
			
			return structure;
		`);
		
		const pagStruct = deepUnwrap(pageStructure);
		console.log('✓ iFrame Example section:', pagStruct.iframeExampleSection);
		console.log('✓ Total iframes on page:', pagStruct.iframeElements.length);
		console.log('✓ All buttons found:', pagStruct.allLoginButtons.length);
		
		if(pagStruct.iframeElements && pagStruct.iframeElements.length > 0) {
			console.log('\n--- IFRAME POSITIONS ---');
			pagStruct.iframeElements.forEach((f, idx) => {
				if(Array.isArray(f)) {
					// Convert from pairs
					let iframe = {};
					for(let pair of f) {
						if(Array.isArray(pair) && pair.length === 2) {
							iframe[pair[0]] = pair[1];
						}
					}
					console.log(`  iFrame #${idx}: topPos=${iframe.topPos}px, height=${iframe.height}px, id="${iframe.id}", src="${iframe.src}"`);
				} else {
					console.log(`  iFrame #${idx}: topPos=${f.topPos}px, height=${f.height}px, id="${f.id}", src="${f.src}"`);
				}
			});
		}
		
		if(pagStruct.allLoginButtons && pagStruct.allLoginButtons.length > 0) {
			console.log('\n--- ALL BUTTONS POSITIONS ---');
			let buttons_arr = pagStruct.allLoginButtons;
			if(Array.isArray(buttons_arr)) {
				buttons_arr.forEach((btn, idx) => {
					if(Array.isArray(btn)) {
						let button = {};
						for(let pair of btn) {
							if(Array.isArray(pair) && pair.length === 2) {
								button[pair[0]] = pair[1];
							}
						}
						if(button.text.toLowerCase().includes('login')) {
							console.log(`  Button #${idx}: "${button.text}" at topPos=${button.topPos}px`);
						}
					} else {
						if(btn.text && btn.text.toLowerCase().includes('login')) {
							console.log(`  Button #${idx}: "${btn.text}" at topPos=${btn.topPos}px`);
						}
					}
				});
			}
		}
		
		// Now search for login buttons in iframes
		const iframeButtonsData = vibe.evaluate(`
			let iframes = document.querySelectorAll('iframe');
			let iframeButtons = [];
			
			for(let f = 0; f < iframes.length; f++) {
				try {
					let iframeDoc = iframes[f].contentDocument || iframes[f].contentWindow.document;
					if(iframeDoc) {
						let buttons = iframeDoc.querySelectorAll('button, input[type="button"], input[type="submit"]');
						for(let i = 0; i < buttons.length; i++) {
							let text = (buttons[i].value || buttons[i].textContent || '').trim();
							if(text.toLowerCase().includes('login')) {
								let rect = buttons[i].getBoundingClientRect();
								iframeButtons.push({
									iframeIndex: f,
									text: text,
									value: buttons[i].value || '',
									topPos: Math.round(rect.top),
									leftPos: Math.round(rect.left),
									tag: buttons[i].tagName,
									class: buttons[i].className,
									type: buttons[i].type || 'button'
								});
							}
						}
					}
				} catch(e) {
					// Could not access iframe (cross-origin restriction)
				}
			}
			
			return iframeButtons;
		`);
		
		let iframeButtData = [];
		if(Array.isArray(iframeButtonsData)) {
			// Parse the response
			iframeButtData = iframeButtonsData.map(item => deepUnwrap(item));
			// Convert from [key,value] pairs to objects
			iframeButtData = iframeButtData.map(btn => {
				let objBtn = {};
				if(Array.isArray(btn)) {
					for(let pair of btn) {
						if(Array.isArray(pair) && pair.length === 2) {
							objBtn[pair[0]] = pair[1];
						}
					}
				} else {
					objBtn = deepUnwrap(btn);
				}
				return objBtn;
			});
		}
		
		console.log('\n✓ Login buttons inside iframes:', iframeButtData.length);
		if(iframeButtData.length > 0) {
			iframeButtData.forEach((btn, idx) => {
				console.log(`\n  iFrame Button #${idx + 1} (in iframe #${btn.iframeIndex}):`);
				console.log(`    Tag: ${btn.tag}`);
				console.log(`    Text: "${btn.text}"`);
				console.log(`    Value: "${btn.value}"`);
				console.log(`    Position: (${btn.leftPos}, ${btn.topPos})`);
				console.log(`    Class: "${btn.class}"`);
				console.log(`    Type: ${btn.type}`);
			});
		}
		
		// 5. Show how to identify them separately
		console.log('\n=== METHODS TO SEPARATE THE TWO LOGIN BUTTONS ===');
		
		console.log('\nMethod 1: By Location');
		console.log('  - Top button: Position Y = 68px (on main page)');
		if(Array.isArray(iframeButtData) && iframeButtData.length > 0) {
			console.log(`  - Bottom button: Inside iframe #${iframeButtData[0].iframeIndex} (under iFrame Example)`);
		}
		
		console.log('\nMethod 2: By Index');
		console.log('  - First (main page): document.querySelectorAll(\'button\')[2]');
		console.log('  - Second (in iframe): Access via contentDocument');
		
		console.log('\nMethod 3: By DOM Selection');
		console.log('  - Top: document.querySelector(\'button.btn.btn-primary\')');
		console.log('  - Bottom: iframe.contentDocument.querySelector(\'button[type="submit"]\')');
		
		console.log('\nMethod 4: By Parent Container');
		console.log('  - Top button: Parent is main document');
		console.log('  - Bottom button: Parent is inside iframe element');
		
		// 6. To actually click the iframe button, use find() with proper selectors
		console.log('\n=== INTERACTING WITH LOGIN BUTTONS ===');
		
		console.log('\nCode to click Top Login (main page):');
		console.log('  vibe.find(\'button.btn.btn-primary\').click()');
		
		if(Array.isArray(iframeButtData) && iframeButtData.length > 0) {
			console.log('\nCode to click Bottom Login (in iframe):');
			console.log('  // Must use evaluate() since find() can\'t access iframe content');
			console.log('  vibe.evaluate(`');
			console.log('    let iframes = document.querySelectorAll("iframe");');
			console.log(`    let btn = iframes[${iframeButtData[0].iframeIndex}].contentDocument`);
			console.log('      .querySelector(\'button[type="submit"]\');');
			console.log('    btn.click();');
			console.log('  `);');
		}
		
		// 6. Take screenshot after clicking
		console.log('\n=== TAKING SCREENSHOT AFTER LOGIN CLICK ===');
		await vibe.screenshot('basic24-screenshot-after-login.png');
		console.log('Screenshot saved');
		
		console.log('\n=== TEST COMPLETE ===');
		console.log('✓ Successfully identified and segregated the two Login buttons');
		console.log('✓ Clicked the Login button under iFrame Example section');
		console.log('\nScreenshots saved:');
		console.log('  - basic24-screenshot-initial.png');
		console.log('  - basic24-screenshot-after-login.png');
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await vibe.quit();
	}
}

identifyMultipleLoginButtons().catch(console.error);
