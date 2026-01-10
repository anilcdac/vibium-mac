const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://example.com', { waitUntil: 'networkidle2' });
	console.log('Opened:', page.url());

	const firstLink = await page.$('a');
	if (!firstLink) {
		console.error('No <a> link found on the page');
		await browser.close();
		process.exit(1);
	}

	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle2' }),
		firstLink.click(),
	]);

	console.log('After click, navigated to:', page.url());
	await page.screenshot({ path: 'basic9-screenshot.png', fullPage: true });
	await browser.close();
})();

