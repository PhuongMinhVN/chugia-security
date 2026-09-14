"""
Chu Gia Security - AI Chatbot Backend Server
=============================================
Tích hợp DeepSeek API để tư vấn khách hàng về Camera, Mạng, Smarthome.
Serve static files + API endpoint cho chatbot.

Chạy: python server.py
Truy cập: http://localhost:8000/
"""

import http.server
import json
import os
import re
import ssl
import urllib.request
import urllib.error
import socketserver
from pathlib import Path

# ── Load .env file ──
def load_env():
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

load_env()

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
PORT = 8000

# ── Load product data for AI context ──
def load_product_context():
    """Parse product data from hta-products-data.js to build AI context."""
    data_path = Path(__file__).parent / 'js' / 'hta-products-data.js'
    if not data_path.exists():
        return "Không có dữ liệu sản phẩm."

    with open(data_path, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'window\.HTA_PRODUCTS_DATA\s*=\s*(\{.*\})', content, re.DOTALL)
    if not match:
        return "Không parse được dữ liệu sản phẩm."

    try:
        data = json.loads(match.group(1))
    except json.JSONDecodeError:
        return "Lỗi parse JSON dữ liệu sản phẩm."

    categories = data.get('categories', [])
    products = data.get('products', [])

    # Build category summary
    cat_summary = []
    parent_groups = {}
    for cat in categories:
        group = cat.get('parentGroup', 'Khác')
        if group not in parent_groups:
            parent_groups[group] = []
        parent_groups[group].append(f"{cat['name']} ({cat['count']} sản phẩm)")

    cat_text = "## DANH MỤC SẢN PHẨM:\n"
    for group, cats in parent_groups.items():
        cat_text += f"\n### {group}:\n"
        for c in cats:
            cat_text += f"- {c}\n"

    # Build product summary (top products per category, limit context size)
    prod_text = "\n## SẢN PHẨM NỔI BẬT (mẫu đại diện):\n"
    
    # Group products by parentGroup
    products_by_group = {}
    for p in products:
        group = p.get('parentGroup', 'Khác')
        if group not in products_by_group:
            products_by_group[group] = []
        products_by_group[group].append(p)

    for group, prods in products_by_group.items():
        prod_text += f"\n### {group}:\n"
        # Take up to 5 representative products per group
        for p in prods[:5]:
            name = p.get('name', '')
            sku = p.get('sku', '')
            price = p.get('retailPrice', 0)
            brand = p.get('brand', '')
            warranty = p.get('warranty', '')
            features = p.get('features', [])
            price_str = f"{price:,}₫" if price > 0 else "Liên hệ"
            feat_str = "; ".join(features[:2]) if features else ""

            prod_text += f"- **{name}** (SKU: {sku}) | Hãng: {brand} | Giá: {price_str} | BH: {warranty}\n"
            if feat_str:
                prod_text += f"  Tính năng: {feat_str}\n"

    # Brand summary
    brands = {}
    for p in products:
        b = p.get('brand', 'N/A')
        brands[b] = brands.get(b, 0) + 1

    brand_text = "\n## THƯƠNG HIỆU PHÂN PHỐI:\n"
    for b, c in sorted(brands.items(), key=lambda x: -x[1]):
        brand_text += f"- {b}: {c} sản phẩm\n"

    # Price statistics
    prices = [p['retailPrice'] for p in products if p.get('retailPrice', 0) > 0]
    price_stats = f"\n## THỐNG KÊ GIÁ:\n- Giá thấp nhất: {min(prices):,}₫\n- Giá cao nhất: {max(prices):,}₫\n- Giá trung bình: {sum(prices)//len(prices):,}₫\n- Tổng {len(products)} sản phẩm\n"

    return cat_text + prod_text + brand_text + price_stats


# Load product context once at startup
PRODUCT_CONTEXT = load_product_context()

def load_sales_skill():
    """Load sales expert instructions from SKILL.md."""
    skill_path = Path(__file__).parent / '.agents' / 'skills' / 'chugia-sales-expert' / 'SKILL.md'
    if skill_path.exists():
        try:
            with open(skill_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"[Warning] Cannot load SKILL.md: {e}")
    return ""

SALES_SKILL_CONTENT = load_sales_skill()

def build_system_prompt():
    sales_skill = load_sales_skill()
    return f"""Bạn là **Chuyên gia tư vấn giải pháp công nghệ cao cấp** của **Chu Gia Security** (Công ty TNHH Đầu tư và Thương mại Chu Gia) - đại lý ủy quyền chính hãng Dahua, Hikvision, Imou, EZVIZ, TP-Link Omada, Ruijie, Huawei, YLOCK từ năm 2014.

## THÔNG TIN CÔNG TY:
- **Tên**: Chu Gia Security (Công ty TNHH Đầu tư và Thương mại Chu Gia)
- **Hotline / Zalo**: 0941 204 125 (tư vấn 7:30 - 21:00 hàng ngày)
- **Website**: https://chugia.shop
- **Kinh nghiệm**: Hơn 10 năm kinh nghiệm giải pháp an ninh và viễn thông (từ 2014)
- **Cam kết vàng**: 100% hàng chính hãng (CO/CQ), Bảo hành 1 đổi 1 tận nơi 24 tháng, Khảo sát & lên bản vẽ thực địa miễn phí, Lắp đặt hoàn thiện trong 2 giờ.

---

## 4 LĨNH VỰC CHUYÊN SÂU CỦA BẠN:
1. **Camera an ninh & giám sát thông minh** (Imou, Dahua, Hikvision, TP-Link Tapo)
2. **Hạ tầng Mạng Network & Wi-Fi chuyên dụng** (Huawei eKit, TP-Link Omada, Ruijie Reyee, SinicHome PoE)
3. **Thiết bị Chuông cửa có hình - Video Intercom** (Dahua VTO/VTH mở cổng âm sàn, EZVIZ HP5/HP7, Hikvision)
4. **Khóa cửa thông minh - Smart Lock** (YLOCK, Dahua, EZVIZ, Hune, Solity)

---

## ⛔ NGUYÊN TẮC VÀNG: HỎI ÍT - ĐỀ XUẤT NHANH - CẤM HỎI DAI DẲNG
1. **Chỉ hỏi tối đa 1 câu làm rõ**: Chỉ khi khách hỏi quá ngắn hoặc mơ hồ.
2. **Quy tắc cắt đứt hỏi**: Ngay khi khách đã nêu không gian hoặc vị trí (như "chung cư", "phòng khách", "cửa cổng", "văn phòng", "nhà 3 tầng", "cửa gỗ"...):
   - **CẤM ĐƯỢC HỎI TIẾP!**
   - **LẬP TỨC ĐƯA RA GIẢI PHÁP VÀ 2 LỰA CHỌN SẢN PHẨM CỤ THỂ SO SÁNH NHAU KÈM GIÁ BÁN VÀ LINK SẢN PHẨM!**

---

## 🎯 3 QUY TẮC NGHIỆP VỤ BẮT BUỘC TUÂN THỦ:

### 1️⃣ QUY TẮC CHUÔNG HÌNH & MỞ CỔNG ÂM SÀN / CỔNG TỰ ĐỘNG:
- Khi tư vấn chuông hình, luôn hỏi hoặc làm rõ: **"Cổng nhà mình có dùng cổng tự động / cổng âm sàn và anh/chị có cần kích mở cổng qua điện thoại không ạ?"**
- **NẾU CÓ CỔNG ÂM SÀN / CỔNG TỰ ĐỘNG (hoặc khách cần mở cổng từ xa qua app)**:
  👉 **BẮT BUỘC TƯ VẤN HỆ THỐNG DAHUA CHUYÊN DỤNG**: Vì nút chuông Dahua có sẵn ngõ tiếp điểm relay khô (NO/COM) tiêu chuẩn công nghiệp đấu trực tiếp vào mạch motor cổng âm sàn, điều khiển đóng mở cổng 1 chạm qua app DMSS trên điện thoại và màn hình VTH trong nhà.
  - *Nút chuông ngoài*: [Nút nhấn Camera chuông hình Dahua DHI-VTO2111D-P-S2 (PoE)](https://chugia.shop/san-pham.html#prod-DHI-VTO2111D-P-S2) - **3.030.000₫** hoặc [Nút nhấn Camera chuông hình Dahua DHI-VTO2201F-P-S2 (PoE, góc rộng 140 độ)](https://chugia.shop/san-pham.html#prod-DHI-VTO2201F-P-S2) - **6.050.000₫**.
  - *Màn hình trong nhà*: [Màn hình chuông hình Dahua DHI-VTH2621GW-WP (7 inch, PoE, Wifi)](https://chugia.shop/san-pham.html#prod-DHI-VTH2621GW-WP) - **4.320.000₫**.
  - *Switch PoE*: [Switch PoE SinicHome SINIC-3104POE](https://chugia.shop/san-pham.html#prod-SINIC-3104POE) - **650.000₫**.
- **NẾU KHÔNG CẦN mở cổng âm sàn** (chuông gia đình bình thường):
  - Tư vấn bộ EZVIZ gọn gàng: [Chuông hình EZVIZ HP5](https://chugia.shop/san-pham.html#prod-EZVIZ HP5) (**6.050.000₫**) hoặc [Chuông hình EZVIZ HP7](https://chugia.shop/san-pham.html#prod-EZVIZ HP7) (**6.700.000₫**).

### 2️⃣ QUY TẮC TƯ VẤN KHÓA RIÊNG, CHUÔNG HÌNH RIÊNG:
- Chuông hình (ở cổng ngoài) và Khóa thông minh (ở cửa chính) là 2 hệ thống độc lập.
- **TUYỆT ĐỐI KHÔNG GỘP CHUNG MẬP MỜ**. Luôn phân tách rõ ràng thành 2 mục riêng:
  - **Mục A: Hệ thống Chuông cửa có hình** (ở cổng: nhìn mặt khách, đàm thoại, mở cổng âm sàn).
  - **Mục B: Khóa cửa thông minh** (ở cửa chính: mở cửa bằng vân tay, thẻ từ, mã số, app).

### 3️⃣ QUY TẮC CAMERA GIA ĐÌNH & LƯU TRỮ (THẺ NHỚ vs ĐẦU GHI + Ổ CỨNG):
- **Khi lắp 1 - 2 Camera (lắp lẻ)**:
  - BẮT BUỘC tư vấn thêm **Thẻ nhớ chuyên dụng camera**:
    - [Thẻ nhớ DAHUA MicroSD 64Gb DHI-TF-C100/64GB](https://chugia.shop/san-pham.html#prod-MicroSD64G-DHI-TF-C100/64GB) - **570.000₫** (lưu 6-8 ngày, ghi đè liên tục, tốc độ cao chống giật).
    - [Thẻ nhớ DAHUA MicroSD 128Gb DHI-TF-C100/128GB](https://chugia.shop/san-pham.html#prod-MicroSD128G-DHI-TF-C100/128GB) - **910.000₫** (lưu 12-15 ngày).
- **Khi lắp TRÊN 3 CAMERA (từ 3 camera trở lên hoặc nhà nhiều tầng)**:
  - BẮT BUỘC tư vấn giải pháp **ĐẦU GHI HÌNH (NVR) + Ổ CỨNG CHUYÊN DỤNG (HDD)** thay vì mua nhiều thẻ nhớ rời!
  - *Lợi ích*: Ổ cứng chạy 24/7 bền bỉ 4-5 năm (không bị chai hỏng sau 1 năm như thẻ nhớ), quản lý tập trung xem cả hệ thống trên Tivi/máy tính/app, không làm nghẽn sóng Wi-Fi của nhà, bảo vệ dữ liệu video an toàn tuyệt đối ngay cả khi camera bị tháo cắp.
  - *Thiết bị*:
    - Đầu ghi Wi-Fi Imou: [Đầu ghi hình IMOU NVR-N110W-8A0E (Wifi 10 kênh)](https://chugia.shop/san-pham.html#prod-NVR-N110W-8A0E) - **2.060.000₫**.
    - Đầu ghi Wi-Fi EZVIZ: [Đầu ghi hình EZVIZ X5S-8W (Wifi 8 kênh)](https://chugia.shop/san-pham.html#prod-EZVIZ X5S-8W) - **2.270.000₫**.
    - Đầu ghi Dahua: [Đầu ghi hình DAHUA DHI-NVR1104HS-S3/H](https://chugia.shop/san-pham.html#prod-DHI-NVR1104HS-S3/H) - **1.520.000₫** (4 kênh) / [DHI-NVR1108HS-S3/H](https://chugia.shop/san-pham.html#prod-DHI-NVR1108HS-S3/H) - **2.340.000₫** (8 kênh).
    - Ổ cứng chuyên dụng: [Ổ cứng HIKVISION 2TB DS20HKVS-VX1 chuyên dụng cho camera giám sát](https://chugia.shop/san-pham.html#prod-DS20HKVS-VX1) - **6.270.000₫** hoặc [Ổ cứng Toshiba 2TB HDWT720UZSVA Surveillance](https://chugia.shop/san-pham.html#prod-HDWT720UZSVA) - **6.380.000₫**.

---

## 🎯 CẤU TRÚC PHẢN HỒI CHUẨN:
1. **Khẳng định giải pháp kỹ thuật** (1-2 câu).
2. **Đưa ra 2 Phương án so sánh trực quan**:
   - Phương án 1 (Bán chạy / Tối ưu chi phí): Tên + Link `[Tên](https://chugia.shop/san-pham.html#prod-MÃ_SKU)` + Giá bán lẻ + SKU + Lý do chọn.
   - Phương án 2 (Nâng cấp / Tính năng vượt trội): Tên + Link `[Tên](https://chugia.shop/san-pham.html#prod-MÃ_SKU)` + Giá bán lẻ + SKU + Lý do chọn.
3. **BẮT BUỘC ĐỊNH DẠNG LINK SẢN PHẨM DẪN VỀ CHUGIA.SHOP**:
   Mọi sản phẩm đề xuất BẮT BUỘC phải dùng cú pháp markdown link dẫn thẳng về website chugia.shop theo mã SKU:
   `[Tên sản phẩm](https://chugia.shop/san-pham.html#prod-MÃ_SKU)` (Ví dụ: `[Camera IMOU IPC-A32EP (Wifi quay quét 3MP)](https://chugia.shop/san-pham.html#prod-IPC-A32EP)`). Khi người dùng bấm vào link này, hệ thống sẽ mở trực tiếp trang sản phẩm đó trên chugia.shop.
4. **Cam kết dịch vụ & Mời chốt lịch**:
   Bảo hành 1 đổi 1 tận nơi 24 tháng, khảo sát lắp đặt hoàn thiện 2 giờ, liên hệ Hotline/Zalo **0941 204 125**.

---

## TÀI LIỆU CHUYÊN GIA & BẢNG GIẢI PHÁP / GIÁ BÁN LẺ:
{sales_skill}

---

## TOÀN BỘ KHO DỮ LIỆU SẢN PHẨM PHÂN PHỐI:
{PRODUCT_CONTEXT}
"""



def call_deepseek_api(user_message, history=None):
    """Call DeepSeek API with conversation context."""
    if not DEEPSEEK_API_KEY:
        return "⚠️ Chưa cấu hình API key DeepSeek. Vui lòng kiểm tra file .env"

    system_prompt = build_system_prompt()
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    if history:
        # Check if the last item in history is already the current user message
        hist_items = history[:-1] if history and history[-1].get("content") == user_message else history
        for msg in hist_items:
            role = msg.get("role", "user")
            if role in ("user", "assistant"):
                messages.append({
                    "role": role,
                    "content": msg.get("content", "")
                })

    messages.append({"role": "user", "content": user_message})

    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 2048,
        "stream": False
    }).encode('utf-8')

    req = urllib.request.Request(
        DEEPSEEK_API_URL,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Accept': 'application/json'
        },
        method='POST'
    )

    try:
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=30, context=ssl_ctx) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='replace')
        print(f"[DeepSeek API Error] {e.code}: {error_body}")
        return f"⚠️ Lỗi API ({e.code}). Vui lòng thử lại sau hoặc liên hệ Hotline: **0941 204 125**"
    except urllib.error.URLError as e:
        print(f"[Network Error] {e.reason}")
        return "⚠️ Không thể kết nối tới DeepSeek API. Vui lòng kiểm tra kết nối mạng."
    except Exception as e:
        print(f"[Error] {e}")
        return "⚠️ Đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ Hotline: **0941 204 125**"


class ChatbotHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler that serves static files and the chatbot API."""

    def do_POST(self):
        if self.path == '/api/chat':
            self.handle_chat()
        else:
            self.send_error(404, 'Not Found')

    def handle_chat(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            user_message = data.get('message', '').strip()
            history = data.get('history', [])

            if not user_message:
                self.send_json(400, {'error': 'Vui long nhap cau hoi'})
                return

            try:
                print(f"[Chat] User: {user_message[:80]}...")
            except UnicodeEncodeError:
                print(f"[Chat] User: {repr(user_message[:80])}...")

            # Call DeepSeek API
            reply = call_deepseek_api(user_message, history)

            try:
                print(f"[Chat] AI: {reply[:80]}...")
            except UnicodeEncodeError:
                print("[Chat] AI: (response logged, contains special chars)")

            self.send_json(200, {'reply': reply})

        except json.JSONDecodeError:
            self.send_json(400, {'error': 'Invalid JSON'})
        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_json(500, {'error': str(e)})

    def send_json(self, status_code, data):
        response = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response)

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """Custom log format."""
        if '/api/' in (args[0] if args else ''):
            print(f"[API] {args[0]}")
        # Suppress static file logs for cleanliness


def main():
    os.chdir(Path(__file__).parent)

    print("=" * 60)
    print("  Chu Gia Security - AI Chatbot Server")
    print("=" * 60)
    print(f"  Server (Root): http://localhost:{PORT}/")
    print(f"  Trang Chủ AI:  http://localhost:{PORT}/index.html")
    print(f"  Bảng Dự Toán:  http://localhost:{PORT}/du-toan.html")
    print(f"  Sản Phẩm:      http://localhost:{PORT}/san-pham.html")
    print(f"  API Key:       {'OK - Loaded' if DEEPSEEK_API_KEY else 'MISSING - Check .env'}")
    print(f"  Products:      Loaded")
    print("=" * 60)
    print("  Press Ctrl+C to stop\n")

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("", PORT), ChatbotHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[Server] Shutting down...")
            httpd.shutdown()


if __name__ == '__main__':
    main()
