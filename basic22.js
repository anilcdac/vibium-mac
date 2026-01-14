const { browserSync } = require('vibium');

async function filterTableDataExample() {
	console.log('--- FILTER TABLE DATA EXAMPLE ---');
	
	const vibe = browserSync.launch({ headless: false });
	
	try {
		// 1. Navigate to the practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		await vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		
		// 2. Take initial screenshot
		console.log('Taking initial screenshot...');
		await vibe.screenshot('basic22-screenshot-initial.png');
		console.log('Initial screenshot saved');
		
		// 3. Extract table data
		console.log('\n=== EXTRACTING TABLE DATA ===');
		
		const tableData = vibe.evaluate(`
			let tables = document.querySelectorAll('table');
			if(tables.length === 0) return { error: 'No tables' };
			
			// Use the largest table by row count
			let table = tables[0];
			for(let t of tables) {
				if(t.rows.length > table.rows.length) table = t;
			}
			
			let result = {
				totalRows: table.rows.length,
				headers: [],
				rows: []
			};
			
			// Extract data from all rows
			for(let i = 0; i < table.rows.length; i++) {
				let row = table.rows[i];
				let cells = row.querySelectorAll('th, td');
				let rowData = [];
				
				for(let cell of cells) {
					rowData.push(cell.textContent.trim());
				}
				
				if(rowData.length > 0) {
					if(i === 0) {
						result.headers = rowData;
					} else {
						result.rows.push(rowData);
					}
				}
			}
			
			return result;
		`);
		
		// Parse the wrapped data
		function deepUnwrap(obj) {
			if(Array.isArray(obj)) {
				return obj.map(item => deepUnwrap(item));
			} else if(typeof obj === 'object' && obj !== null) {
				if(obj.value !== undefined) {
					return deepUnwrap(obj.value);
				}
				let result = {};
				for(let key in obj) {
					result[key] = deepUnwrap(obj[key]);
				}
				return result;
			}
			return obj;
		}
		
		let table;
		try {
			table = deepUnwrap(tableData);
			console.log('Raw tableData keys:', Object.keys(tableData).slice(0, 5));
			console.log('Unwrapped table keys:', Object.keys(table));
			console.log('table.rows type:', Array.isArray(table.rows) ? 'array' : typeof table.rows);
			console.log('table.rows length:', table.rows ? table.rows.length : 'undefined');
			
			// If tableData is array of [key, value] pairs, reconstruct it
			if(Array.isArray(tableData) && tableData.length > 0 && Array.isArray(tableData[0])) {
				table = {};
				for(let [key, value] of tableData) {
					table[key] = deepUnwrap(value);
				}
				console.log('Reconstructed table from pairs');
			}
		} catch(e) {
			console.log('Error during unwrap:', e.message);
			console.log('tableData type:', typeof tableData);
			console.log('tableData is array:', Array.isArray(tableData));
			throw e;
		}
		
		console.log(`\nTable loaded with ${table.rows.length} rows`);
		console.log(`Columns: ${table.headers.join(' | ')}`);
		
		// Ensure rows is an array
		if(!Array.isArray(table.rows)) {
			console.log('Error: Could not parse table rows');
			process.exit(1);
		}
		
		// 4. Filter examples
		console.log('\n=== FILTERING EXAMPLES ===');
		
		// Filter 1: Find all courses containing "Selenium"
		console.log('\n--- Filter 1: Courses containing "Selenium" ---');
		let seleniumCourses = table.rows.filter(row => 
			row[1].toLowerCase().includes('selenium')
		);
		console.log(`Found ${seleniumCourses.length} courses:`);
		seleniumCourses.forEach((row, idx) => {
			console.log(`  ${idx + 1}. ${row[1]} - $${row[2]}`);
		});
		
		// Filter 2: Find all courses under $25
		console.log('\n--- Filter 2: Courses under $25 ---');
		let cheapCourses = table.rows.filter(row => {
			let price = parseInt(row[2]);
			return price < 25 && price > 0;
		});
		console.log(`Found ${cheapCourses.length} courses:`);
		cheapCourses.forEach((row, idx) => {
			console.log(`  ${idx + 1}. ${row[1].substring(0, 50)}... - $${row[2]}`);
		});
		
		// Filter 3: Find courses in specific price range ($20-$30)
		console.log('\n--- Filter 3: Courses between $20-$30 ---');
		let priceRangeCourses = table.rows.filter(row => {
			let price = parseInt(row[2]);
			return price >= 20 && price <= 30;
		});
		console.log(`Found ${priceRangeCourses.length} courses:`);
		priceRangeCourses.forEach((row, idx) => {
			console.log(`  ${idx + 1}. ${row[1].substring(0, 50)}... - $${row[2]}`);
		});
		
		// Filter 4: Find courses by keyword (e.g., "SQL", "API", "Automation")
		console.log('\n--- Filter 4: Search by keywords ---');
		const keywords = ['SQL', 'API', 'Framework'];
		keywords.forEach(keyword => {
			let found = table.rows.filter(row => 
				row[1].toUpperCase().includes(keyword.toUpperCase())
			);
			console.log(`\nCourses with "${keyword}" (${found.length} found):`);
			found.forEach(row => {
				console.log(`  - ${row[1].substring(0, 60)}... | $${row[2]}`);
			});
		});
		
		// Filter 5: Find free courses
		console.log('\n--- Filter 5: Free courses (Price = 0) ---');
		let freeCourses = table.rows.filter(row => parseInt(row[2]) === 0);
		console.log(`Found ${freeCourses.length} free courses:`);
		freeCourses.forEach((row, idx) => {
			console.log(`  ${idx + 1}. ${row[1]}`);
		});
		
		// Filter 6: Find most expensive course
		console.log('\n--- Filter 6: Most expensive course ---');
		let maxPrice = Math.max(...table.rows.map(row => parseInt(row[2])));
		let expensiveCourses = table.rows.filter(row => parseInt(row[2]) === maxPrice);
		expensiveCourses.forEach(row => {
			console.log(`${row[1]} - $${row[2]}`);
		});
		
		// 5. Take screenshot
		console.log('\n=== TAKING TABLE SCREENSHOT ===');
		await vibe.screenshot('basic22-screenshot-table.png');
		console.log('Table screenshot saved');
		
		console.log('\n=== FILTERING COMPLETE ===');
		console.log('Done! Screenshots saved:');
		console.log('  - basic22-screenshot-initial.png');
		console.log('  - basic22-screenshot-table.png');
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await vibe.quit();
	}
}

filterTableDataExample().catch(console.error);
