import { scrapePrice } from "./scrapper";

// Scrape EUR/USD and XAU/USD
async function main() {
    const eurusd = await scrapePrice("EUR=");
    console.log("EUR/USD Price:", eurusd);

    // const xauusd = await scrapePrice("xau-usd");
    // console.log("XAU/USD (Gold) Price:", xauusd);
}

main();