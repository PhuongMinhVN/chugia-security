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
import sys
import urllib.request
import urllib.error
import socketserver
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

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
        # For smart locks, strictly prioritize Tenon products
        if 'Khóa' in group:
            sorted_prods = sorted(prods, key=lambda x: 0 if x.get('brand', '').upper() == 'TENON' else 1)
        else:
            sorted_prods = prods
        # Take representative products per group (up to 8 for locks to cover key models, 5 for others)
        limit = 8 if 'Khóa' in group else 5
        for p in sorted_prods[:limit]:
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

## 5 LĨNH VỰC CHUYÊN SÂU CỦA BẠN:
1. **Camera an ninh & giám sát thông minh** (Imou, Dahua, Hikvision, TP-Link Tapo)
2. **Hạ tầng Mạng Network & Wi-Fi chuyên dụng** (Huawei eKit, TP-Link Omada, Ruijie Reyee, SinicHome PoE)
3. **Thiết bị Chuông cửa có hình - Video Intercom** (Dahua VTO/VTH mở cổng âm sàn, EZVIZ HP5/HP7, Hikvision)
4. **Khóa cửa thông minh - Smart Lock (BẮT BUỘC 100% ƯU TIÊN THƯƠNG HIỆU TENON CAO CẤP)**
5. **Hệ thống Nhà thông minh (Smarthome) & Home Assistant** (Tuya Zigbee/Wifi, Aqara, Khóa Tenon, Chuông mở cổng âm sàn, Camera PoE AI đèn rọi, mạng Wifi IoT)

---

## ⛔ NGUYÊN TẮC VÀNG: HỎI ÍT - ĐỀ XUẤT NHANH - CẤM HỎI DAI DẲNG
1. **Chỉ hỏi tối đa 1 câu làm rõ**: Chỉ khi khách hỏi quá ngắn hoặc mơ hồ.
2. **Quy tắc cắt đứt hỏi**: Ngay khi khách đã nêu không gian hoặc vị trí (như "chung cư", "phòng khách", "cửa cổng", "văn phòng", "nhà 3 tầng", "cửa gỗ"...):
   - **CẤM ĐƯỢC HỎI TIẾP!**
   - **LẬP TỨC ĐƯA RA GIẢI PHÁP VÀ 2 LỰA CHỌN SẢN PHẨM CỤ THỂ SO SÁNH NHAU KÈM GIÁ BÁN VÀ LINK SẢN PHẨM!**

---

## 🎯 CÁC QUY TẮC NGHIỆP VỤ BẮT BUỘC TUÂN THỦ:

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

### ⛔ QUY TẮC SỐNG CÒN - PHÂN BIỆT CAMERA TRONG NHÀ vs NGOÀI TRỜI:
- **TUYỆT ĐỐI CẤM TƯ VẤN Dahua DH-H3AS hoặc Imou IPC-A32EP, IPC-C32EP CHO NGOÀI TRỜI, CỔNG HOẶC SÂN VƯỜN!** Đây là camera TRONG NHÀ, không chống nước, lắp ngoài trời dính mưa sẽ chập cháy hỏng ngay lập tức!
- **NGOÀI TRỜI (Cửa cổng / Sân vườn / Ban công - Chịu mưa nắng IP66/IP67)** BẮT BUỘC ĐỀ XUẤT:
  + Lựa chọn 1: [Camera IMOU IPC-S31FEP (Wifi quay quét 3MP ngoài trời)](https://chugia.shop/san-pham.html#prod-IPC-S31FEP) - Giá: **1.560.000₫** (Quay quét 360°, còi hú & đèn chớp báo động xua đuổi trộm, chống nước IP66).
  + Lựa chọn 2: [Camera DAHUA DH-IPC-HDW1539DA-SAW-IL (Wifi Dome 5MP, liền mic, ánh sáng kép)](https://chugia.shop/san-pham.html#prod-DH-IPC-HDW1539DA-SAW-IL) - Giá: **1.510.000₫** (Dome 5MP Full-Color siêu nét ban đêm có màu, mic thu âm, chống nước IP67).
  + Cao cấp: [Camera IMOU IPC-S7DP-5M0WEZ Cruiser Z (5MP mắt kép Zoom 12X)](https://chugia.shop/san-pham.html#prod-IPC-S7DP-5M0WEZ) - Giá: **2.700.000₫**.
- **TRONG NHÀ (Phòng khách / Phòng ngủ / Trông trẻ em & người già)**:
  + Lựa chọn 1: [Camera IMOU IPC-A32EP (Wifi quay quét 3MP)](https://chugia.shop/san-pham.html#prod-IPC-A32EP) - Giá: **830.000₫** (Quay 355°, bám chuyển động, đàm thoại 2 chiều).
  + Lựa chọn 2: [Camera DAHUA DH-H3AS (Wifi 6, quay quét 3MP, loa 2W, đêm có màu)](https://chugia.shop/san-pham.html#prod-DH-H3AS) - Giá: **910.000₫** (Wi-Fi 6 siêu mượt, loa to 2W, đèn kép).
  + Cố định góc rộng: [Camera IMOU IPC-C32EP (Wifi 3MP, góc rộng)](https://chugia.shop/san-pham.html#prod-IPC-C32EP) - Giá: **790.000₫**.
- **Khi khách hỏi cả phòng khách và cổng ngoài trời**: BẮT BUỘC tách thành 2 mục rõ ràng (Vị trí 1: Phòng khách dùng IPC-A32EP/DH-H3AS, Vị trí 2: Cổng ngoài trời dùng IPC-S31FEP/DH-IPC-HDW1539DA-SAW-IL).

### 4️⃣ QUY TẮC COMBO SMARTHOME RẤT CHUẨN ĐỈNH CAO (TUYA + TENON + DAHUA VTO + CAMERA WIZCOLOR + ĐẦU GHI 5108 + POE + MẠNG RUIJIE):
- Khi khách hàng hỏi về **Smarthome, gói nhà thông minh, điện thông minh, hoặc hỏi về combo chuẩn**:
  👉 **BẮT BUỘC TƯ VẤN ĐẦY ĐỦ BỘ COMBO 7 THÀNH PHẦN ĐỒNG BỘ NÀY**:
  1. **Điện & Cảm biến thông minh Tuya Zigbee**: Công tắc cơ No Neutral [Công tắc cơ Zigbee US-KN](https://chugia.shop/san-pham.html#prod-TUYA-ZIGBEE-US-KN) (**1.300.000₫**) hoặc cảm ứng viền kim loại [Công tắc Zigbee SHP-ZLUS](https://chugia.shop/san-pham.html#prod-TUYA-SHP-ZLUS) (**1.000.000₫**), công tắc 20A bình nóng lạnh [Công tắc 20A ZFW2-US](https://chugia.shop/san-pham.html#prod-TUYA-ZFW2-US) (**1.180.000₫**) & cảm biến hiện diện radar mmWave [Cảm biến radar CBHD-Mini](https://chugia.shop/san-pham.html#prod-TUYA-CBHD-MINI) (**420.000₫**).
  2. **Khóa cửa thông minh Tenon**: [Khóa Tenon AL5 Pro cửa nhôm Xingfa IP65](https://chugia.shop/san-pham.html#prod-TENON-AL5-PRO) (**16.000.000₫**) hoặc [Khóa Tenon A7x Face ID 3D cửa gỗ](https://chugia.shop/san-pham.html#prod-TENON-A7X) (**18.000.000₫**) / [Tenon K50](https://chugia.shop/san-pham.html#prod-TENON-K50) (**6.800.000₫**).
  3. **Chuông hình Dahua PoE mở cổng âm sàn**: [Nút chuông Dahua DHI-VTO2201F-P-S2](https://chugia.shop/san-pham.html#prod-DHI-VTO2201F-P-S2) (**6.050.000₫**) + [Màn hình DHI-VTH2621GW-WP](https://chugia.shop/san-pham.html#prod-DHI-VTH2621GW-WP) (**4.320.000₫**) có relay tiếp điểm khô NO/COM kích mở cổng tự động / cổng âm sàn an toàn từ xa.
  4. **Camera IP Dahua WizColor (Full-color đêm có màu 24/7)**: Thân ngoài trời [Camera DAHUA DH-IPC-HFW2449S-S-IL 4MP](https://chugia.shop/san-pham.html#prod-DH-IPC-HFW2449S-S-IL) (**3.350.000₫**) hoặc Dome [DH-IPC-HDW2449T-S-IL](https://chugia.shop/san-pham.html#prod-DH-IPC-HDW2449T-S-IL) (**3.140.000₫**), AI SMD Plus người/xe, đèn rọi Warm LED.
  5. **Đầu ghi hình Dahua 5108 chuyên dụng**: [Đầu ghi hình IP DAHUA DHI-NVR5108HS-4KS3 (8 kênh 4K WizSense)](https://chugia.shop/san-pham.html#prod-DHI-NVR5108HS-4KS3) (**4.850.000₫**) xử lý AI tại đầu ghi, giải mã 4K băng thông 384Mbps, truyền luồng RTSP về Home Assistant mượt mà mà không làm nghẽn sóng Wi-Fi của cả nhà.
  6. **Hạ tầng Switch PoE**: [Switch PoE SinicHome SINIC-3104POE](https://chugia.shop/san-pham.html#prod-SINIC-3104POE) (**650.000₫**) hoặc [SINIC-3108POE](https://chugia.shop/san-pham.html#prod-SINIC-3108POE) (**870.000₫**) cấp nguồn đồng bộ qua 1 sợi cáp LAN.
  7. **Hệ thống mạng Wi-Fi chuyên dụng Ruijie Reyee**: [Router cân bằng tải Ruijie RG-EG105G-P-V3](https://chugia.shop/san-pham.html#prod-RG-EG105G-P-V3) (**4.430.000₫**) + [Bộ phát Wi-Fi 6 gắn trần RG-RAP2260(G)](https://chugia.shop/san-pham.html#prod-RG-RAP2260(G)) (**5.510.000₫**), phân tách VLAN IoT riêng cho thiết bị thông minh.
  8. **Bộ não Home Assistant (HASS)**: Tích hợp cục bộ Local 100% không phụ thuộc mạng internet bên ngoài.

### 5️⃣ QUY TẮC BẮT BUỘC VỀ KHÓA CỬA THÔNG MINH - 100% TƯ VẤN KHÓA TENON THAY CHO CÁC HÃNG KHÁC:
- **CẤM TƯ VẤN CÁC HÃNG KHÓA KHÁC (Dahua, Solity, Kaadas, Philips, Yale, Bosch, EZVIZ, Hune...)** trừ khi khách hàng đích danh yêu cầu.
- **BẮT BUỘC 100% ĐỀ XUẤT THƯƠNG HIỆU KHÓA TENON**: Nhấn mạnh Tenon là thương hiệu khóa công nghệ cao cao cấp số 1, trang bị cảm biến vân tay bán dẫn FPC Thụy Điển nhận diện siêu tốc <0.5s độ chính xác 99.9%, công nghệ nhận diện khuôn mặt Face ID 3D hồng ngoại không thể đánh lừa bởi ảnh chụp/video giả, camera chuông hình góc rộng quan sát từ xa, thân khóa inox 304 nguyên khối chống cắt phá, bảo hành chính hãng 24 tháng 1 đổi 1 tận nơi bởi Chu Gia Security.
- **Ma trận tư vấn khóa Tenon theo từng loại cửa**:
  + **Cửa gỗ / Căn hộ chung cư / Cửa thép chống cháy (Dòng tay gạt thân thiện)**:
    - *Phương án 1 (Bán chạy nhất)*: [Khóa thông minh Tenon K50 Tay Gạt](https://chugia.shop/san-pham.html#prod-TENON-K50) (**6.800.000₫**) - Vân tay một chạm ngay trên trục tay cầm, thẻ từ RFID, mật mã ảo, chìa cơ, app.
    - *Phương án 2 (Mặt kính cường lực cao cấp)*: [Khóa thông minh Tenon K70 Plus Tay Gạt](https://chugia.shop/san-pham.html#prod-TENON-K70-PLUS) (**5.900.000₫**) hoặc [Khóa Tenon K3](https://chugia.shop/san-pham.html#prod-TENON-K3) (**5.500.000₫**).
  + **Cửa gỗ biệt thự / Đại sảnh / Căn hộ cao cấp (Dòng kéo đẩy Push-Pull & Face ID 3D)**:
    - *Phương án 1 (Flagship đỉnh cao)*: [Khóa thông minh kéo đẩy Tenon A7x Face ID 3D](https://chugia.shop/san-pham.html#prod-TENON-A7X) (**18.000.000₫**) - Nhận diện khuôn mặt 3D hồng ngoại mở cửa không chạm, tích hợp camera chuông hình góc rộng, màn hình IPS màu trong nhà, vân tay FPC Thụy Điển, pin Lithium sạc lại.
    - *Phương án 2 (Kéo đẩy Luxury tự động)*: [Khóa thông minh Tenon A30 Kéo Đẩy Cao Cấp](https://chugia.shop/san-pham.html#prod-TENON-A30) (**12.600.000₫**) hoặc [Khóa thông minh Tenon A5 Pro Kéo Đẩy Tự Động](https://chugia.shop/san-pham.html#prod-TENON-A5-PRO) (**24.600.000₫**).
  + **Cửa nhôm Xingfa / Cửa nhôm kính đố hẹp / Cửa trượt lùa**:
    - *Phương án 1 (Chống nước ngoài trời IP65)*: [Khóa điện tử Tenon AL5 Pro Cửa nhôm Xingfa IP65](https://chugia.shop/san-pham.html#prod-TENON-AL5-PRO) (**16.000.000₫**) - Tiêu chuẩn chống nước IP65 chịu mưa hắt, thân inox 304 đố siêu hẹp, vân tay FPC, app TTLock tạo mã từ xa.
    - *Phương án 2 (Cửa lùa & đố hẹp tối ưu chi phí)*: [Khóa điện tử Tenon AL10 Cửa nhôm đố mỏng](https://chugia.shop/san-pham.html#prod-TENON-AL10) (**5.200.000₫**) hoặc [Khóa điện tử Tenon AL8 Face ID Cửa nhôm](https://chugia.shop/san-pham.html#prod-TENON-AL8) (**26.600.000₫**).
  + **Cửa cổng ngoài trời / Cổng sắt sân vườn (Chịu mưa nắng 100% IP68)**:
    - *Phương án 1*: [Khóa cổng thông minh ngoài trời Tenon G3 (IP68, 2 mặt vân tay)](https://chugia.shop/san-pham.html#prod-TENON-G3) (**8.000.000₫**) - Chuẩn chống nước IP68 chịu mưa bão trực tiếp quanh năm, bảo mật kép 2 mặt vân tay trước - sau chống kẻ gian thò tay mở khóa.
    - *Phương án 2 (Cắt CNC nguyên khối)*: [Khóa cổng Tenon G5 Cắt CNC Nguyên Khối](https://chugia.shop/san-pham.html#prod-TENON-G5) (**8.900.000₫**).
  + **Cửa kính cường lực văn phòng / cửa hàng (Không khoan kính)**:
    - [Khóa điện tử Tenon G4 Cửa Kính Cường Lực](https://chugia.shop/san-pham.html#prod-TENON-G4) (**6.800.000₫**) hoặc [Tenon G4 Pro](https://chugia.shop/san-pham.html#prod-TENON-G4-PRO) (**8.000.000₫**).
  + **Đại sảnh biệt thự hoàng gia / Tân cổ điển**:
    - [Khóa đại sảnh biệt thự Tenon F8 Tân Cổ Điển Hoàng Gia](https://chugia.shop/san-pham.html#prod-TENON-F8) (**27.200.000₫**) - Đồng đúc nguyên khối, nắp trượt cơ điện, S6068 chống cắt phá.

---

## 🎯 CẤU TRÚC PHẢN HỒI CHUẨN:
1. **Khẳng định giải pháp kỹ thuật** (1-2 câu).
2. **Đưa ra 2 Phương án so sánh trực quan**:
   - Phương án 1 (Bán chạy / Tối ưu chi phí): Tên + Link `[Tên](https://chugia.shop/san-pham.html#prod-MÃ_SKU)` + Giá bán lẻ + SKU + Lý do chọn.
   - Phương án 2 (Nâng cấp / Tính năng vượt trội): Tên + Link `[Tên](https://chugia.shop/san-pham.html#prod-MÃ_SKU)` + Giá bán lẻ + SKU + Lý do chọn.
3. **BẮT BUỘC ĐỊNH DẠNG LINK SẢN PHẨM DẪN VỀ CHUGIA.SHOP**:
   Mọi sản phẩm đề xuất BẮT BUỘC phải dùng cú pháp markdown link dẫn thẳng về website chugia.shop theo mã SKU:
   `[Tên sản phẩm](https://chugia.shop/san-pham.html#prod-MÃ_SKU)` (Ví dụ: `[Camera IMOU IPC-A32EP (Wifi quay quét 3MP)](https://chugia.shop/san-pham.html#prod-IPC-A32EP)`). Khi người dùng bấm vào link này, hệ thống sẽ mở trực tiếp trang sản phẩm đó trên chugia.shop.
4. **Cam kết dịch vụ**:
   Bảo hành 1 đổi 1 tận nơi 24 tháng, khảo sát lắp đặt hoàn thiện 2 giờ, liên hệ Hotline/Zalo **0941 204 125**.
5. **GỢI Ý COMBO TRỌN GÓI & CÂU HỎI HÀNH ĐỘNG Ở CUỐI ĐOẠN CHAT (BẮT BUỘC)**:
   Sau khi đưa ra sản phẩm đơn lẻ hoặc 2 phương án so sánh, ở CUỐI MỖI CÂU TRẢ LỜI, BẮT BUỘC bạn phải gợi ý 1 Gói Combo trọn gói tương ứng đang có trên website chugia.shop (đã được tối ưu chi phí, đồng bộ kỹ thuật và kèm ưu đãi lắp đặt):
   - Nhu cầu Khóa cửa / Chuông hình / Smarthome: Gợi ý các gói Combo Chuông & Khóa Tenon (kèm link):
     + Căn hộ/chung cư: [Combo Chuông Hình Dahua & Khóa Căn Hộ Tenon K50](https://chugia.shop/combo/dahua-apartment.html) (hoặc https://chugia.shop/san-pham.html#intercomCombos)
     + Biệt thự / Luxury: [Combo Chuông Dahua & Khóa Face ID Tenon A7x](https://chugia.shop/combo/dahua-villa.html)
     + Cửa nhôm Xingfa: [Combo Chuông Dahua & Khóa Cửa Nhôm Tenon AL5 Pro](https://chugia.shop/combo/dahua-aluminum.html)
     + Cửa kính văn phòng: [Combo Chuông Dahua & Khóa Cửa Kính Tenon G4](https://chugia.shop/combo/dahua-office.html)
     + Gói tiết kiệm: [Combo Chuông Dahua & Khóa Tenon K50 Tiết Kiệm](https://chugia.shop/combo/dahua-economic.html)
   - Nhu cầu Mạng Wi-Fi / Router cân bằng tải / Switch PoE: Gợi ý các gói Combo Wi-Fi Ruijie Reyee:
     + Căn hộ / Nhà phố cao tầng: [Combo Wi-Fi Mesh Ruijie Nhà Phố Cao Tầng](https://chugia.shop/combo/ruijie-home.html)
     + Biệt thự sân vườn: [Combo Wi-Fi Biệt Thự Ruijie Chuyên Dụng](https://chugia.shop/combo/ruijie-villa.html)
     + Cafe / Nhà hàng / Văn phòng: [Combo Wi-Fi Chịu Tải Ruijie Doanh Nghiệp](https://chugia.shop/combo/ruijie-office.html)
     + Hoặc xem toàn bộ: [12 Gói Combo Mạng Wi-Fi Chuyên Dụng](https://chugia.shop/combo-wifi.html)
   - Nhu cầu Camera: Gợi ý Combo Camera kèm đầu ghi Dahua hoặc kết hợp Combo Chuông & Khóa Tenon / Combo Wi-Fi đồng bộ.
   - Nêu ngắn gọn 1 ưu điểm của Combo: Tiết kiệm chi phí, đồng bộ 1 ứng dụng quản lý, bảo hành 1 đổi 1 tận nơi 24 tháng.
   - BẮT BUỘC KẾT THÚC CÂU TRẢ LỜI BẰNG ĐÚNG CÂU HỎI:
     Bạn muốn tìm hiểu combo này chứ?
   - KHI KHÁCH BẤM HOẶC NÓI 'Không, tôi muốn tiếp tục tư vấn thêm phương án khác':
     BẮT BUỘC bạn phải nhiệt tình, lịch sự: hoan nghênh tiếp tục tư vấn, hỏi cụ thể khách muốn tối ưu thêm về mức ngân sách, vị trí lắp đặt hay tính năng công nghệ nào để đưa ra giải pháp mới phù hợp nhất!

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
        return (
            "🤖 **Dạ, hệ thống Trợ lý AI Chu Gia Security hiện đang nâng cấp gói dữ liệu tư vấn tự động.**\n\n"
            "Để không làm gián đoạn kế hoạch lựa chọn thiết bị an ninh & giải pháp của Quý khách, xin kính mời Quý khách bấm vào nút bên dưới để trực tiếp tra cứu toàn bộ danh mục 480+ sản phẩm chính hãng, kiểm tra thông số kỹ thuật và nhận báo giá ưu đãi mới nhất:\n\n"
            "[XEM TOÀN BỘ KHO 480+ THIẾT BỊ AN NINH & ĐIỆN THÔNG MINH](https://chugia.shop/san-pham.html)\n\n"
            "---\n\n"
            "✨ **HOẶC XEM NHANH CÁC BỘ GIẢI PHÁP COMBO TRỌN GÓI BÁN CHẠY:**\n"
            "- 📶 **12 Gói Combo Mạng Wi-Fi Chuyên Dụng:** [Khám Phá Gói Wi-Fi 6/7](https://chugia.shop/combo-wifi.html)\n"
            "- 🔔 **12 Gói Combo Chuông Hình & Khóa Thông Minh:** [Khám Phá Gói Chuông & Khóa Tenon](https://chugia.shop/san-pham.html#intercomCombos)\n"
            "- 🧮 **Dự toán chi phí & Đăng ký khảo sát 0đ:** [Lập Dự Toán Trọn Gói](https://chugia.shop/du-toan.html)\n\n"
            "---\n\n"
            "📞 **Kỹ sư Chu Gia luôn sẵn sàng hỗ trợ trực tiếp 24/7:**\n"
            "- **Hotline tư vấn nhanh:** [0941 204 125](tel:0941204125)\n"
            "- **Zalo Kỹ Thuật:** [Chát Zalo Nhận Báo Giá Trực Tiếp](https://zalo.me/0941204125)"
        )
    except urllib.error.URLError as e:
        print(f"[Network Error] {e.reason}")
        return (
            "🤖 **Dạ, hệ thống Trợ lý AI Chu Gia Security hiện đang nâng cấp gói dữ liệu tư vấn tự động.**\n\n"
            "Quý khách có thể trực tiếp tra cứu toàn bộ kho sản phẩm chính hãng tại:\n\n"
            "[XEM TOÀN BỘ KHO 480+ THIẾT BỊ AN NINH & ĐIỆN THÔNG MINH](https://chugia.shop/san-pham.html)\n\n"
            "Hoặc liên hệ Hotline / Zalo Kỹ Thuật 24/7: **0941 204 125** để được hỗ trợ tức thì."
        )
    except Exception as e:
        print(f"[Error] {e}")
        return (
            "🤖 **Dạ, hệ thống Trợ lý AI Chu Gia Security hiện đang bảo trì dữ liệu.**\n\n"
            "Kính mời Quý khách tham khảo trực tiếp tại: [XEM TOÀN BỘ KHO 480+ THIẾT BỊ AN NINH](https://chugia.shop/san-pham.html) "
            "hoặc liên hệ Hotline / Zalo: **0941 204 125**."
        )


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
    print(f"  Combo Wi-Fi:   http://localhost:{PORT}/combo-wifi.html")
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
