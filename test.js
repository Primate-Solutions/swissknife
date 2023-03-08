// Code

const { program } = require('commander');
const cheerio = require('cheerio');
const bent = require('bent');

program
	.argument("<url>")
	.argument("<selectors...>")
	.action(async (url, selectors) => {
		const contents = await bent("string")(url);
		const $ = cheerio.load(contents);

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

// Output
//
// > node index.js "https://news.ycombinator.com/item?id=3996380" title .hnuser .age
// Selector	Text
// title	Little story: So I walk into a bar in Belgrade, Serbia. Turns out to be a privat... | Hacker News
// .hnuser	redwood
// .age	on May 19, 2012
