import { BasePage } from '@core/web/BasePage';

export class DashboardPage extends BasePage {
  private readonly header = this.page.locator('h6.oxd-text--h6');
  private readonly pimMenuItem = this.page.locator('//span[text()="PIM"]');
  private readonly userDropdown = this.page.locator('.oxd-userdropdown-tab');
  private readonly logoutMenuItem = this.page.locator('//a[text()="Logout"]');

  async getHeaderText() {
    return await this.getText(this.header);
  }

  async clickPIM() {
    await this.click(this.pimMenuItem, 'PIM Sidebar Menu');
  }

  async logout() {
    await this.click(this.userDropdown, 'User Dropdown');
    await this.click(this.logoutMenuItem, 'Logout Menu Item');
  }
}
