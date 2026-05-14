# Playwright TypeScript E2E Framework

A production-grade, modular end-to-end automation framework built with Playwright and TypeScript.

## Features
- **Multi-Platform**: Support for Web (Chromium, Firefox, Webkit), Mobile Emulation, and Electron Desktop apps.
- **API Testing**: Dedicated module for REST API validation.
- **Database Support**: Robust module for PostgreSQL and MySQL validation.
- **CI/CD Ready**: Pre-configured `Jenkinsfile` with credential handling and Docker support.
- **Reporting**: Integrated Allure and Playwright HTML reports.
- **Logging**: Advanced Winston-based logging for UI, API, and DB actions.
- **Strict Typing**: Full TypeScript implementation with path aliases.

## Project Structure
```text
├── config/             # Environment configurations
├── src/
│   ├── core/           # Base wrappers (Web, API, Mobile, DB, App)
│   ├── pages/          # Page Object Model classes
│   ├── tests/          # Organized by platform (web, mobile, api, db)
│   └── utils/          # Common helpers (logger, data, env)
├── Jenkinsfile         # CI/CD pipeline definition
└── playwright.config.ts # Playwright main configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Allure CLI (optional, for reporting)

### Installation
```bash
npm install
npx playwright install
```

### Running Tests

### Standard Execution (Headed by Default)
The framework is configured to run in **headed mode** by default to allow visual inspection.
```bash
# Run all tests
npm run test

# Run a specific test suite or test case file
npx playwright test src/tests/web/orangeHRM.spec.ts

# Run a specific test suite or test case file with custom log directory
node scripts/run-test.js --log Run_TC01 src/tests/web/suite/TC01_Login.spec.ts

# Run specific project in headless mode (override config)
npx playwright test --headless

# Run tests with a specific browser project
npx playwright test --project=chromium

# Run tests with a specific project and custom log directory
npx playwright test --project=chromium --log Run_TC01

# Show report for a specific project
npx playwright show-report Run_TC01/playwright-report
```

### Reporting
The framework supports both Playwright HTML Report and Allure Report.

```bash
# Open Playwright HTML Report
npx playwright show-report

# Generate and open Allure Report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### Visual Execution & Debugging
- **Headed Mode**: Configured in `playwright.config.ts`. Browser opens automatically.
- **Auto-Screenshots**: Every action (click, fill, navigate) automatically takes a screenshot and attaches it to the report.
- **Tracing**: Use `npx playwright show-trace` to view execution traces if enabled.

## Architecture & Workflows
- **BasePage**: Wraps Playwright actions with automatic `test.step()` logging and screenshots.
- **Business Flows**: Located in `src/flows/`, these group common actions (e.g., `loginFlow`) for maximum reusability.
- **Multi-Platform**: Tests in `src/tests/sanity/` are designed to run on both Desktop and Mobile Emulation.

## Environment Configuration
Create a `.env` file in the `config/` directory with the following variables:
- `BASE_URL`
- `API_URL`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `ENVIRONMENT`
