import * as fs from 'fs/promises';
import { Page } from 'puppeteer';
import { Location } from './regions';

export class Parser {
  productName: string;
  resultsPath: string = 'results';
  constructor(
    public readonly page: Page,
    public readonly url: string,
    public readonly location: Location,
  ) {
    const splittedUrl = url.split('/');
    this.productName = splittedUrl[splittedUrl.length - 1];
  }

  async init(): Promise<void> {
    await this.page.goto(this.url);
    await new Promise((r) => setTimeout(r, 15000));
    await this.createProductFolder();
  }

  async setLocation(location: Location): Promise<void> {
    const regionButton = await this.page
      .locator('.UiHeaderHorizontalBase_region__2ODCG')
      .waitHandle();
    const region = await regionButton.evaluate((el) => el.textContent);
    if (region !== Location[location]) {
      await regionButton.click();
      await new Promise((r) => setTimeout(r, 5000));
      await this.page.waitForSelector('.UiRegionListBase_list__cH0fK');
      const regionsList = await this.page.$$('.UiRegionListBase_item___ly_A');
      const regionListItemsTexts = await Promise.all(
        regionsList.map(async (n) => await n.evaluate((el) => el.textContent)),
      );
      const regionIndex = regionListItemsTexts.findIndex((item) => item === Location[location]);
      regionsList[regionIndex].click();
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
  private async createProductFolder(): Promise<void> {
    if (!(await fs.readdir('./')).includes(this.resultsPath)) {
      await fs.mkdir(this.resultsPath);
    }
    if (!(await fs.readdir(`./${this.resultsPath}/`)).includes(Location[this.location])) {
      await fs.mkdir(`./${this.resultsPath}/${Location[this.location]}`);
    }
    if (
      !(await fs.readdir(`./${this.resultsPath}/${Location[this.location]}/`)).includes(
        this.productName,
      )
    ) {
      await fs.mkdir(`./${this.resultsPath}/${Location[this.location]}/${this.productName}`);
    }
  }

  async saveParsingResults(): Promise<void> {
    const jsonData = await this.page.locator('#__NEXT_DATA__').waitHandle();
    const dataObj = JSON.parse(await jsonData.evaluate((el) => el.textContent));
    const productProperties = {
      priceOld: dataObj.props.pageProps.initialStore.productPage.product.oldPrice,
      price: dataObj.props.pageProps.initialStore.productPage.product.price,
      rating: dataObj.props.pageProps.initialStore.productPage.owox.reviewsRating,
      reviewCount: dataObj.props.pageProps.initialStore.productPage.owox.reviewsCount,
    };
    const savePath = `./${this.resultsPath}/${Location[this.location]}/${this.productName}`;
    await fs.writeFile(`${savePath}/product.txt`, JSON.stringify(productProperties));
  }

  async saveScreenshot(): Promise<void> {
    await new Promise((r) => setTimeout(r, 1000));

    await this.page.screenshot({
      type: 'jpeg',
      path: `./${this.resultsPath}/${Location[this.location]}/${this.productName}/screenshot.jpeg`,
      optimizeForSpeed: true,
      fullPage: true,
    });
  }
}
