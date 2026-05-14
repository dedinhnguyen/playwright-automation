# Hướng Dẫn Chạy Test Case Trên Máy Remote (Remote Browser Execution)

Tài liệu này hướng dẫn cách bạn có thể trigger chạy test case bằng Playwright trên máy tính hiện tại (Local), nhưng trình duyệt (Chrome) lại được mở và thực thi trên một máy tính khác (Remote - ví dụ IP: `10.168.188.24`).

Có 2 cách phổ biến để làm việc này. Dưới đây là hướng dẫn Step-by-Step cho từng cách.

---

## Cách 1: Sử dụng Playwright Server (Khuyên dùng)

Cách này ổn định nhất và được Playwright hỗ trợ native. Bạn sẽ khởi chạy một Playwright Server trên máy Remote để lắng nghe các kết nối từ máy Local.

### Step 1: Thiết lập trên máy Remote (IP: 10.168.188.24)
1. Hãy chắc chắn rằng máy Remote đã được cài đặt **Node.js**.
2. Mở Terminal (Command Prompt hoặc PowerShell) trên máy Remote.
3. Cài đặt Playwright nếu chưa có (có thể tạo một folder trống rồi chạy lệnh sau):
   ```bash
   npm init -y
   npm install -D @playwright/test
   npx playwright install chromium
   ```
4. Khởi chạy Playwright Server bằng lệnh sau (để server lắng nghe trên tất cả các IP và cổng 8080):
   ```bash
   npx playwright run-server --port 8080 --host 0.0.0.0
   ```
   *Lưu ý: Bạn phải đảm bảo Firewall trên máy Remote cho phép kết nối đến cổng `8080`.*
   *Playwright server sẽ in ra một endpoint giống như: `ws://0.0.0.0:8080/28f9c...` (có kèm token hoặc không).*

### Step 2: Chạy Test trên máy Local
1. Mở Terminal tại thư mục project automation trên máy Local.
2. Bạn cần thiết lập biến môi trường `PW_TEST_CONNECT_WS_ENDPOINT` trỏ tới IP của máy Remote.
   
   **Trên Windows (PowerShell):**
   ```powershell
   $env:PW_TEST_CONNECT_WS_ENDPOINT="ws://10.168.188.24:8080/"
   npx playwright test --project=chromium
   ```

   **Trên Windows (CMD):**
   ```cmd
   set PW_TEST_CONNECT_WS_ENDPOINT=ws://10.168.188.24:8080/
   npx playwright test --project=chromium
   ```

   **Trên macOS/Linux:**
   ```bash
   PW_TEST_CONNECT_WS_ENDPOINT=ws://10.168.188.24:8080/ npx playwright test --project=chromium
   ```
3. Test case sẽ được chạy logic ở Local, nhưng UI của trình duyệt sẽ hiển thị trên máy Remote `10.168.188.24`.

---

## Cách 2: Kết nối trực tiếp vào Chrome đang mở qua CDP (Chrome DevTools Protocol)

Cách này được dùng nếu bạn chỉ muốn mở thẳng ứng dụng Google Chrome có sẵn trên máy Remote thay vì tải trình duyệt của Playwright.

### Step 1: Mở Chrome trên máy Remote ở chế độ Debugging
1. Tắt toàn bộ các cửa sổ Google Chrome hiện tại trên máy Remote `10.168.188.24`.
2. Mở Command Prompt hoặc PowerShell trên máy Remote và khởi động Chrome với cấu hình mở cổng Remote Debugging (Ví dụ cổng `9222`):
   
   **Windows (Remote Machine):**
   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --remote-debugging-address=0.0.0.0 --remote-allow-origins=*
   ```
   *(Đường dẫn tới `chrome.exe` có thể khác tùy máy)*

3. Kiểm tra xem Chrome đã mở CDP chưa bằng cách dùng máy Local truy cập vào link: `http://10.168.188.24:9222/json/version`
   Bạn sẽ thấy một chuỗi JSON trả về, hãy copy giá trị của trường `webSocketDebuggerUrl`.
   Ví dụ: `ws://10.168.188.24:9222/devtools/browser/abc123xyz...`

### Step 2: Cập nhật Playwright Config ở máy Local
Để dùng CDP cho toàn bộ các test, bạn cần sửa cấu hình trong file `playwright.config.ts` ở phần `projects` (Hoặc nếu chỉ test thử, bạn có thể truyền thẳng trong file spec, nhưng cấu hình qua config tốt hơn).

Mở file `playwright.config.ts` trên máy Local, tìm block `projects` có `chromium` và thêm trường `connectOptions`:

```typescript
projects: [
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      // Thêm tuỳ chọn kết nối qua CDP
      connectOptions: {
        wsEndpoint: 'ws://10.168.188.24:9222/devtools/browser/<thay-đoạn-mã-id-vào-đây>',
      }
    },
  },
]
```

### Step 3: Chạy Command ở máy Local
Bây giờ, bạn chỉ việc chạy lệnh khởi chạy Playwright bình thường:
```bash
npx playwright test --project=chromium
```
Playwright sẽ kết nối trực tiếp vào trình duyệt Google Chrome đang mở trên màn hình của máy Remote `10.168.188.24` và thực hiện các thao tác tự động trên đó.

---
**Lưu Ý Chung:**
- **Firewall (Tường lửa):** Cả 2 cách trên đều yêu cầu máy Remote phải mở port (`8080` hoặc `9222`) trong Windows Defender Firewall để cho phép máy Local (IP của bạn) kết nối vào.
- **Tốc độ Mạng:** Việc chạy remote đòi hỏi kết nối mạng nội bộ giữa 2 máy phải ổn định, nếu không có thể gây lỗi timeout cho Playwright.
