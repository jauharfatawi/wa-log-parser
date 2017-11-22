#!/usr/bin/env node

const program = require('commander');
const waLogParser = require('../lib/wa-log-parser.js');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .arguments('<file>')
  .action((file) => {
    waLogParser
      .parse(file)
      .then((data) => {
        /* eslint no-console: "off" */
        console.log(JSON.stringify(data, null, 2));
      });
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
