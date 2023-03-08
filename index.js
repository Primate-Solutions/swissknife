const { program } = require('commander');
const cheerio = require('cheerio');
const bent = require('bent');

program
  .argument("<url>")
  .argument("<selectors...>")
  .action(async (url, selectors) => {
    const contents = await bent("string")(url); // get the page at the given URL
    const $ = cheerio.load(contents); // process it

    // Use the tab space character for separating columns.
    const separator = "\t";
    console.log("Selector" + separator + "Text") // header row
    for (const selector of selectors) {
      const text = $(selector).first().text();
      console.log(selector + separator + text);
    }
  });

program.addHelpText('before', `\
For the page at the given URL, fetch the first HTML element that match each
given selector and return their text values in CSV format.`);

program.addHelpText('after', `\

Example:
  $ swissknife https://news.ycombinator.com title`);


program.parse();
