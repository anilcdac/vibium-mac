const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	
	// Go to Google
	await page.goto('https://google.com', { waitUntil: 'networkidle2' });
	console.log('Opened Google');

	// Type in the search box
	await page.type('input[name="q"]', 'Apple iphone');
	console.log('Typed "Apple iphone" in search box');

	// Click the search button
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle2' }),
		page.click('input[type="submit"]'),
	]);
	console.log('Clicked search button');
	console.log('Search results page URL:', page.url());

	// Wait for results to load and click the first link
	await page.waitForSelector('a[data-sokoban-feature]');
	const firstResultLink = await page.$('a[data-sokoban-feature]');
	
	if (!firstResultLink) {
		console.error('No first result link found');
		await browser.close();
		process.exit(1);
	}

	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle2' }),
		firstResultLink.click(),
	]);

	console.log('Clicked on first result link');
	console.log('Navigated to:', page.url());
	await page.screenshot({ path: 'basic11-screenshot.png', fullPage: true });
	await browser.close();
})();
