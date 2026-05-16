# Toàn cảnh Vòng đời (Lifecycle) của dự án Test Automation bằng Playwright

Tài liệu này dành cho người mới (Beginner), giúp bạn hiểu được bức tranh tổng thể và luồng làm việc (workflow) từ khi bắt đầu cài đặt máy tính cho đến khi viết, chạy test case và xem báo cáo.

---

## Giai đoạn 1: Chuẩn bị Môi trường (Environment Setup)

Trước khi bắt đầu bất cứ thứ gì, máy tính của bạn cần phải có các công cụ để lập trình và chạy code.

1. **Cài đặt IDE**: Tải và cài đặt [Visual Studio Code (VS Code)](https://code.visualstudio.com/). Đây là phần mềm phổ biến nhất để viết code.
2. **Cài đặt Node.js**: Tải và cài đặt [Node.js (Bản LTS)](https://nodejs.org/). Đây là môi trường chạy (runtime) để thực thi code JavaScript/TypeScript.
3. **Cài đặt Allure CLI (Tùy chọn)**: Dùng để xem báo cáo đẹp mắt hơn. Cài thông qua npm: `npm install -g allure-commandline`.
4. **Tải mã nguồn (Clone Source Code)**: Dùng Git để tải dự án này về máy hoặc giải nén thư mục dự án.
5. **Cài đặt Thư viện (Dependencies)**:
   - Mở Terminal trong VS Code (phím tắt \`Ctrl + \`\`).
   - Chạy lệnh: `npm install` (Lệnh này sẽ tải toàn bộ thư viện khai báo trong file `package.json` về máy của bạn).
   - Chạy lệnh: `npx playwright install` (Lệnh này yêu cầu Playwright tự động tải về các trình duyệt web như Chromium, Firefox, WebKit để sẵn sàng chạy test).

---

## Giai đoạn 2: Khám phá Cấu trúc Dự án (Project Structure)

Để dễ dàng viết test, bạn cần biết code của chúng ta được sắp xếp như thế nào.

- **`config/`**: Chứa các file biến môi trường (`.env`), lưu các thông tin nhạy cảm và khác nhau giữa các môi trường (ví dụ URL, Tài khoản Database).
- **`src/core/`**: Chứa các file gốc của framework (VD: `BasePage.ts`). `BasePage` đã được tích hợp sẵn khả năng tự động chụp màn hình và ghi log cho mọi thao tác click, điền text...
- **`src/pages/`**: Chứa các "Page Object" (Mô hình POM). Ví dụ bạn có màn hình Đăng Nhập, bạn sẽ tạo `LoginPage.ts` chứa các nút bấm (locators) và hành động (nhập user/pass, bấm nút Login).
- **`src/tests/`**: Nơi chứa các kịch bản test thực sự (`*.spec.ts`). Các file này sẽ gọi đến các Page Object để thực thi logic.
- **`playwright.config.ts`**: "Trái tim" của framework. Cấu hình mọi thứ như: thời gian timeout, số lần chạy lại (retries), chế độ có giao diện hay chạy ngầm (headed/headless), báo cáo, v.v.

---

## Giai đoạn 3: Luồng viết 1 Test Case mới (Authoring)

Giả sử bạn được giao nhiệm vụ viết 1 test case kiểm tra tính năng "Tìm kiếm nhân viên". Bạn sẽ làm theo các bước sau:

### Bước 3.1: Định nghĩa giao diện (Page Object)
1. Mở file Page Object tương ứng (ví dụ `PIMPage.ts` trong `src/pages/`).
2. **Xác định Locators**: Tìm phần tử (thẻ HTML) của ô "Search" và nút "Search" trên web, dùng công cụ Inspect (F12) trên Chrome.
3. **Viết Locator**:
   ```typescript
   private readonly searchInput = this.page.locator('input[placeholder="Search"]');
   ```
4. **Viết Action (Hành động)**:
   ```typescript
   async searchEmployee(name: string) {
     await this.fill(this.searchInput, name, 'Ô Tìm kiếm Nhân viên');
     // this.fill được kế thừa từ BasePage, tự động ghi log và chụp ảnh!
   }
   ```

### Bước 3.2: Viết kịch bản Test (Spec)
1. Mở (hoặc tạo) file test, ví dụ: `src/tests/web/orangeHRM.spec.ts`.
2. Định nghĩa một `test()` block chứa các bước (`test.step`).
   ```typescript
   test('Tìm kiếm nhân viên thành công', async ({ page }) => {
     await test.step('Bước 1: Đăng nhập', async () => {
       await loginPage.login('Admin', 'admin123');
     });

     await test.step('Bước 2: Tìm kiếm', async () => {
       await dashboardPage.clickPIM();
       await pimPage.searchEmployee('John Doe');
     });

     await test.step('Bước 3: Xác minh kết quả', async () => {
       // Code kiểm tra xem John Doe có hiện ra không
       await expect(page.locator('.employee-table')).toContainText('John Doe');
     });
   });
   ```

---

## Giai đoạn 4: Chạy thử (Execution)

Sau khi viết xong, bạn cần chạy xem test case của mình có pass hay fail.

- **Chạy 1 file test cụ thể**:
  Mở Terminal và gõ: 
  ```bash
  npx playwright test src/tests/web/orangeHRM.spec.ts
  ```
  *Mặc định hệ thống sẽ mở trình duyệt lên để bạn nhìn thấy các thao tác tự động đang diễn ra (Headed mode).*

- **Chạy toàn bộ Folder Tests**:
  Khi bạn đã chắc chắn script của mình chạy ổn, bạn có thể kiểm tra xem nó có phá hỏng các script khác trong dự án hay không bằng cách chạy toàn bộ test:
  ```bash
  npm run test
  ```
- **Chạy toàn bộ Test Suite (Nhiều file)**:
  ```bash
npx playwright test src/tests/web/suite
```
- **Chạy với 1 trình duyệt cụ thể** (VD Chỉ chạy Chrome):
  ```bash
  npx playwright test --project=chromium
  ```

---

## Giai đoạn 5: Xem Báo cáo & Gỡ lỗi (Reporting & Debugging)

Khi test chạy xong, bất kể Pass hay Fail, hệ thống đều sinh ra báo cáo rất chi tiết. Nếu có test case bị Fail, báo cáo là công cụ quan trọng nhất để bạn biết lỗi do đâu.

- **Sử dụng Báo cáo mặc định của Playwright**:
  ```bash
  npx playwright show-report
  ```
  Báo cáo HTML sẽ mở lên trên trình duyệt. Bạn có thể xem từng bước (`test.step`), xem thông báo lỗi, và đặc biệt là xem **Ảnh chụp màn hình (Screenshots)** đính kèm tự động từ `BasePage`.

- **Sử dụng Allure Report (Chuyên nghiệp hơn)**:
  Allure cung cấp giao diện dashboard thống kê rất đẹp.
  ```bash
  npx allure generate allure-results --clean -o allure-report
  npx allure open allure-report
  ```

---

## Giai đoạn 6: Đưa lên Hệ thống Tự động hóa (CI/CD)

Vòng đời cuối cùng của một script Automation là được chạy hoàn toàn tự động hàng ngày (hoặc mỗi khi Dev có tính năng mới).

- Bạn chỉ cần Commit và Push code của mình lên Git (GitHub, GitLab, Bitbucket...).
- Dự án đã được cấu hình sẵn file `Jenkinsfile` (dành cho hệ thống CI/CD Jenkins).
- Jenkins sẽ tự động bắt lấy code mới của bạn, cài môi trường ngầm trên Server, tự chạy lệnh `npx playwright test --headless`, tự động thu thập kết quả Pass/Fail và gửi báo cáo về Email/Slack cho cả team phát triển.

***Hoàn thành! Bạn đã nắm được toàn cảnh cách mà Automation Testing với Playwright vận hành trong môi trường thực tế.***
