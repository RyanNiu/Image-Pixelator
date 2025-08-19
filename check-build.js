#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Checking build configuration...\n');

// Check if all required files exist
const requiredFiles = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'index.html',
  'src/main.js',
  'src/utils/pixelator.js',
  'src/utils/i18n.js',
  'src/i18n/translations.js',
  'src/styles/main.css'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

// Check language versions
const languageFiles = [
  'en/index.html',
  'zh/index.html', 
  'es/index.html'
];

console.log('\n🌍 Checking language versions...\n');

languageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...\n');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'build', 'preview'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ npm run ${script}`);
    } else {
      console.log(`❌ npm run ${script} - Missing!`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 All checks passed! Ready for deployment.');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Test: npm run preview');
  console.log('3. Deploy the dist/ folder to your hosting platform');
} else {
  console.log('⚠️  Some files are missing. Please check the errors above.');
  process.exit(1);
}

console.log('='.repeat(50));