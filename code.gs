// Cấu hình
const PIN_EXPIRY_DAYS = 30; // Thời hạn PIN (ngày)
const filterEnabled = true; // Kích hoạt bộ lọc
const TARGET_SENDER = 'noreply@mail.accounts.riotgames.com'; // Địa chỉ email cần lọc

// ----------------------------------------------------
// 1. CHỨC NĂNG BẢO MẬT: Lấy PIN từ Script Properties
// ----------------------------------------------------
function getPin() {
    // Lấy PIN từ Script Properties. PIN KHÔNG còn hardcode trong code.
    // Đảm bảo bạn đã thiết lập key 'APP_PIN' trong cài đặt thuộc tính tập lệnh.
    const pin = PropertiesService.getScriptProperties().getProperty('APP_PIN');
    if (!pin) {
        // Thông báo lỗi nếu PIN chưa được thiết lập (chỉ hiển thị trong log hoặc debug)
        Logger.log("Lỗi: Thuộc tính 'APP_PIN' chưa được thiết lập trong Script Properties.");
    }
    return pin;
}

// Kiểm tra mã PIN
function validatePin(pin) {
  return pin && pin === getPin();
}

// Lấy thời hạn PIN
function getPinExpiryDays() {
  return PIN_EXPIRY_DAYS;
}

// ----------------------------------------------------
// 2. CORE LOGIC
// ----------------------------------------------------

// Xử lý yêu cầu GET để hiển thị giao diện HTML
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Ứng dụng đọc Gmail')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Xử lý danh sách thread thành danh sách email JSON
function processThreads(threads) {
    // Đã loại bỏ filterEmails ở đây vì việc lọc đã được đẩy lên Gmail Search
  let emails = threads.map(thread => {
    const messages = thread.getMessages();
    return messages.map(msg => {
      const date = msg.getDate();
      const fullDate = date ? date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      }) : 'N/A';
        
      // Cải tiến: Sử dụng Subject nếu PlainBody rỗng
      const rawSnippet = msg.getPlainBody() || msg.getSubject();
      const snippet = rawSnippet ? rawSnippet.substring(0, 200) + '...' : 'Không có đoạn trích.';

      return {
        id: msg.getId(),
        from: msg.getFrom(),
        subject: msg.getSubject(),
        date: fullDate,
        snippet: snippet,
        isUnread: msg.isUnread(),
        html: msg.getBody() || '<p>Không tìm thấy nội dung HTML.</p>'
      };
    });
  }).flat();

  return emails;
}


// Lấy email từ hộp thư đến (ĐÃ TỐI ƯU HÓA TÌM KIẾM)
function getAllEmailsWithHtml(limit = 100) {
    let query = "in:inbox";
    
    // Nâng cấp Hiệu suất: Tích hợp bộ lọc vào truy vấn Gmail
    if (filterEnabled && TARGET_SENDER) {
        query = `from:${TARGET_SENDER} in:inbox`;
    }
    
    // Sử dụng GmailApp.search() để áp dụng query và lấy email nhanh hơn
    // Offset là 0, limit là số lượng yêu cầu
    const threads = GmailApp.search(query, 0, limit);
    return processThreads(threads);
}

// Lấy email từ thư mục spam (Đã tối ưu)
function getAllSpamEmailsWithHtml(limit = 100) {
    let query = "in:spam";
    
    if (filterEnabled && TARGET_SENDER) {
        query = `from:${TARGET_SENDER} in:spam`;
    }
    
    const threads = GmailApp.search(query, 0, limit);
    return processThreads(threads);
}

// Đánh dấu email là đã đọc
function markAsRead(messageId) {
  const message = GmailApp.getMessageById(messageId);
  if (message && message.isUnread()) {
    message.markRead();
  }
}

// Hàm này không còn được sử dụng vì việc lọc đã được đẩy lên Gmail Search,
// nhưng tôi giữ nó ở đây để tránh lỗi nếu code client cũ gọi đến nó.
function filterEmails(emails) {
    return emails;
}

// Đã loại bỏ hàm doPost vì nó không được sử dụng bởi giao diện người dùng hiện tại
