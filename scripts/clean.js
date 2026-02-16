import { rmSync, existsSync } from 'fs';

const dirs = ['./dist', './temp', './build'];

dirs.forEach(dir => {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`${dir} cleaned!`);
  }
});

console.log('All build directories cleaned!');
