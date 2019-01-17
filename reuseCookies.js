//import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');

var session = '';
var browser;

const createSession = async (browser, startUrl) => {
  const page = await browser.newPage();

  await page.goto(startUrl);

  //await page.waitForSelector('#submit');
  console.log('carregando página...');
  await page.waitFor(30000);
 
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

  session = await createSession(browser, 'https://www.passeidireto.com/arquivo/44072199/bases-numericas');

  
};
async function openOtherBrowser(){
  const browser1 = await puppeteer.launch();
  // The session has been established
  await useSession(browser1, session);

  //await useSession(browser, session);
}
async function captureScreen(page){
  await page.emulateMedia('screen');
  await page.waitFor(10000);
  await page.screenshot({path: 'screenHide.png'});  
  await browser.close();
}

run(); //Inicializador 