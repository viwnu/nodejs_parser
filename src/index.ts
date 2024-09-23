import puppeteer, { Browser, Page } from 'puppeteer';
import { Parser } from './parser';
import { Location } from './regions';

async function parseSingleProduct(page: Page, productUrl: string, region: string = Location[0]) {
  const parser = new Parser(page, productUrl, Location[region]);
  await parser.init();
  await parser.setLocation(Location[region]);
  await parser.saveParsingResults();
  await parser.saveScreenshot();
}

async function parseMultipleProducts(browser: Browser, productUrls, locations) {
  let context = await browser.createBrowserContext();
  let page = await context.newPage();
  await page.setViewport({ width: 1920, height: 800 });
  for (const location of locations) {
    console.log('location: ', location);
    for (const productUrl of productUrls) {
      console.log('productUrl: ', productUrl);
      try {
        await parseSingleProduct(page, productUrl, location);
      } catch (error) {
        context.close();
        context = await browser.createBrowserContext();
        page = await context.newPage();
        await page.setViewport({ width: 1920, height: 800 });
        await parseSingleProduct(page, productUrl, location);
      }
    }
  }
}

async function run() {
  const browser = await puppeteer.launch({ headless: false });

  if (process.argv[process.argv.length - 1] === 'multiple') {
    const locationsStartIndex = process.argv.findIndex((arg) => arg === 'locations');

    const productUrls = process.argv
      .slice(2, locationsStartIndex)
      .filter((arg) => arg && arg !== undefined && arg !== 'undefined');

    console.log('productUrls: ', productUrls);

    const locations = process.argv.slice(locationsStartIndex + 1, process.argv.length - 1);
    console.log('locations: ', locations);

    // eslint-disable-next-line prefer-const
    // let locations = [];
    // for (const item in Location) {
    //   if (isNaN(Number(item))) locations.push(item);
    // }

    await parseMultipleProducts(browser, productUrls, locations);
  } else {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 800 });
    await parseSingleProduct(page, process.argv[2], process.argv[3]);
  }

  await browser.close();
}

run();

// 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202' 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778' 'https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739' 'https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403' 'https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737' 'https://www.vprok.ru/product/lavazza-kofe-lavazza-1kg-oro-zerno--450647' 'https://www.vprok.ru/product/parmalat-parmal-moloko-pit-ulster-3-5-1l--306634' 'https://www.vprok.ru/product/perekrestok-spmi-svinina-duhovaya-1kg--1131362' 'https://www.vprok.ru/product/vinograd-kish-mish-1-kg--314623' 'https://www.vprok.ru/product/eko-kultura-tomaty-cherri-konfetto-250g--946756' 'https://www.vprok.ru/product/bio-perets-ramiro-1kg--476548' 'https://www.vprok.ru/product/korkunov-kollektsiya-shokoladnyh-konfet-korkunov-iz-molochnogo-shokolada-s-fundukom-karamelizirovannym-gretskim-orehom-vafley-svetloy-orehovoy--1295690' 'https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996' 'https://www.vprok.ru/product/ritter-sport-rit-sport-shokol-tsel-les-oreh-mol-100g--305088' 'https://www.vprok.ru/product/lays-chipsy-kartofelnye-lays-smetana-luk-140g--1197579' 'locations' 'Санкт-Петербург и область' 'Владимирская обл.' 'Калужская обл.' 'Рязанская обл.' 'Тверская обл.' 'Тульская обл.' 'multiple'

// 'https://www.vprok.ru/product/bio-perets-ramiro-1kg--476548' 'https://www.vprok.ru/product/korkunov-kollektsiya-shokoladnyh-konfet-korkunov-iz-molochnogo-shokolada-s-fundukom-karamelizirovannym-gretskim-orehom-vafley-svetloy-orehovoy--1295690' 'https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996' 'https://www.vprok.ru/product/ritter-sport-rit-sport-shokol-tsel-les-oreh-mol-100g--305088' 'https://www.vprok.ru/product/lays-chipsy-kartofelnye-lays-smetana-luk-140g--1197579' 'locations' 'Санкт-Петербург и область' 'multiple'

// 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202' 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778' 'https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739' 'https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403' 'https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737' 'https://www.vprok.ru/product/lavazza-kofe-lavazza-1kg-oro-zerno--450647' 'https://www.vprok.ru/product/parmalat-parmal-moloko-pit-ulster-3-5-1l--306634' 'https://www.vprok.ru/product/perekrestok-spmi-svinina-duhovaya-1kg--1131362' 'https://www.vprok.ru/product/vinograd-kish-mish-1-kg--314623' 'https://www.vprok.ru/product/eko-kultura-tomaty-cherri-konfetto-250g--946756' 'https://www.vprok.ru/product/bio-perets-ramiro-1kg--476548' 'https://www.vprok.ru/product/korkunov-kollektsiya-shokoladnyh-konfet-korkunov-iz-molochnogo-shokolada-s-fundukom-karamelizirovannym-gretskim-orehom-vafley-svetloy-orehovoy--1295690' 'https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996' 'https://www.vprok.ru/product/ritter-sport-rit-sport-shokol-tsel-les-oreh-mol-100g--305088' 'https://www.vprok.ru/product/lays-chipsy-kartofelnye-lays-smetana-luk-140g--1197579' 'locations' 'Владимирская обл.' 'Калужская обл.' 'Рязанская обл.' 'Тверская обл.' 'Тульская обл.' 'multiple'
