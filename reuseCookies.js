const puppeteer = require('puppeteer');

var session;
var browser;
var url = 'https://www.passeidireto.com/arquivo/44072199/bases-numericas';

const createSession = async (browser, startUrl) => {
  const page = await browser.newPage();

  await page.goto(startUrl);
  
  //Realiza o procedimento de click para chegar nas opções de autenticar pelo Google, Facebook ou próprio Passei Direto.
  await page.waitForSelector('#pd-view > section > div.card_default.card_type_file.header > div > div > ul > li > div > button');
  await page.click('#pd-view > section > div.card_default.card_type_file.header > div > div > ul > li > div > button');
  await page.waitForSelector('body > div:nth-child(21) > div > div.pop_register.fade.in.modal > div > div > div.content_form > div > div > a');
  await page.click('body > div:nth-child(21) > div > div.pop_register.fade.in.modal > div > div > div.content_form > div > div > a');

  //Espera um dos componentes do leitor de texto para depois capturar os cookies
  await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.layout.mv-material-viewer-toolbar.align-center.justify-space-between.row.fill-height.mv-viewer-toolbar'); 

  console.log('capturando cookies...');
  var cookies = await page.cookies();
  cookies = cookies.map((cookie) => {
    return {
      ...cookie,
      expires: Date.now() / 1000 + 10 * 60,
      session: false
    };
  });
  const url = await page.url();

  //Inseri cookies em browser secundário
  openOtherBrowser();
    
  return {cookies, url};
};

const useSession = async (browser, session) => {
  const page = await browser.newPage();
  for (const cookie of session.cookies) {
    await page.setCookie(cookie);
  }
  await page.goto(session.url);
  captureScreen(page);
};

const run = async () => {
  browser = await puppeteer.launch({headless: false});
  session = await createSession(browser, url);  
};
async function openOtherBrowser(){
  const browser1 = await puppeteer.launch({headless: false});
  // The session has been established
  await useSession(browser1, session);
}
async function captureScreen(page){
  await page.emulateMedia('screen');
  await page.waitFor(10000);
  await page.screenshot({path: 'screenHide.png'});  
  await browser.close();
}

run(); //Inicializador 