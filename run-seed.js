const { exec } = require('child_process');
const path = require('path');

console.log('Running seed file...');

const seedProcess = exec('node seed-complete.js', {
  cwd: path.join(__dirname, 'travelbharat-backend'),
  stdio: 'inherit'
});

seedProcess.on('close', (code) => {
  console.log(`Seed process exited with code ${code}`);
  if (code === 0) {
    console.log('✅ Database seeded successfully!');
  } else {
    console.log('❌ Seeding failed');
  }
});
