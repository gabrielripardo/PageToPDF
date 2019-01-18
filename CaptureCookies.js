const puppeteer = require('puppeteer');

class CaptureCookies{
  constructor(){
    this.session;
    this.url;
    this.browser1;
    this.browser;
    this.page;
    this.pageHeadless;
    this.prosseguir;    
  }

  async run(url, browser1, sessionOn){
    this.url = url;
    this.browser1 = browser1;

    if(!sessionOn){
      this.browser = await puppeteer.launch({headless: false});
      this.session = await this.createSession(this.browser, this.url);            
    }else{
      this.openOtherBrowser();
    }    
  }
  
  async createSession(browser, startUrl){
    this.page = await browser.newPage();

    await this.page.goto(startUrl);

    //Realiza o procedimento de click para chegar nas opções de autenticar pelo Google, Facebook ou próprio Passei Direto.
    while(true){
      try {
        await this.page.waitForSelector('#pd-view > section > div.card_default.card_type_file.header > div > div > ul > li > div > button');
        await this.page.click('#pd-view > section > div.card_default.card_type_file.header > div > div > ul > li > div > button');
        break;  
      } catch (error) {
        console.log("Error ao carregar #1");
      }      
    }
    while(true){
      try {
        await this.page.waitForSelector('body > div:nth-child(21) > div > div.pop_register.fade.in.modal > div > div > div.content_form > div > div > a');
        await this.page.click('body > div:nth-child(21) > div > div.pop_register.fade.in.modal > div > div > div.content_form > div > div > a');
        break;  
      } catch (error) {
        console.log("Error ao carregar #2");
      }      
    }
            
    //Espera um dos componentes do leitor de texto para depois capturar os cookies
    while(true){
      try {
        await this.page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.layout.mv-material-viewer-toolbar.align-center.justify-space-between.row.fill-height.mv-viewer-toolbar');   
        break;
      } catch (TimeoutError) {
        console.log("limite de espera excedido!");
      }  
    }        

    console.log('capturando cookies...');
    var cookies = await this.page.cookies();
    cookies = cookies.map((cookie) => {
      return {
        ...cookie,
        expires: Date.now() / 1000 + 10 * 60,
        session: false
      };
    });
    const url = await this.page.url();     

    //Inseri cookies em browser secundário        
    this.openOtherBrowser();
    
    return {cookies, url};
  }
  async openOtherBrowser(){    
    //Espera os cookies serem salvos para inseri-los no outro browser
    await this.page.waitFor(5000);
    await this.useSession(this.browser1, this.session);
  }
  async useSession(browser, session){
    
    this.pageHeadless = await browser.newPage();
    for (const cookie of session.cookies) {
      await this.pageHeadless.setCookie(cookie);
    }
    await this.pageHeadless.goto(session.url);   
    this.prosseguir = true;
    await this.browser.close();     
  }
  async waitSessionSave(){
    
  }
}

module.exports = CaptureCookies;

