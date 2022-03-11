#!/usr/bin/env zx

const posthtml = require('posthtml');
const posthtmlPluginRemoveDuplicates = require('posthtml-plugin-remove-duplicates');
const { insertAt } = require('posthtml-insert-at');
const minifier = require('posthtml-minifier');

const indexPath = path.join(__dirname, './dist/index.html');

const html = await fs.readFile(path.join(__dirname, './dist/index.html'));

posthtml()
  .use(
    // https://github.com/posthtml/posthtml-insert-at
    insertAt({
      selector: 'head',
      append: `
        <script src="/deploy.404.min.js"></script>
      `,
    }),
  )
  // https://github.com/sithmel/posthtml-plugin-remove-duplicates
  .use(posthtmlPluginRemoveDuplicates({ script: true }))
  // https://github.com/kangax/html-minifier https://github.com/Rebelmail/posthtml-minifier
  .use(
    minifier({
      removeComments: true,
      collapseWhitespace: true,
    }),
  )
  .process(html)
  .then((result) => fs.writeFileSync(indexPath, result.html));
