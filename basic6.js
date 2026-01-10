import { browser } from 'vibium';

async function runAutomation() {
    const vibe = await browser.launch();
    try {
        // Use the URL from your image
        await vibe.go('https://the-internet.herokuapp.com/login');

        // 1. Enter Username (The part you successfully did in Image 3)
        const username = await vibe.find('#username'); // Or 'input[name="username"]'
        await username.type('tomsmith');

        // 2. Enter Password
        const password = await vibe.find('#password');
        await password.type('SuperSecretPassword!');

        // 3. Click Login
        const loginBtn = await vibe.find('button[type="submit"]');
        await loginBtn.click();

        console.log('✅ Login successful!');

    } catch (error) {
        console.error('❌ Automation failed:', error.message);
    } finally {
        // Keep the browser open for a moment so you can see the result
        await new Promise(resolve => setTimeout(resolve, 3000));
        await vibe.quit();
    }
}

runAutomation();