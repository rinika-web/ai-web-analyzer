import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function launchBrowser() {
    return puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
    });
}