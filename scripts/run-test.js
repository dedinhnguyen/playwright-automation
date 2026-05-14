const { execSync } = require('child_process');

const args = process.argv.slice(2);
let logDir = 'logs'; // Default log directory
let playwrightArgs = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--log') {
    logDir = args[i + 1];
    i++; // Skip the path argument
  } else {
    // Preserve arguments with spaces properly, e.g., --project="Mobile Chrome"
    if (args[i].includes(' ')) {
      playwrightArgs.push(`"${args[i]}"`);
    } else {
      playwrightArgs.push(args[i]);
    }
  }
}

console.log(`\n==============================================`);
console.log(`[INFO] Setting log directory to: ${logDir}`);
console.log(`==============================================\n`);

process.env.LOG_DIR = logDir;

try {
  // Execute the underlying Playwright test command
  execSync(`npx playwright test ${playwrightArgs.join(' ')}`, { stdio: 'inherit' });
} catch (error) {
  // Exit with non-zero code to fail the CI/build if tests fail
  process.exit(1);
}
