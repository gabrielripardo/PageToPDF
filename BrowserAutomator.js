
const puppeteer = require('puppeteer');

class BrowserAutomator{
    async openPage(url){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.emulateMedia('screen');
        await page.screenshot({path: 'screenshot.png'});
    }        
}
module.exports = BrowserAutomator;
