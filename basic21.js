const { browserSync } = require('vibium');

async function webTableExample() {
	console.log('--- WEB TABLE EXAMPLE ---');
	
	const vibe = browserSync.launch({ headless: false });
	
	try {
		// 1. Navigate to the practice page
		console.log('Navigating to https://rahulshettyacademy.com/AutomationPractice/...');
		await vibe.go('https://rahulshettyacademy.com/AutomationPractice/');
		
		// 2. Take initial screenshot
		console.log('Taking initial screenshot...');
		await vibe.screenshot('basic21-screenshot-initial.png');
		console.log('Initial screenshot saved');
		
		// 3. Find and extract table data
		console.log('\n=== FINDING WEB TABLE ===');
		
		const allTables = vibe.evaluate(`
			let tables = document.querySelectorAll('table');
			return {
				count: tables.length,
				tables: Array.from(tables).map((t, i) => ({
					index: i,
					rows: t.rows.length,
					id: t.id,
					className: t.className
				}))
			};
		`);
		
		console.log('Tables detected:', allTables);
		
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
		
		console.log('\n=== TABLE STRUCTURE ===');
		console.log('Table data response:', JSON.stringify(tableData).substring(0, 300));
		
		// Parse the wrapped data structure from vibium
		let table = {};
		if(Array.isArray(tableData)) {
			// Data comes as array of [key, value] pairs
			for(let pair of tableData) {
				if(Array.isArray(pair) && pair.length === 2) {
					let key = pair[0];
					let val = pair[1];
					
					if(val.value !== undefined) {
						table[key] = val.value;
					} else {
						table[key] = val;
					}
				}
			}
		} else {
			table = tableData;
		}
		
		console.log('\n=== EXTRACTED TABLE DATA ===');
		console.log(`Total rows in table: ${table.totalRows}`);
		
		// Deep parse function to unwrap nested objects
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
		
		// Apply deep unwrap to the table
		let unwrappedTable = deepUnwrap(table);
		
		// Display headers
		if(unwrappedTable.headers && unwrappedTable.headers.length > 0) {
			console.log('\nTable Headers:');
			console.log(unwrappedTable.headers.join(' | '));
			console.log('-'.repeat(80));
		}
		
		// Display data rows
		if(unwrappedTable.rows && unwrappedTable.rows.length > 0) {
			console.log('\nTable Data:');
			
			unwrappedTable.rows.forEach((row, idx) => {
				if(Array.isArray(row)) {
					console.log(`Row ${idx + 1}: ${row.join(' | ')}`);
				} else {
					console.log(`Row ${idx + 1}: ${String(row)}`);
				}
			});
			
			console.log(`\nTotal data rows: ${unwrappedTable.rows.length}`);
		}
		
		// 4. Take screenshot of table
		console.log('\n=== TAKING TABLE SCREENSHOT ===');
		await vibe.screenshot('basic21-screenshot-table.png');
		console.log('Table screenshot saved');
		
		console.log('\n=== TEST COMPLETE ===');
		console.log('Done! Screenshots saved:');
		console.log('  - basic21-screenshot-initial.png');
		console.log('  - basic21-screenshot-table.png');
		
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await vibe.quit();
	}
}

webTableExample().catch(console.error);
