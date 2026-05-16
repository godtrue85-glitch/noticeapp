import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['index.html', 'src/app.js', 'src/styles.css'];
await Promise.all(requiredFiles.map((file) => access(file)));

const index = await readFile('index.html', 'utf8');
for (const expected of ['./src/styles.css', './src/app.js', '미션 알림장', 'missionList', 'shopList']) {
  if (!index.includes(expected)) {
    throw new Error(`index.html is missing ${expected}`);
  }
}

console.log('Static site files are present and linked.');
