# Hướng dẫn Cài đặt & Cấu hình Jenkins Local chạy Playwright Test

Tài liệu này hướng dẫn từng bước (step-by-step) cách thiết lập Jenkins trên môi trường Windows local để chạy Automation Test Suite với Playwright.

---

## 1. Yêu cầu hệ thống (Prerequisites)
- **Hệ điều hành**: Windows 10/11
- **Node.js**: Đã cài đặt (Project sử dụng v22.17.1)
- **Java**: Yêu cầu JDK 17 hoặc 21 để chạy Jenkins.
  - Cài đặt qua winget (chạy CMD/PowerShell dưới quyền Admin):
    ```powershell
    winget install Microsoft.OpenJDK.21
    ```
  - Verify cài đặt: `java -version`

---

## 2. Download & Khởi chạy Jenkins
Chúng ta sẽ sử dụng file `jenkins.war` (bản Portable) để không cần cài đặt trực tiếp vào hệ thống Windows service.

1. Tạo thư mục `jenkins` trong project: `mkdir E:\Automation\jenkins`
2. Tải file Jenkins WAR bản LTS mới nhất về thư mục này.
3. Mở PowerShell/CMD tại thư mục project, chạy lệnh:
   ```powershell
   java -jar jenkins\jenkins.war --httpPort=9090
   ```
   *(Sử dụng port 9090 để tránh xung đột với các service khác đang chạy port 8080)*

---

## 3. Cấu hình Jenkins Lần đầu (Initial Setup)
1. Truy cập `http://localhost:9090` trên trình duyệt.
2. **Unlock Jenkins**: Lấy mật khẩu khởi tạo trong file `C:\Users\<Your_User>\.jenkins\secrets\initialAdminPassword` và dán vào ô nhập liệu.
3. Chọn **Install suggested plugins** và đợi quá trình cài đặt hoàn tất.
4. Tạo tài khoản **Admin User** (ví dụ: admin / admin).
5. Xác nhận **Instance Configuration** (URL: http://localhost:9090/) và click **Start using Jenkins**.

---

## 4. Cài đặt Plugins Bổ tiết
Từ Dashboard Jenkins, đi tới **Manage Jenkins > Plugins > Available plugins**:

Tìm và cài đặt (chọn checkbox -> Install):
- **NodeJS Plugin**: Để hỗ trợ chạy và quản lý Node.js environment trong Jenkins.
- **Allure Jenkins Plugin**: Để generate và hiển thị Allure report ngay trên Jenkins.
- **HTML Publisher plugin**: Để publish Playwright HTML report (thường đã được cài trong suggested plugins).

Sau khi cài xong, khởi động lại Jenkins nếu cần.

---

## 5. Cấu hình Tools (NodeJS & Allure)
Từ Dashboard, đi tới **Manage Jenkins > Tools**:

1. **NodeJS installations**:
   - Click **Add NodeJS**.
   - Name: `NodeJS` (rất quan trọng, phải khớp với tên trong Jenkinsfile).
   - Check ô **Install automatically**.
   - Chọn version Node.js mới nhất (hoặc version khớp với project).

2. **Allure Commandline installations**:
   - Click **Add Allure Commandline**.
   - Name: `Allure`.
   - Check ô **Install automatically**.
   - Chọn version mới nhất (vd: 2.30.0+).

Click **Save** ở cuối trang.

---

## 6. Cấu hình Jenkinsfile cho Windows
Project đã có sẵn `Jenkinsfile`, nhưng được cấu hình tối ưu cho môi trường Windows local với `customWorkspace`.

Các điểm chú ý trong `Jenkinsfile`:
- Dùng `bat` command thay vì `sh`.
- Set `customWorkspace` trỏ về chính thư mục project `E:\Automation` để Jenkins không copy code sang thư mục workspace mặc định (tiết kiệm thời gian và space).
- Publish HTML và Allure report ở step `post`.

---

## 7. Tạo Pipeline Job & Chạy Test
1. Tại Dashboard, click **New Item**.
2. Nhập tên job (ví dụ: `Playwright-Test-Suite`), chọn loại **Pipeline** -> **OK**.
3. Trong cấu hình Job, cuộn xuống phần **Pipeline**.
4. Ở mục *Definition*, chọn **Pipeline script**.
5. Copy toàn bộ nội dung của file `Jenkinsfile` trong project và paste vào ô Script.
6. Click **Save**.
7. Click **Build Now** để kích hoạt lần chạy đầu tiên.

### Xem Kết quả:
- **Console Output**: Click vào số Build (ví dụ `#1`) -> **Console Output** để xem log chi tiết quá trình cài đặt package và chạy test.
- **Reports**: Sau khi build hoàn thành, ở trang chi tiết của Build sẽ xuất hiện các icon:
  - **Allure Report**: Hiển thị báo cáo Allure chi tiết và trực quan.
  - **Playwright Report**: Báo cáo HTML gốc của Playwright.

---
**Chúc bạn thiết lập và chạy Automation Test thành công! 🚀**
