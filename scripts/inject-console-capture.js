const fs = require('fs');
const path = require('path');

function injectScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
    
    if (content.includes('dashboard-console-capture.js')) {
      return;
    }
    
    if (content.includes('</head>')) {
      content = content.replace('</head>', `  ${scriptTag}\n  </head>`);
    } else if (content.includes('<body>')) {
      content = content.replace('<body>', `<body>\n    ${scriptTag}`);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Injected console capture script into ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function findHtmlFiles(dir) {
  const files = [];
  
  function traverse(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

const buildDir = path.join(process.cwd(), '.next');
const outDir = path.join(process.cwd(), 'out');

if (fs.existsSync(outDir)) {
  const htmlFiles = findHtmlFiles(outDir);
  htmlFiles.forEach(injectScript);
} else if (fs.existsSync(buildDir)) {
  console.log('Next.js build detected. Script will be included via layout.tsx');
}