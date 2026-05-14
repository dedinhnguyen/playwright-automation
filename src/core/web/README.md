# Web Core Module

## Responsibility
This module provides a robust wrapper around Playwright's Page and Locator objects to standardize common web interactions. It ensures that every action is logged and provides built-in error handling/waiting strategies.

## Key Components
- `BasePage`: The abstract base class that all Page Objects should extend.

## Usage
### Creating a Page Object
```typescript
import { BasePage } from '@core/web/BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('#user');
  
  async login(user: string) {
    await this.fill(this.usernameInput, user, 'Username Input');
    await this.click(this.submitBtn, 'Submit Button');
  }
}
```

### Methods
- `navigateTo(path)`: Go to a specific URL.
- `click(locator, name)`: Click an element with logging.
- `fill(locator, value, name)`: Type into a field with logging.
- `assertTitle(expected)`: Validate page title.
