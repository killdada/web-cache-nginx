#!/usr/bin/env zx

const posthtml = require('posthtml');
const { insertAt } = require('posthtml-insert-at');

const indexPath = path.join(__dirname, './dist/index.html');

const html = await fs.readFile(path.join(__dirname, './dist/index.html'));

// https://github.com/posthtml/posthtml-insert-at
posthtml()
  .use(
    insertAt({
      selector: 'head',
      append: `
        <script src="/deploy-404.js"></script>
      `,
    }),
  )
  .process(html)
  .then((result) => fs.writeFileSync(indexPath, result.html));
