import { scrapeEURUSD } from "./scrapper";

async function main() {
    const priceStr = await scrapeEURUSD();

    if (priceStr) {
        const price = parseFloat(priceStr);
        console.log(price);
    } else {
        console.log("Failed to fetch EURUSD price.");
    }
}

main();