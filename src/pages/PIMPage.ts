import { BasePage } from '@core/web/BasePage';

export class PIMPage extends BasePage {
  private readonly addButton = this.page.locator('//button[text()=" Add "]');
  private readonly firstNameInput = this.page.locator('input[name="firstName"]');
  private readonly middleNameInput = this.page.locator('input[name="middleName"]');
  private readonly lastNameInput = this.page.locator('input[name="lastName"]');
  private readonly employeeIdInput = this.page.locator('div.oxd-input-group:has-text("Employee Id") input');
  private readonly employeeNameSearchInput = this.page.locator('div.oxd-input-group:has-text("Employee Name") input');
  private readonly employeeIdSearchInput = this.page.locator('div.oxd-input-group:has-text("Employee Id") input');
  private readonly searchButton = this.page.locator('button[type="submit"]:has-text("Search")');
  private readonly fileInput = this.page.locator('input[type="file"]');
  private readonly saveButton = this.page.locator('button[type="submit"]:has-text("Save")');

  async clickAddEmployee() {
    await this.click(this.addButton, 'Add Employee Button');
  }

  async fillEmployeeDetails(first: string, middle: string, last: string, id?: string) {
    await this.fill(this.firstNameInput, first, 'First Name');
    await this.fill(this.middleNameInput, middle, 'Middle Name');
    await this.fill(this.lastNameInput, last, 'Last Name');
    if (id) {
      await this.fill(this.employeeIdInput, id, 'Employee ID');
    }
  }

  async uploadPhoto(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async clickSave() {
    await this.click(this.saveButton, 'Save Button');
  }

  async searchEmployee(name: string) {
    await this.fill(this.employeeNameSearchInput, name, 'Search Employee Name');
    await this.click(this.searchButton, 'Search Button');
  }

  async searchEmployeeById(id: string) {
    await this.fill(this.employeeIdSearchInput, id, 'Search Employee ID');
    await this.click(this.searchButton, 'Search Button');
  }
}
