import { Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PIMPage } from '@pages/PIMPage';

export class OrangeHRMFlows {
  private page: Page;
  private loginPage: LoginPage;
  private dashboardPage: DashboardPage;
  private pimPage: PIMPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.pimPage = new PIMPage(page);
  }

  async loginFlow(username: string, password: string) {
    await this.loginPage.login(username, password);
    const header = await this.dashboardPage.getHeaderText();
    return header;
  }

  async addEmployeeFlow(details: { first: string; middle: string; last: string; id?: string }) {
    await this.dashboardPage.clickPIM();
    await this.pimPage.clickAddEmployee();
    await this.pimPage.fillEmployeeDetails(details.first, details.middle, details.last, details.id);
    await this.pimPage.clickSave();
  }

  async searchEmployeeFlow(employeeId: string) {
    await this.dashboardPage.clickPIM();
    const employeeIdSearchInput = this.page.locator('div.oxd-input-group:has-text("Employee Id") input').first();
    await employeeIdSearchInput.fill(employeeId);
    await this.page.locator('button[type="submit"]').click();
  }

  async updatePersonalDetailsFlow(details: { nationality: string; dob: string }) {
    // Assuming already on personal details page after adding/searching
    await this.page.locator('label:has-text("Nationality") + div').click();
    await this.page.locator(`div[role="listbox"] span:has-text("${details.nationality}")`).click();
    
    const dobInput = this.page.locator('label:has-text("Date of Birth") + div input');
    await dobInput.fill(details.dob);
    
    await this.page.locator('button[type="submit"]').first().click();
  }
}
