# 🎋 GAME QUIZ MULTIPLAYER: “TRE ĐOÀN KẾT”

Game web trắc nghiệm trực tuyến nhiều người chơi (Real-time Multiplayer) mang tính giáo dục, vui nhộn và cạnh tranh cao dựa trên kiến thức **Chương V: Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế**.

---

## 🌟 TỔNG QUAN Ý TƯỞNG

Người chơi bắt đầu với một mảnh đất trống và gốc tre nhỏ. Mỗi câu trả lời đúng và nhanh sẽ mang về các **đốt tre** tương ứng. 

> **Mục tiêu:** Trả lời đúng + Tốc độ cao → Nhận nhiều đốt tre → Cây tre càng cao → Thứ hạng càng cao!

- **Thời gian toàn trận:** Đúng **3 phút (180 giây)**.
- **Thời gian mỗi câu hỏi:** **20 giây**.
- **Cơ chế tính đốt tre:**
  - 0–2 giây: **10 đốt tre**
  - 2–4 giây: **9 đốt tre**
  - 4–6 giây: **8 đốt tre**
  - 6–8 giây: **7 đốt tre**
  - 8–10 giây: **6 đốt tre**
  - 10–12 giây: **5 đốt tre**
  - 12–14 giây: **4 đốt tre**
  - 14–16 giây: **3 đốt tre**
  - 16–18 giây: **2 đốt tre**
  - 18–20 giây: **1 đốt tre**
  - Trả lời sai hoặc hết 20 giây: **0 đốt tre**
  - Công thức: `Đốt tre = max(0, 10 - floor(thời_gian_trả_lời / 2))` (khi trả lời đúng).

---

## 📂 BỘ CÂU HỎI CHUẨN XÁC

- Sử dụng chính xác **50 câu hỏi** từ file tài liệu `Kahoot_Chuong5_50_cau_hoi.pdf`.
- Không lặp lại câu hỏi trong một vòng 50 câu (sử dụng thuật toán **Fisher-Yates Shuffle**).
- Nếu trả lời hết 50 câu trước 180 giây, hệ thống tự động shuffle lại và tiếp tục cho đến khi hết giờ.

---

## 🎮 TÍNH NĂNG CHÍNH

1. **Chế độ Solo (Luyện tập):** Chơi ngay 3 phút không cần chờ người khác, vẫn có bảng thành tích cá nhân.
2. **Chế độ Tạo Phòng (Multiplayer Host):** Tạo mã phòng 5 ký tự (VD: `A7K92`), chia sẻ mã cho bạn bè vào phòng chờ (Lobby), chỉ chủ phòng có quyền bấm bắt đầu.
3. **Chế độ Vào Phòng (Join Room):** Nhập mã phòng để tham gia tranh tài trực tiếp.
4. **Đồng bộ thời gian thực (Realtime Sync):** Cập nhật thứ hạng (`#1`, `#2`, `#3`), số đốt tre và số câu đúng của tất cả người chơi trong phòng trực tiếp trên màn hình thi đấu.
5. **Cây tre phát triển sống động:** 
   - Mô phỏng từng đốt tre có số thứ tự, lóng tre, lá xum xuê.
   - Hiệu ứng animation khi mọc thêm đốt tre.
   - Tự động cuộn theo đọt tre khi cây mọc cao.
6. **Âm thanh tổng hợp (Web Audio API):**
   - Click nút, tiếng gõ tre, tiếng chuông chúc mừng khi trả lời đúng, tiếng còi khi trả lời sai, đếm ngược 10 giây cuối, pháo hoa chiến thắng.
   - Nút bật/tắt âm thanh tiện lợi.
7. **Bảng xếp hạng:**
   - Bảng xếp hạng phòng đấu ngay sau trận.
   - Bảng vàng Top Tre Toàn Hệ Thống (Top 10, Top 50, Top 100).
8. **Hiệu ứng pháo hoa:** Tự động kích hoạt khi kết thúc trận đấu.
9. **Giao diện Responsive:** Tương thích hoàn hảo trên Máy tính bàn, Laptop, Máy tính bảng và Điện thoại di động.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY GAME

### Yêu cầu:
- Đã cài đặt **Node.js** (phiên bản 18+ trở lên).

### Khởi chạy Server và Client:

```bash
# Cài đặt thư viện (nếu chưa cài)
npm install

# Chạy cả Server Realtime và Client Vite (khuyên dùng khi phát triển):
npm run dev

# Hoặc chạy Server sản xuất (cổng 3001, tự phục vụ toàn bộ web game):
npm start
```

Mở trình duyệt truy cập:
- **Chế độ phát triển (Vite):** [http://localhost:5173](http://localhost:5173)
- **Chế độ Server chạy đơn lẻ:** [http://localhost:3001](http://localhost:3001)

---

## 📁 CẤU TRÚC THƯ MỤC

```text
hcm-202/
├── server/
│   ├── index.js                  # Backend Express + Socket.IO Server & REST API
│   └── leaderboard_data.json     # Dữ liệu bảng xếp hạng lưu trữ
├── src/
│   ├── assets/                   # Tài nguyên hình ảnh, biểu tượng
│   ├── components/               # Các UI component tái sử dụng
│   │   ├── BambooTree.jsx        # Cây tre hoạt họa trực quan & mọc đốt
│   │   ├── HowToPlayModal.jsx    # Bảng hướng dẫn luật chơi
│   │   ├── PlayerList.jsx        # Danh sách người chơi trong phòng & bảng trực tiếp
│   │   ├── QuestionCard.jsx      # Thẻ câu hỏi 4 đáp án & countdown 20s
│   │   ├── ScoreDisplay.jsx      # Widget hiển thị đốt tre & thứ hạng
│   │   ├── SoundToggle.jsx       # Nút bật/tắt âm thanh
│   │   └── Timer.jsx             # Đồng hồ đếm ngược 180s toàn trận
│   ├── data/
│   │   └── questions.js          # Dữ liệu 50 câu hỏi trích xuất từ PDF gốc
│   ├── pages/
│   │   ├── CreateRoom.jsx        # Trang tạo phòng
│   │   ├── GamePage.jsx          # Màn hình thi đấu chính (Gameplay)
│   │   ├── HomePage.jsx          # Màn hình trang chủ & cài đặt thí sinh
│   │   ├── JoinRoom.jsx          # Trang nhập mã vào phòng
│   │   ├── Leaderboard.jsx       # Bảng xếp hạng phòng & toàn quốc
│   │   ├── Lobby.jsx             # Phòng chờ thi đấu (Waiting Room)
│   │   └── ResultPage.jsx        # Màn hình kết quả & pháo hoa sau 3 phút
│   ├── services/
│   │   ├── gameService.js        # Logic quản lý tiến trình trò chơi
│   │   ├── leaderboardService.js # API & LocalStorage bảng xếp hạng
│   │   ├── questionService.js    # Fisher-Yates shuffle & thuật toán tính đốt tre
│   │   └── roomService.js        # Kết nối Socket.IO phòng đấu realtime
│   ├── utils/
│   │   └── audio.js              # Bộ phát âm thanh Web Audio API không phụ thuộc file ngoài
│   ├── App.jsx                   # Quản lý định tuyến và điều phối trạng thái game
│   ├── index.css                 # Phong cách Tailwind CSS & hiệu ứng hoạt họa
│   └── main.jsx                  # Điểm khởi đầu ứng dụng React
├── package.json
└── vite.config.js
```
