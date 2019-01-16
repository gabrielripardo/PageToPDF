import puppeteer from 'puppeteer';

const createSession = async (browser, startUrl) => {
  const page = await browser.newPage();

  await page.goto(startUrl);

  //await page.waitForSelector('#submit');

  const cookies = await page.cookies();
  const url = await page.url();

  return {
    cookies,
    url
  };
};

const useSession = async (browser, session) => {
  const page = await browser.newPage();

  for (const cookie of session.cookies) {
    await page.setCookie(cookie);
  }

  await page.goto(session.url);
};

const run = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const session = await createSession(browser, 'https://www.passeidireto.com/arquivo/44072199/bases-numericas');

  // The session has been established
  await useSession(browser, session);
  await useSession(browser, session);
};

run();