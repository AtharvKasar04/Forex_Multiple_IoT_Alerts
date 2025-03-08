import puppeteer from "puppeteer";
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

export async function scrapePrice(symbol: string): Promise<string | null> {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });
        page.setDefaultNavigationTimeout(60000);

        const url = `${BASE_URL}${symbol}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const priceSelector = 'span.QuoteStrip-lastPrice';

        let price = null;
        try {
            await page.waitForSelector(priceSelector, { timeout: 5000 });
            price = await page.$eval(priceSelector, el => el.textContent?.trim() ?? null);
        } catch (error) {
            console.error(`Error finding price element for ${symbol}:`, error);
            return null;
        }

        return price;
    } catch (error) {
        console.error(`Error scraping price for ${symbol}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}
