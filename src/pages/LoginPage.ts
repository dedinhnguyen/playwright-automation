import { BasePage } from '@core/web/BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  private readonly loginButton = this.page.locator('button[type="submit"]');

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username, 'Username Input');
    await this.fill(this.passwordInput, password, 'Password Input');
    await this.click(this.loginButton, 'Login Button');
  }
}
