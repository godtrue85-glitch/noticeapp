import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['index.html', 'src/app.js', 'src/styles.css'];
await Promise.all(requiredFiles.map((file) => access(file)));

const requiredSnippets = ['./src/styles.css', './src/app.js', '미션 알림장', 'missionList', 'shopList'];
const conflictMarkers = ['<'.repeat(7), '='.repeat(7), '>'.repeat(7)];

const index = await readFile('index.html', 'utf8');
for (const expected of requiredSnippets) {
  if (!index.includes(expected)) {
    throw new Error(`index.html is missing ${expected}`);
  }
}

for (const file of requiredFiles) {
  const contents = await readFile(file, 'utf8');
  const marker = conflictMarkers.find((candidate) => contents.includes(candidate));
  if (marker) {
    throw new Error(`${file} contains unresolved merge conflict marker ${marker}`);
  }
}

console.log('Static site files are present, linked, and free of merge conflict markers.');
