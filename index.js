const puppeteer = require('puppeteer');
const argFundcode = process.argv[2] || '';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://codequiz.azurewebsites.net/', {
    waitUntil: ['domcontentloaded','networkidle2'],
  });

  await page.waitForSelector('input[type=button]');
  await page.click('[value=Accept]');
  await page.screenshot({ path: 'screenshot.png'});

  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('td'))
    return tds.map(td => td.innerText);
  })

  let obj = {};
  let prevKey = ""

  for(let i=0; i < data.length; i++){
    if(isNaN(data[i])) {
      obj[data[i]] = [];
      prevKey = data[i];
    } else {
      obj[prevKey].push(data[i]);
    }
  };

  if(argFundcode === '') {
    console.log('No FUNDCODE input');
  } else {
    const nav = obj[argFundcode] && obj[argFundcode][0];
    console.log(`${argFundcode} NAV =>  ${nav}`);
  }
  
  await browser.close();
})();