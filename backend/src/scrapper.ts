import puppeteer from "puppeteer";

const URL = "https://in.investing.com/currencies/eur-usd";

export async function scrapeEURUSD(): Promise<string | null> {
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
        
        // Set default navigation timeout
        page.setDefaultNavigationTimeout(60000);
        
        // Navigate with domcontentloaded instead of networkidle0
        await page.goto(URL, { waitUntil: "domcontentloaded" });
        
        const priceSelector = 'div.text-5xl\\/9.font-bold.text-\\[\\#232526\\].md\\:text-\\[42px\\].md\\:leading-\\[60px\\]';
        
        let price = null;
        try {
            await page.waitForSelector(priceSelector, { timeout: 5000 });
            price = await page.$eval(priceSelector, el => el.textContent?.trim() ?? null);
        } catch (error) {
            console.error("Error finding price element:", error);
            return null;
        }
        
        return price;
    } catch (error) {
        console.error("Error scraping price:", error);
        return null;
    } finally {
        await browser.close();
    }
}
