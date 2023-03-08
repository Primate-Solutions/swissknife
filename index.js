#!/usr/bin/env node
const { program } = require('commander');
const { chromium, devices } = require('playwright');

program
  .argument("<url>")
  .argument("<locators...>")
  .action(async (url, locators) => {
    // Playwright setup.
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['Desktop Chrome']);
    const page = await context.newPage();

    // Don't load images.
    await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
    await page.goto(url);

    // Use the tab space character for separating columns.
    const separator = "\t";
    const rows = ["Locator" + separator + "Text"]; // header row
    for (const locator of locators) {
      const text = await page.locator(locator).first().innerText();
      rows.push(locator + separator + text);
    }
    console.log(rows.join("\n"));

    await browser.close();
  });

program.addHelpText('before', `\
For the page at the given URL, fetch the first HTML element that match each
given Playwright locator and return their text values in CSV format.`);

program.addHelpText('after', `\

Example:
  $ swissknife https://news.ycombinator.com title

Learn about Playwright locators: https://playwright.dev/docs/other-locators`);

program.parse();
