import { BasePage } from '@core/web/BasePage';

export class RegistrationPage extends BasePage {
  private readonly emailInput = this.page.getByPlaceholder('Email');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly registerBtn = this.page.getByRole('button', { name: 'Sign up' });

  async register(email: string, pass: string) {
    await this.fill(this.emailInput, email, 'Email Field');
    await this.fill(this.passwordInput, pass, 'Password Field');
    await this.click(this.registerBtn, 'Register Button');
  }
}
