
const puppeteer = require('puppeteer');

class BrowserAutomator{
    constructor(){
        this.url;
        this.browser;
        this.page;
    }
    async openPage(url){
        this.url = url;
        this.browser = await puppeteer.launch({headless: false});
        this.page = await this.browser.newPage();
        await this.page.goto(this.url);        
    }        
    async captureScreen(){
        await this.page.emulateMedia('screen');
        await this.page.screenshot({path: 'screenshot.png'});
    }
    async openOtherPage(){               
        var page1 = await this.browser.newPage();
        await page1.goto(this.url);        
        await page1.emulateMedia('screen');
        await page1.screenshot({path: 'screenshot2.png'});
    }
    async hideBrowser(){
        this.browser = await puppeteer.launch({headless: true});
        this.page = await this.browser.newPage();
        await this.page.goto(this.url);
        console.log("browser hided");        
    }
}
module.exports = BrowserAutomator;


/*
Modo 1:
    -> abre página normal 
        -> clica no botão para entrar com a conta (Google, Facebook ou Passei Direto)
            -> o usuário preenche os campos (Interação do usuário)
                -> a página feche e os cookies são salvos
                    -> abre o browser em modo handless 
                        -> faz o set dos cookies no algoritmo de automação.
                            -> inicia o algoritmo de automação de captura de páginas.
Help: https://stackoverflow.com/questions/46631333/how-to-recreate-a-page-with-all-of-the-cookies

Modo 2:
    ->                          
*/