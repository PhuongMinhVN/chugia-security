/**
 * CHU GIA TECHNOLOGY - ENTERPRISE SOLUTIONS
 * Dedicated Solutions for HIKVISION, DAHUA & RUIJIE
 * Hotline: 0941 204 125
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------- DANH SÁCH 19 GIẢI PHÁP CHUYÊN DỤNG & PHẦN MỀM TÙY BIẾN ----------------
  const solutionsData = [
    {
      id: 'thanh-pho-thong-minh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'ĐÔ THỊ THÔNG MINH',
      day: '09',
      month: 'Th6',
      title: 'Giải pháp thành phố thông minh – Hikvision',
      image: 'images/solutions/thanh_pho.jpg',
      excerpt: 'Hệ thống giám sát đô thị toàn diện tích hợp AI nhận diện khuôn mặt, đo đếm lưu lượng phương tiện và trung tâm điều hành tập trung IOC.',
      highlights: [
        'AI nhận diện biển số & truy vết đối tượng nghi vấn 24/7',
        'Tích hợp trung tâm chỉ huy IOC giám sát bản đồ số GIS',
        'Cảnh báo sớm sự cố tụ tập đám đông và ùn tắc giao thông'
      ],
      architectureDesc: 'Hệ thống sử dụng các camera PTZ tầm xa 500m, camera AI nhận diện khuôn mặt và biển số tại các nút giao thông trọng điểm, truyền tín hiệu qua mạng quang đô thị về trung tâm điều hành IOC chạy nền tảng HikCentral Master Enterprise.',
      components: [
        { name: 'Camera AI 4K TandemVu', role: 'Ống kính kép bao quát toàn cảnh và zoom bám đuổi' },
        { name: 'Server AI DeepinMind', role: 'Phân tích khuôn mặt và so khớp cơ sở dữ liệu lớn' },
        { name: 'Nền tảng VMS HikCentral', role: 'Quản lý tập trung, điều phối bản đồ số GIS' },
        { name: 'Màn hình ghép Video Wall', role: 'Hiển thị dữ liệu camera phòng chỉ huy công an/UBND' }
      ],
      scope: 'Trung tâm giám sát điều hành đô thị IOC, UBND quận/huyện, công an địa phương, khu đô thị sinh thái.'
    },
    {
      id: 'benh-vien-thong-minh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'Y TẾ & BỆNH VIỆN',
      day: '09',
      month: 'Th6',
      title: 'Giải pháp bệnh viện thông minh – Hikvision',
      image: 'images/solutions/benh_vien.jpg',
      excerpt: 'Giải pháp an ninh y tế tích hợp kiểm soát cửa vô trùng phòng mổ, camera cảnh báo té ngã bệnh nhân và hệ thống gọi y tá trực tuyến.',
      highlights: [
        'Kiểm soát ra vào nhận diện khuôn mặt chống nhiễm khuẩn',
        'AI phát hiện bệnh nhân té ngã hoặc rời giường ban đêm',
        'Quản lý bãi đỗ xe cứu thương ưu tiên luồng cấp cứu 24/7'
      ],
      architectureDesc: 'Kiến trúc bảo mật đa vùng: phân luồng khu vực công cộng (sảnh tiếp đón, hành lang), khu điều trị nội trú (bảo vệ yên tĩnh) và khu cách ly đặc biệt (nhận diện khuôn mặt không chạm, chuông cửa y tế IP).',
      components: [
        { name: 'Camera AI Care Fall-Detection', role: 'Nhận diện tư thế ngã của bệnh nhân trong phòng' },
        { name: 'Máy chấm công & kiểm soát FaceID', role: 'Cửa phòng mổ & kho dược phẩm' },
        { name: 'Intercom IP y tế đầu giường', role: 'Bấm gọi khẩn cấp kết nối trực tiếp phòng trực trực nhật' },
        { name: 'Hệ thống NVR chuyên dụng y tế', role: 'Lưu trữ bảo mật hồ sơ hình ảnh theo chuẩn y khoa' }
      ],
      scope: 'Bệnh viện đa khoa, viện dưỡng lão quốc tế, trung tâm tiêm chủng, phòng khám đa khoa chất lượng cao.'
    },
    {
      id: 'toa-nha-thong-minh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'TÒA NHÀ & INTERCOM',
      day: '09',
      month: 'Th6',
      title: 'Giải pháp cho tòa nhà thông minh – Hikvision',
      image: 'images/solutions/toa_nha.jpg',
      excerpt: 'Hệ thống kiểm soát tòa nhà đồng bộ: phân tầng thang máy, chuông hình gọi cửa Video Doorphone, barie tầng hầm và camera hành lang.',
      highlights: [
        'Phân tầng thang máy tự động chỉ cấp quyền đúng tầng cư dân',
        'Chuông hình cảm ứng mở khóa từ xa qua smartphone',
        'Báo cháy tích hợp camera hồng ngoại hành lang và hầm xe'
      ],
      architectureDesc: 'Mô hình kết nối TCP/IP thống nhất giữa thiết bị gọi sảnh tòa nhà, màn hình căn hộ, bộ phân tầng thang máy và máy chủ quản lý ban quản lý tòa nhà BMS.',
      components: [
        { name: 'Chuông cửa sảnh Lobby Doorphone', role: 'Mở cửa bằng FaceID, thẻ từ, mã QR khách mời' },
        { name: 'Bộ điều khiển phân tầng thang máy', role: 'Chống xâm nhập các tầng riêng tư' },
        { name: 'Màn hình căn hộ 7 inch Android', role: 'Đàm thoại chuông hình và xem camera khuôn viên' },
        { name: 'Camera AI chống ngược sáng WDR', role: 'Giám sát hành lang, thang thoát hiểm, sảnh lễ tân' }
      ],
      scope: 'Tòa nhà văn phòng cho thuê hạng A/B, chung cư cao tầng, khu phức hợp thương mại dịch vụ.'
    },
    {
      id: 'khu-cong-nghiep-thong-minh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'CÔNG NGHIỆP & NHÀ MÁY',
      day: '24',
      month: 'Th5',
      title: 'Giải pháp khu công nghiệp thông minh – Hikvision',
      image: 'images/solutions/khu_cong_nghiep.jpg',
      excerpt: 'Kiểm soát an ninh vòng ngoài hàng rào ảo chống đột nhập, camera đo thân nhiệt trạm điện và quản lý chấm công hàng nghìn công nhân.',
      highlights: [
        'Hàng rào quang điện AI phân biệt người và động vật/cây cối',
        'Kiểm soát xe tải, container bằng nhận diện biển số tự động',
        'Cổng phân làn Flap Barrier chấm công vân tay & FaceID tốc độ cao'
      ],
      architectureDesc: 'Hệ thống phân tán theo diện tích nhà máy: kết nối vòng ring cáp quang chống đứt gãy giữa các xưởng sản xuất, kho ngoại quan và cổng gác bảo vệ về trung tâm an ninh.',
      components: [
        { name: 'Camera nhiệt hàng rào Thermal Pro', role: 'Phát hiện kẻ vượt rào trong bóng tối hoàn toàn' },
        { name: 'Cổng Flap Barrier tốc độ cao', role: 'Chấm công 40 người/phút chống ùn tắc ca làm' },
        { name: 'Hệ thống loa IP thông báo xưởng', role: 'Phát thanh cảnh báo và diễn tập phòng cháy tự động' },
        { name: 'Đầu ghi NVR 128 kênh Hot-Spare', role: 'Lưu trữ dự phòng kép không lo mất dữ liệu' }
      ],
      scope: 'Khu công nghiệp, nhà máy sản xuất linh kiện điện tử, may mặc, chế biến lương thực thực phẩm.'
    },
    {
      id: 'bai-do-xe-thong-minh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'BÃI ĐỖ XE & LPR',
      day: '23',
      month: 'Th5',
      title: 'Giải pháp giám sát bãi xe thông minh – Hikvision',
      image: 'images/solutions/bai_do_xe.jpg',
      excerpt: 'Tự động hóa toàn diện trạm thu phí vào/ra bãi đỗ xe: nhận diện biển số chính xác 99%, mở barie tự động và hiển thị bảng LED hướng dẫn.',
      highlights: [
        'Nhận diện biển số xe máy & ô tô tốc độ < 0.2 giây',
        'Hệ thống cảm biến siêu âm dẫn đường đến vị trí đỗ trống',
        'Thu phí tự động không dừng QR / thẻ từ chống thất thoát vé'
      ],
      architectureDesc: 'Gồm cụm thiết bị làn xe: camera LPR góc nghiêng tối ưu, đèn LED trợ sáng ban đêm, vòng loop từ tính phát hiện xe, barie nâng hạ tốc độ 1.5s và phần mềm quản lý thu phí trung tâm.',
      components: [
        { name: 'Camera chuyên dụng đọc biển số LPR', role: 'Chống lóa đèn pha ô tô cực đại' },
        { name: 'Barie tự động cần thẳng/gập', role: 'Động cơ servo hoạt động 5 triệu chu kỳ' },
        { name: 'Bảng LED thông tin vị trí đỗ', role: 'Báo số lượng chỗ trống từng tầng hầm' },
        { name: 'Phần mềm quản lý bãi đỗ xe Parking', role: 'Kiểm soát vé tháng, vé lượt, doanh thu' }
      ],
      scope: 'Hầm gửi xe trung tâm thương mại, bãi xe bệnh viện, chung cư, trạm trung chuyển xe khách.'
    },
    {
      id: 'panovu-da-ong-kinh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'TOÀN CẢNH DIỆN RỘNG',
      day: '23',
      month: 'Th5',
      title: 'Giải pháp camera đa ống kính PanoVu',
      image: 'images/solutions/panovu.jpg',
      excerpt: 'Giám sát không góc chết 180° đến 360° với độ phân giải siêu nét lên tới 32MP, tích hợp camera PTZ quay quét bám theo mục tiêu chi tiết.',
      highlights: [
        'Một camera thay thế cho 8 đến 10 camera thông thường',
        'Hình ảnh liền mạch không có khe ghép nối góc nhìn',
        'Tự động kích hoạt camera PTZ zoom cận cảnh khi có đột nhập'
      ],
      architectureDesc: 'Cấu trúc đa cảm biến hình ảnh trên cùng một thân máy, kết hợp vi xử lý hình ảnh DSP ghép ảnh thời gian thực, đồng bộ tín hiệu với camera PTZ quang học 40x ở phía dưới.',
      components: [
        { name: 'Cụm Camera PanoVu 180°/360° 16MP', role: 'Bao quát toàn cảnh quảng trường hoặc sân bay' },
        { name: 'Camera Speed Dome PTZ 40x Starlight', role: 'Bám đuổi và phóng to chi tiết khuôn mặt cách 200m' },
        { name: 'Switch PoE công nghiệp High-Power', role: 'Cấp nguồn và truyền dẫn băng thông gigabit' },
        { name: 'Bộ lưu điện UPS chuẩn viễn thông', role: 'Đảm bảo hoạt động liên tục khi mất điện lưới' }
      ],
      scope: 'Quảng trường thành phố, sân vận động, cảng hàng không, ngã tư giao lộ lớn, sân golf.'
    },
    {
      id: 'heat-pro-camera-nhiet',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'PHÒNG CHÁY & CAMERA NHIỆT',
      day: '23',
      month: 'Th5',
      title: 'Giải pháp camera ảnh nhiệt HeatPro – Hikvision',
      image: 'images/solutions/heat_pro.jpg',
      excerpt: 'Cảnh báo sớm nguy cơ hỏa hoạn trước khi khói lửa bùng phát bằng công nghệ đo nhiệt độ bức xạ hồng ngoại chính xác ±2°C.',
      highlights: [
        'Phát hiện điểm nhiệt bất thường tại kho bãi, trạm biến áp',
        'Quan sát xuyên qua khói dày, sương mù và đêm tối hoàn toàn',
        'Kích hoạt còi hú và đèn chớp răn đe tại chỗ ngay lập tức'
      ],
      architectureDesc: 'Ống kính nhiệt kép quang học và cảm biến nhiệt độ VOx microbolometer, phân tích biểu đồ nhiệt thời gian thực, cảnh báo ngay khi nhiệt độ vượt ngưỡng cài đặt.',
      components: [
        { name: 'Camera Bi-spectrum HeatPro', role: 'Ống kính kép quang nhiệt hiển thị hình ảnh chi tiết' },
        { name: 'Hệ thống báo cháy liên động', role: 'Gửi tín hiệu đóng van xả gas/bình chữa cháy tự động' },
        { name: 'Phần mềm đo nhiệt HikCentral Thermal', role: 'Vẽ đồ thị nhiệt độ 24/7 của các máy biến áp' }
      ],
      scope: 'Kho chứa xăng dầu, nhà kho logistics, trạm biến áp 110kV/220kV, xưởng gỗ, bãi tái chế rác.'
    },
    {
      id: 'cham-cong-tu-xa',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'QUẢN LÝ CHUỖI & NHÂN SỰ',
      day: '09',
      month: 'Th5',
      title: 'Giải pháp chấm công từ xa qua mạng internet – Hikvision',
      image: 'images/solutions/cham_cong.jpg',
      excerpt: 'Quản lý thời gian làm việc tập trung cho doanh nghiệp chuỗi hàng trăm cửa hàng, chi nhánh chỉ với kết nối Internet và ứng dụng Cloud.',
      highlights: [
        'Chấm công khuôn mặt chống làm giả bằng ảnh chụp hoặc video',
        'Dữ liệu đồng bộ tự động về phòng nhân sự trụ sở chính',
        'Nhân viên tra cứu bảng công và gửi đơn từ trực tiếp trên app'
      ],
      architectureDesc: 'Các máy chấm công khuôn mặt FaceID tại từng chi nhánh kết nối về nền tảng Hik-Connect / HikCentral Cloud thông qua đường truyền mạng có sẵn, không cần thuê IP tĩnh phức tạp.',
      components: [
        { name: 'Máy chấm công FaceID MinMoe', role: 'Nhận diện trong 0.2 giây góc quét nghiêng rộng' },
        { name: 'Phần mềm chấm công tự động', role: 'Xuất báo cáo Excel chấm công theo ca kíp linh hoạt' },
        { name: 'Ứng dụng di động Hik-Connect', role: 'Dành cho quản lý và nhân viên theo dõi hàng ngày' }
      ],
      scope: 'Chuỗi cửa hàng bán lẻ, chuỗi nhà thuốc, văn phòng công ty nhiều chi nhánh Bắc - Trung - Nam.'
    },
    {
      id: 'he-thong-4-trong-1',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'AN NINH TOÀN DIỆN',
      day: '16',
      month: 'Th6',
      title: 'Giải pháp quản lý 4 trong 1 – Hikvision',
      image: 'images/solutions/4_trong_1.jpg',
      excerpt: 'Hợp nhất 4 phân hệ cốt lõi trên một nền tảng duy nhất: Camera giám sát, Chuông hình Intercom, Kiểm soát ra vào Access Control và Báo động đột nhập.',
      highlights: [
        'Quản trị 4 hệ thống trên một màn hình duy nhất, giảm 60% chi phí',
        'Liên động báo động: có đột nhập tự động đẩy video camera lên màn hình',
        'Đồng bộ tài khoản người dùng và phân quyền linh hoạt'
      ],
      architectureDesc: 'Kiến trúc All-In-One thống nhất giao thức truyền thông, cho phép sự kiện từ cảm biến mở cửa tự động quay camera PTZ tới vị trí đó và bật còi hú liên động.',
      components: [
        { name: 'Đầu ghi hình Hybrid NVR AI', role: 'Xử lý video và tín hiệu I/O báo động tập trung' },
        { name: 'Bộ điều khiển cửa trung tâm', role: 'Kết nối khóa từ, nút bấm Exit, cảm biến từ' },
        { name: 'Bàn phím chuông hình cảm ứng', role: 'Đàm thoại và kiểm soát an ninh đa khu vực' }
      ],
      scope: 'Biệt thự cao cấp, văn phòng tổng công ty, showroom ô tô, ngân hàng, trường học tư thục.'
    },
    {
      id: 'giam-sat-giao-thong-its',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'HẠ TẦNG GIAO THÔNG',
      day: '16',
      month: 'Th1',
      title: 'Giải pháp giám sát giao thông thông minh – Hikvision',
      image: 'images/solutions/giao_thong.jpg',
      excerpt: 'Phạt nguội tự động, đo tốc độ xe bằng radar, phát hiện vượt đèn đỏ, đi sai làn đường và kiểm soát biển số phương tiện truy nã.',
      highlights: [
        'Tự động trích xuất phiếu vi phạm giao thông đầy đủ ảnh & video',
        'Đo tốc độ phương tiện bằng Radar kép độ chính xác cực cao',
        'Đếm lưu lượng phương tiện hỗ trợ điều khiển đèn tín hiệu thông minh'
      ],
      architectureDesc: 'Cột camera giám sát giao thông gồm camera nhận diện chuyên dụng màn trập Global Shutter, đèn flash LED chụp biển số đêm, radar đo vận tốc và switch mạng công nghiệp ngoài trời.',
      components: [
        { name: 'Camera ITS Checkpoint chuyên dụng', role: 'Chụp rõ nét mặt tài xế và biển số xe ở tốc độ 120km/h' },
        { name: 'Radar đo tốc độ công nghệ Doppler', role: 'Đo vận tốc phương tiện đa làn đường' },
        { name: 'Đèn Flash đồng bộ xung nhịp', role: 'Chiếu sáng khoảnh khắc xe đi qua không gây chói mắt' },
        { name: 'Hệ thống máy chủ xử lý vi phạm', role: 'Tự động tạo biên bản phạt nguội gửi CSGT' }
      ],
      scope: 'Các tuyến quốc lộ, cao tốc, ngã tư đô thị, trạm thu phí BOT, trạm cân xe tự động.'
    },
    {
      id: 'khach-san-thong-minh',
      brand: 'hikvision',
      brandName: 'HIKVISION',
      category: 'KHÁCH SẠN & RESORT',
      day: '24',
      month: 'Th3',
      title: 'Giải pháp cho khách sạn thông minh – Hikvision',
      image: 'images/solutions/khach_san.jpg',
      excerpt: 'Nâng tầm trải nghiệm lưu trú của du khách: check-in không chạm bằng khuôn mặt, mở cửa phòng bằng smartphone và bảo vệ an toàn hành lang riêng tư.',
      highlights: [
        'Khách tự check-in nhận phòng qua Kiosk thông minh trong 30 giây',
        'Khóa cửa thông minh chuẩn khách sạn tích hợp thẻ từ và Bluetooth',
        'Camera giám sát hành lang thiết kế thẩm mỹ hòa hợp nội thất 5 sao'
      ],
      architectureDesc: 'Tích hợp phần mềm quản lý khách sạn PMS với hệ sinh thái camera an ninh, kiểm soát ra vào thang máy khách sạn và khóa cửa phòng thông minh.',
      components: [
        { name: 'Khóa cửa thẻ từ khách sạn Zigbee/BLE', role: 'Tiết kiệm pin, mở qua thẻ hoặc mã số tạm' },
        { name: 'Kiosk tự phục vụ Self Check-in', role: 'Quét hộ chiếu, chụp ảnh khuôn mặt và xuất thẻ' },
        { name: 'Camera Dome mini siêu nhỏ', role: 'Giám sát hành lang thẩm mỹ không gây khó chịu cho khách' }
      ],
      scope: 'Khách sạn 3-5 sao, khu nghỉ dưỡng cao cấp Resort, condotel, homestay không người vận hành.'
    },
    // DAHUA TECHNOLOGY SOLUTIONS - 4 CỘT TRỤ GIẢI PHÁP ĐÔ THỊ (CITY SOLUTIONS)
    {
      id: 'dahua-thanh-pho-thong-minh',
      brand: 'dahua',
      brandName: 'DAHUA CITY',
      isCity: true,
      category: 'ĐÔ THỊ THÔNG MINH',
      day: '13',
      month: 'Th9',
      title: 'Giải pháp Thành phố thông minh & Trung tâm điều hành IOC – Dahua',
      image: 'images/solutions/dahua_smart_city.jpg',
      excerpt: 'Hệ sinh thái an ninh đô thị toàn diện: Giám sát toàn cảnh diện rộng, nhận diện khuôn mặt AI truy vết tội phạm, kiểm soát an ninh cơ quan hành chính công và chỉ huy tác chiến trên bản đồ số GIS.',
      highlights: [
        'Camera Multi-Sensor Panorama 180°/360° kết hợp PTZ 32x bám đuổi mục tiêu',
        'Trung tâm chỉ huy thông minh Dahua ICC tích hợp bản đồ số GIS thời gian thực',
        'Kiểm soát ra vào cơ quan hành chính công bằng FaceID, Flap Barrier & Soi chiếu X-Ray'
      ],
      architectureDesc: 'Hệ thống xây dựng theo mô hình 4 tầng hợp nhất: Tầng cảm biến biên (Camera AI toàn cảnh, PTZ tầm xa 250m, chuông cửa IP VTO, cổng FaceID), Tầng truyền dẫn cáp quang đô thị bảo mật cao, Tầng máy chủ xử lý dữ liệu lớn AI (Dahua IVSS & NVR Enterprise 64 kênh) và Tầng ứng dụng trung tâm chỉ huy IOC hiển thị trên Video Wall cỡ lớn.',
      components: [
        { name: 'Camera Dahua DH-SD6CE232GB-HNR', role: 'IP PTZ 2MP Zoom quang học 32x, hồng ngoại 250m WizMind AI', productId: '1168703' },
        { name: 'Đầu ghi AI Dahua DHI-NVR5464-EI2', role: 'Đầu ghi dự án 64 kênh 4K, hỗ trợ 4 HDD, AI WizSense/WizMind', productId: '1168686' },
        { name: 'Chuông cửa thông minh DHI-VTO2201F-P-S2', role: 'Nút nhấn Intercom IP kim loại góc rộng 140° mở khóa từ xa', productId: '1168276' },
        { name: 'Camera Panorama Multi-Sensor 180°', role: 'Bao quát toàn cảnh quảng trường, công viên, tuyến phố đi bộ' },
        { name: 'Cổng phân làn Flap Barrier ASGB & FaceID', role: 'Kiểm soát an ninh tòa nhà UBND và cơ quan hành chính' },
        { name: 'Nền tảng quản lý tập trung Dahua ICC / DSS Pro', role: 'Điều hành bản đồ GIS, liên thông thoại khẩn cấp và cứu hộ' }
      ],
      scope: 'Trung tâm giám sát điều hành đô thị thông minh IOC, UBND tỉnh/thành phố, trụ sở công an, quảng trường trung tâm và các khu đại đô thị sinh thái.'
    },
    {
      id: 'dahua-giao-thong-thong-minh-its',
      brand: 'dahua',
      brandName: 'DAHUA CITY',
      isCity: true,
      category: 'GIAO THÔNG THÔNG MINH',
      day: '13',
      month: 'Th9',
      title: 'Giải pháp Quản lý giao thông thông minh ITS & Phạt nguội – Dahua',
      image: 'images/solutions/dahua_traffic_its.jpg',
      excerpt: 'Hệ thống camera giao thông chuyên dụng ứng dụng AI ANPR đọc biển số chính xác >99%, giám sát tốc độ cao tốc bằng Radar, bắt phạt nguội tự động và điều khiển đèn tín hiệu thích ứng chống ùn tắc.',
      highlights: [
        'Camera AI ANPR chụp phạt nguội vượt đèn đỏ, đi sai làn, chạy quá tốc độ',
        'Cụm Radar cao tốc phát hiện xe dừng đỗ trái phép, đi ngược chiều và sự cố hầm',
        'Điều khiển tín hiệu đèn giao thông thông minh thích ứng theo lưu lượng xe thực tế'
      ],
      architectureDesc: 'Cụm thiết bị lắp đặt tại các nút giao trọng điểm và tuyến cao tốc gồm: Camera ANPR độ phân giải 9MP/4MP, Radar vi ba đo tốc độ chính xác từng làn đường, Đèn chớp flash LED trợ sáng đồng bộ cực đại chống lóa đèn xe, kết nối trực tiếp về Trung tâm điều hành giao thông qua phần mềm DSS Traffic.',
      components: [
        { name: 'Camera ANPR Phạt Nguội Dahua ITC952 / ITC431', role: 'Đọc biển số xe máy & ô tô tốc độ cao, nhận diện vi phạm tự động' },
        { name: 'Radar đo tốc độ đa làn đường vi ba', role: 'Đo vận tốc phương tiện chính xác sai số < 1km/h trên cao tốc' },
        { name: 'Camera AI Dahua DH-IPC-HFW2849TL-S-PRO', role: 'Thân sắt 8MP 4K WizColor ghi hình màu chi tiết ban đêm', productId: '1168708' },
        { name: 'Đầu ghi hình chuyên dụng DHI-NVR5432-EI2', role: 'Lưu trữ 32 kênh dữ liệu phạt nguội và video đối soát', productId: '1168687' },
        { name: 'Cảm biến đo đếm lưu lượng xe AI & Bảng LED VMS', role: 'Điều tiết chu kỳ đèn xanh thông minh và thông báo cảnh báo tắc đường' }
      ],
      scope: 'Tuyến đường cao tốc, quốc lộ, đại lộ đô thị, các nút giao thông ngã tư phức tạp, cầu vượt và hầm chui cơ giới.'
    },
    {
      id: 'dahua-van-tai-smart-transit',
      brand: 'dahua',
      brandName: 'DAHUA CITY',
      isCity: true,
      category: 'VẬN TẢI & LOGISTICS',
      day: '13',
      month: 'Th9',
      title: 'Giải pháp Vận tải thông minh, Sân bay, Cảng biển & Metro – Dahua',
      image: 'images/solutions/dahua_smart_transit.jpg',
      excerpt: 'Giải pháp an ninh đa tầng cho hạ tầng giao thông vận tải: Hàng rào ảnh nhiệt chu vi sân bay, camera vỏ thép 316L chống ăn mòn cảng biển đọc mã container và giám sát đoàn xe buýt bằng AI ADAS/DSM.',
      highlights: [
        'Camera nhiệt Thermal bảo vệ chu vi đường băng sân bay bất kể sương mù, mưa bão',
        'Camera chuyên dụng vỏ thép 316L chống ăn mòn muối biển, tự động đọc mã container (ACCR)',
        'Hệ thống trên xe Mobile NVR kết hợp camera AI ADAS (cảnh báo va chạm) và DSM (chống ngủ gật)'
      ],
      architectureDesc: 'Đối với hạ tầng cảng biển và sân bay, hệ thống sử dụng camera chuyên dụng chuẩn chống ăn mòn NEMA-4X/IP68 kết hợp phân tích nhiệt quang học. Đối với vận tải công cộng đường bộ, triển khai thiết bị Mobile NVR chuẩn rung xóc quân đội EN50155, tích hợp định vị GPS 4G và thuật toán AI giám sát tài xế.',
      components: [
        { name: 'Camera chống ăn mòn cảng biển Dahua DH-EPC230U', role: 'Vỏ thép không gỉ 316L chịu mặn, sương muối, gió bão biển' },
        { name: 'Camera ảnh nhiệt hàng rào Thermal TPC-BF5421', role: 'Phát hiện xâm nhập chu vi sân bay và kho bãi hàng không' },
        { name: 'Đầu ghi trên xe Dahua Mobile NVR MNVR4104', role: 'Gắn trên xe buýt, xe khách, xe đầu kéo tải nặng, chống sốc tuyệt đối' },
        { name: 'Camera kép AI ADAS + DSM trên xe', role: 'Cảnh báo chệch làn đường, phát hiện tài xế ngáp, hút thuốc, nghe máy' },
        { name: 'Camera PTZ Dahua DH-SD5A225GB-HNR', role: 'Quay quét 360° Zoom 25x giám sát ke ga và bến bãi logistics', productId: '1168705' }
      ],
      scope: 'Cảng hàng không quốc tế, cảng biển nước sâu, ga đường sắt đô thị Metro, tổng công ty vận tải hành khách & logistics container.'
    },
    {
      id: 'dahua-moi-truong-sinh-thai',
      brand: 'dahua',
      brandName: 'DAHUA CITY',
      isCity: true,
      category: 'MÔI TRƯỜNG SINH THÁI',
      day: '13',
      month: 'Th9',
      title: 'Giải pháp Môi trường sinh thái, Đo mực nước ngập & Cháy rừng – Dahua',
      image: 'images/solutions/dahua_smart_ecology.jpg',
      excerpt: 'Ứng dụng công nghệ thị giác AI bảo vệ tài nguyên thiên nhiên và đô thị: Tự động đo mực nước sông ngòi & cảnh báo ngập lụt hầm chui, phát hiện sớm cháy rừng tầm xa 10km bằng camera nhiệt kép.',
      highlights: [
        'Camera AI đo mực nước tự động tại sông hồ & điểm đen ngập úng đô thị, báo động khẩn',
        'Camera nhiệt Bi-spectrum PTZ tầm xa quét 360° phát hiện sớm đốm lửa cháy rừng cách 5 - 10km',
        'Trạm cảm biến quan trắc môi trường kết hợp camera giám sát chất lượng không khí PM2.5'
      ],
      architectureDesc: 'Triển khai các trạm quan trắc năng lượng mặt trời Solar 4G độc lập tại lưu vực sông, đê điều, rừng quốc gia và các cửa hầm chui đô thị. Dữ liệu mực nước, nhiệt độ và hình ảnh viễn thám được phân tích AI tại biên và truyền thẳng về máy chủ quản lý thiên tai và cảnh báo sớm cho người dân qua ứng dụng di động.',
      components: [
        { name: 'Cụm Camera nhiệt Bi-spectrum PTZ Dahua TPC-SD8621B', role: 'Tầm quét quang nhiệt 10km, thuật toán phát hiện khói lửa tự động' },
        { name: 'Camera AI đo mực nước sông ngòi Dahua Water-Level', role: 'Đọc vạch thước đo thủy triều và đo cao độ mặt nước tự động' },
        { name: 'Camera Solar 4G Dahua độc lập', role: 'Tự cấp nguồn năng lượng mặt trời hoạt động liên tục tại vùng rừng núi' },
        { name: 'Hệ thống NVR Dự Án Dahua DHI-NVR5216-EI', role: 'Ghi hình 16 kênh AI, quản lý cảnh báo phân tích môi trường', productId: '1168690' },
        { name: 'Cảm biến khí tượng IoT (Bụi PM2.5, Hướng gió, Nhiệt độ)', role: 'Quan trắc môi trường và phát thanh cảnh báo tự động' }
      ],
      scope: 'Chi cục Thủy lợi và Phòng chống thiên tai, Ban quản lý rừng phòng hộ/quốc gia, Trung tâm quan trắc môi trường, BQL hầm đường bộ đô thị.'
    },
    // DAHUA TECHNOLOGY SOLUTIONS - KHỐI DOANH NGHIỆP & THƯƠNG MẠI
    {
      id: 'dahua-kho-van-logistics',
      brand: 'dahua',
      brandName: 'DAHUA',
      category: 'LOGISTICS & KHO BÃI',
      day: '18',
      month: 'Th4',
      title: 'Giải pháp nhà xưởng & kho vận Logistics – Dahua',
      image: 'images/solutions/dahua_kho_van.jpg',
      excerpt: 'AI kiểm soát xe container ra vào, camera 3 mắt bám đuổi xe nâng trong kho, kiểm soát nhiệt độ kho lạnh và phòng chống cháy nổ hàng hóa.',
      highlights: [
        'AI đọc mã số thùng container và biển số xe tải đồng thời',
        'Camera PTZ bám đuổi xe nâng tự động phát hiện va chạm',
        'Cảm biến nhiệt độ cảnh báo nguy cơ hỏa hoạn pallet hàng'
      ],
      architectureDesc: 'Mạng lưới camera công nghiệp chống bụi IP67, camera PTZ tầm xa lắp trần cao 12m và hệ thống quản lý kho vận Dahua DSS Pro tích hợp phần mềm WMS kho hàng.',
      components: [
        { name: 'Camera AI TiOC 3-in-1 Dahua', role: 'Báo động chủ động đèn chớp còi hú khi công nhân vào vùng cấm' },
        { name: 'Camera đọc biển số và mã container', role: 'Tại cổng barie cảng ICD và kho ngoại quan' },
        { name: 'Đầu ghi AI WizMind NVR', role: 'Phân tích hành vi, tìm kiếm video thông minh' }
      ],
      scope: 'Trung tâm phân phối logistics, kho hàng thương mại điện tử, kho lạnh bảo quản thực phẩm, nhà xưởng cơ khí.'
    },
    {
      id: 'dahua-truong-hoc-campus',
      brand: 'dahua',
      brandName: 'DAHUA',
      category: 'GIÁO DỤC & TRƯỜNG HỌC',
      day: '12',
      month: 'Th4',
      title: 'Giải pháp trường học thông minh Smart Campus – Dahua',
      image: 'images/solutions/dahua_truong_hoc.jpg',
      excerpt: 'Bảo vệ an toàn tuyệt đối cho học sinh: điểm danh khuôn mặt cổng trường gửi tin nhắn cho phụ huynh, rào ảo khu vực hồ bơi và phát hiện bạo lực học đường.',
      highlights: [
        'Điểm danh tự động qua cổng trường, thông báo thời gian đến lớp cho cha mẹ',
        'Rào chắn ảo AI báo động ngay khi học sinh tiếp cận lan can/hồ bơi nguy hiểm',
        'Phát hiện hành vi tụ tập xô xát bất thường tại góc khuất sân trường'
      ],
      architectureDesc: 'Hệ thống camera AI kết hợp cổng kiểm soát học sinh tại cổng trường, loa phát thanh khuôn viên IP và bảng điều khiển thông minh tại phòng giám thị.',
      components: [
        { name: 'Cổng kiểm soát thẻ/FaceID học sinh', role: 'Ghi nhận giờ vào ra tự động' },
        { name: 'Camera AI nhận diện hành vi bạo lực', role: 'Gửi cảnh báo tức thì về điện thoại bảo vệ' },
        { name: 'Màn hình tương tác giáo dục Dahua DeepHub', role: 'Hỗ trợ giảng dạy và hội thảo từ xa' }
      ],
      scope: 'Trường học liên cấp mầm non - tiểu học - THPT, trường quốc tế, trường đại học cao đẳng.'
    },
    {
      id: 'dahua-nang-luong-mat-troi',
      brand: 'dahua',
      brandName: 'DAHUA',
      category: 'NĂNG LƯỢNG & ĐIỆN MẶT TRỜI',
      day: '05',
      month: 'Th4',
      title: 'Giải pháp năng lượng mặt trời & trạm điện – Dahua',
      image: 'images/solutions/dahua_nang_luong.jpg',
      excerpt: 'Giám sát độc lập hoàn toàn không cần điện lưới và dây mạng: camera tích hợp pin năng lượng mặt trời và sim 4G chuyên dụng cho trang trại điện.',
      highlights: [
        'Hoạt động bền bỉ liên tục 7 ngày trong điều kiện mưa bão âm u',
        'Truyền hình ảnh thời gian thực qua sóng di động 4G/5G tốc độ cao',
        'Phát hiện kẻ trộm cắt trộm dây cáp đồng và thiết bị Inverter'
      ],
      architectureDesc: 'Các cột giám sát năng lượng độc lập gồm tấm pin monocrystalline, pin lithium lưu trữ tuổi thọ 8 năm, camera PTZ năng lượng mặt trời 4G kết nối trực tiếp về app cloud.',
      components: [
        { name: 'Camera Solar PTZ 4G Dahua 4MP', role: 'Quay quét 360 độ ban đêm có màu sắc nét' },
        { name: 'Tấm pin quang điện hiệu suất cao', role: 'Chống bụi, chống chịu gió bão cấp 12' },
        { name: 'Pin lưu trữ Lithium sắt phosphate (LiFePO4)', role: 'An toàn chống cháy nổ ở nhiệt độ cao' }
      ],
      scope: 'Trang trại điện mặt trời áp mái, trạm điện gió, trạm bơm thủy lợi vùng sâu, công trình xây dựng vùng xa.'
    },
    {
      id: 'dahua-ban-le-heatmap',
      brand: 'dahua',
      brandName: 'DAHUA',
      category: 'BÁN LẺ & SIÊU THỊ',
      day: '28',
      month: 'Th3',
      title: 'Giải pháp chuỗi bán lẻ & siêu thị Heatmap – Dahua',
      image: 'images/solutions/dahua_ban_le.jpg',
      excerpt: 'Tối ưu hóa doanh số bán lẻ nhờ dữ liệu thị giác AI: bản đồ nhiệt khách dừng chân (Heatmap), đếm lượng người ra vào (People Counting) và quản lý xếp hàng.',
      highlights: [
        'Bản đồ nhiệt phân tích kệ hàng nào thu hút nhiều khách xem nhất',
        'Đếm chính xác lượng khách vào ra để tính tỷ lệ chuyển đổi mua hàng',
        'Cảnh báo khi quầy thu ngân có trên 5 người đợi để mở thêm quầy'
      ],
      architectureDesc: 'Camera góc rộng AI gắn trần tại sảnh chính và các lối đi giữa kệ hàng, phần mềm phân tích BI (Business Intelligence) trích xuất biểu đồ báo cáo gửi ban giám đốc mỗi ngày.',
      components: [
        { name: 'Camera đếm người People Counting 2 mắt', role: 'Độ chính xác 98% loại trừ trẻ em/xe đẩy' },
        { name: 'Camera Fisheye 360° Heatmap', role: 'Vẽ mật độ bước chân khách hàng trên sơ đồ sàn' },
        { name: 'Phần mềm phân tích bán lẻ Dahua DSS Retail', role: 'Tích hợp dữ liệu máy tính tiền POS' }
      ],
      scope: 'Hệ thống siêu thị, trung tâm mua sắm, chuỗi cửa hàng thời trang, showroom mỹ phẩm.'
    },
    {
      id: 'dahua-ngan-hang-atm',
      brand: 'dahua',
      brandName: 'DAHUA',
      category: 'NGÂN HÀNG & TÀI CHÍNH',
      day: '15',
      month: 'Th3',
      title: 'Giải pháp ngân hàng & phòng giao dịch ATM – Dahua',
      image: 'images/solutions/dahua_ngan_hang.jpg',
      excerpt: 'An ninh chuẩn ngân hàng cấp cao: camera giấu kín tại cây ATM, cảnh báo dán thiết bị lạ (Skimming), nhận diện khách VIP và liên động báo động chống cướp.',
      highlights: [
        'AI phát hiện hành vi che mặt hoặc đứng quá gần bàn phím ATM',
        'Nút bấm khẩn cấp bàn giao dịch âm thầm gửi cảnh báo tới công an',
        'Lưu trữ video độ phân giải cao 90 ngày theo quy định ngân hàng nhà nước'
      ],
      architectureDesc: 'Hệ thống camera độ bảo mật cao mã hóa video AES-256, đầu ghi NVR chuyên dụng ngân hàng có ổ cứng sao lưu RAID 5/6 và đường truyền VPN nội bộ khép kín.',
      components: [
        { name: 'Camera Pinhole ATM siêu nhỏ', role: 'Giấu kín góc quay bàn phím và khe cắm thẻ' },
        { name: 'Camera góc rộng nhận diện khách VIP', role: 'Báo nhân viên tiếp đón khách hàng ưu tiên' },
        { name: 'Bàn đạp báo động chân bí mật', role: 'Kết nối trung tâm an ninh 113' }
      ],
      scope: 'Trụ sở ngân hàng thương mại, chi nhánh phòng giao dịch, cây rút tiền ATM/CDM 24/7.'
    },
    // RUIJIE NETWORK ENTERPRISE SOLUTION
    {
      id: 'ruijie-mang-chuoi-ban-le',
      brand: 'ruijie',
      brandName: 'RUIJIE | REYEE',
      category: 'HẠ TẦNG MẠNG CLOUD',
      day: '25',
      month: 'Th3',
      title: 'Giải pháp mạng dành cho chuỗi bán lẻ và Chi nhánh',
      image: 'images/solutions/chuoi_ban_le.jpg',
      excerpt: 'Giải pháp mạng Ruijie Reyee quản lý Cloud trọn đời miễn phí: tự động tối ưu Wi-Fi, cân bằng tải Internet đa nhà mạng và cấu hình từ xa trong 3 phút.',
      highlights: [
        'Quản trị 100+ chi nhánh trên một ứng dụng Ruijie Cloud duy nhất',
        'Tách biệt mạng Wi-Fi thanh toán POS với mạng Wi-Fi Marketing cho khách',
        'Tự động khắc phục sự cố mạng và chuyển vùng Roaming không ngắt quãng'
      ],
      architectureDesc: 'Bộ định tuyến Gateway cân bằng tải thông minh kết hợp Switch PoE cấp nguồn cho camera và các bộ phát Wi-Fi âm trần Mesh tốc độ cao, đồng bộ cấu hình qua đám mây Cloud.',
      components: [
        { name: 'Router Gateway cân bằng tải Reyee', role: 'Chạy đồng thời 2-4 đường truyền internet chống mất mạng' },
        { name: 'Bộ phát Wi-Fi 6 trần công suất lớn', role: 'Chịu tải 150 người dùng kết nối cùng lúc' },
        { name: 'Switch PoE thông minh quản lý Cloud', role: 'Tự động khởi động lại camera khi bị treo từ xa' }
      ],
      scope: 'Chuỗi cà phê, chuỗi trà sữa, nhà hàng ẩm thực, chuỗi bán lẻ thời trang, văn phòng doanh nghiệp.'
    },
    {
      id: 'phan-mem-tuy-bien-doanh-nghiep',
      brand: 'software',
      brandName: 'CHU GIA SOFTWARE',
      category: 'PHẦN MỀM TÙY BIẾN',
      day: '12',
      month: 'Th9',
      title: 'Thiết kế phần mềm giám sát & quản trị an ninh tùy biến theo quy trình doanh nghiệp',
      image: 'images/solutions/phan_mem_tuy_bien.jpg',
      excerpt: 'Lập trình Dashboard Web & App di động giám sát tập trung nhiều chi nhánh, phân quyền đa cấp, tích hợp bãi xe thông minh LPR và cảnh báo tức thì Telegram/Zalo theo đúng quy trình riêng của từng doanh nghiệp.',
      highlights: [
        'Giao diện Dashboard thiết kế riêng theo nhận diện thương hiệu công ty',
        'Tích hợp quản lý bãi đỗ xe LPR, barie tự động, thanh toán VietQR',
        'Cảnh báo tức thì về điện thoại qua Telegram Bot & Zalo OA 24/7'
      ],
      architectureDesc: 'Hệ thống xây dựng theo mô hình Microservices: Frontend Web/App (React/Flutter), Backend API Gateway (Node.js/Python FastAPI), kết nối camera qua RTSP/WebRTC và Hikvision/Dahua OpenAPI, cơ sở dữ liệu phân tán PostgreSQL + Redis, hỗ trợ triển khai On-Premise hoặc Private Cloud.',
      components: [
        { name: 'Web Dashboard & Mobile App', role: 'Giao diện điều hành giám sát tập trung đa nền tảng' },
        { name: 'API Gateway & Event Broker', role: 'Xử lý luồng sự kiện thời gian thực từ camera & cảm biến' },
        { name: 'Module LPR & Barie Controller', role: 'Kiểm soát phương tiện ra vào bãi đỗ xe tự động' },
        { name: 'Bot Telegram & Zalo OA Alert', role: 'Gửi cảnh báo video/hình ảnh vi phạm tức thì' }
      ],
      scope: 'Chuỗi cửa hàng bán lẻ, nhà máy sản xuất, tòa nhà văn phòng, khu đô thị, bến bãi logistics.'
    },
    {
      id: 'tich-hop-camera-erp-pos-wms',
      brand: 'software',
      brandName: 'CHU GIA SOFTWARE',
      category: 'TÍCH HỢP HỆ THỐNG',
      day: '15',
      month: 'Th8',
      title: 'Giải pháp tích hợp dữ liệu Camera & AI vào hệ sinh thái ERP, POS, HRM, WMS',
      image: 'images/solutions/tich_hop_erp_pos.jpg',
      excerpt: 'Kết nối dòng dữ liệu AI từ Camera và máy chấm công trực tiếp vào phần mềm kế toán, ERP (Odoo, SAP, Misa), phần mềm bán lẻ POS và quản lý kho bãi WMS, loại bỏ hoàn toàn thao tác nhập liệu thủ công.',
      highlights: [
        'Tự động đồng bộ giờ công FaceID về bảng lương nhân sự HRM',
        'Đối soát video camera khớp thời gian thực với từng hóa đơn thanh toán POS',
        'Đọc biển số xe tải cân hàng tự động cập nhật phiếu nhập kho WMS'
      ],
      architectureDesc: 'Sử dụng Data Pipeline chuyên dụng kết nối thiết bị an ninh thông qua Hikvision OpenAPI & Dahua DH-SDK. Dữ liệu khuôn mặt, biển số, hình ảnh đối soát được đóng gói theo chuẩn RESTful JSON/Webhook để đồng bộ 2 chiều với hệ thống ERP/POS sẵn có của khách hàng.',
      components: [
        { name: 'OpenAPI / SDK Adapter', role: 'Cổng giao tiếp phần cứng Camera & Máy chấm công' },
        { name: 'HRM Sync Service', role: 'Đồng bộ dữ liệu chấm công FaceID vào bảng lương' },
        { name: 'POS Video Matcher', role: 'Gắn thẻ mã hóa đơn tính tiền vào đoạn video tương ứng' },
        { name: 'WMS Weight-Bridge Connector', role: 'Chụp ảnh biển số xe và đồng bộ dữ liệu trạm cân xe tải' }
      ],
      scope: 'Doanh nghiệp sản xuất, chuỗi siêu thị, tổng kho logistics, công ty nhiều chi nhánh phân tán.'
    }
  ];

  // ---------------- DOM ELEMENTS ----------------
  const solutionsGrid = document.getElementById('solutionsGrid');
  const searchInput = document.getElementById('solSearchInput');
  const tabButtons = document.querySelectorAll('.sol-tab-btn');
  const modalOverlay = document.getElementById('solutionModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalContentBody');
  const consultForm = document.getElementById('consultForm');
  const selectedSolutionInput = document.getElementById('selectedSolution');

  let currentBrand = 'all';
  let currentSearch = '';

  // ---------------- RENDER SOLUTIONS FUNCTION ----------------
  function renderSolutions(brand = 'all', query = '') {
    if (!solutionsGrid) return;

    let filtered = solutionsData;

    // Lọc theo Brand
    if (brand !== 'all') {
      if (brand === 'dahua-city') {
        filtered = filtered.filter(s => s.isCity || s.brand === 'dahua-city');
      } else if (brand === 'dahua') {
        filtered = filtered.filter(s => s.brand === 'dahua' || s.brand === 'dahua-city');
      } else {
        filtered = filtered.filter(s => s.brand === brand);
      }
    }

    // Lọc theo từ khóa tìm kiếm
    if (query.trim() !== '') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        s.brandName.toLowerCase().includes(q) ||
        s.scope.toLowerCase().includes(q)
      );
    }

    // Cập nhật số lượng trên các tab bộ lọc
    document.querySelectorAll('.sol-tab-btn').forEach(btn => {
      const b = btn.getAttribute('data-brand');
      const counter = btn.querySelector('.tab-counter');
      if (counter) {
        if (b === 'all') counter.textContent = solutionsData.length;
        else if (b === 'dahua-city') counter.textContent = solutionsData.filter(s => s.isCity || s.brand === 'dahua-city').length;
        else if (b === 'dahua') counter.textContent = solutionsData.filter(s => s.brand === 'dahua' || s.brand === 'dahua-city').length;
        else counter.textContent = solutionsData.filter(s => s.brand === b).length;
      }
    });

    if (filtered.length === 0) {
      solutionsGrid.innerHTML = `
        <div class="sol-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 class="sol-empty-title">Không tìm thấy giải pháp phù hợp</h3>
          <p class="sol-empty-desc">Vui lòng thử lại với từ khóa khác (ví dụ: "bệnh viện", "bãi xe", "nhà máy", "chấm công"...) hoặc liên hệ kỹ sư Chu Gia để được tư vấn riêng.</p>
          <button class="btn btn-primary btn-sm" id="btnResetSearch" style="margin-top: 14px;">Xem Tất Cả Giải Pháp</button>
        </div>
      `;
      const btnReset = document.getElementById('btnResetSearch');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          currentSearch = '';
          currentBrand = 'all';
          tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-brand') === 'all'));
          renderSolutions('all', '');
        });
      }
      return;
    }

    solutionsGrid.innerHTML = filtered.map(item => `
      <div class="sol-card" data-brand="${item.brand}" id="${item.id}">
        <!-- Thumbnail & Date Badge (matching nhaantoan.com style) -->
        <div class="sol-thumb-box">
          <div class="post-date-badge">
            <span class="post-date-day">${item.day}</span>
            <span class="post-date-month">${item.month}</span>
          </div>
          <span class="sol-brand-chip ${item.brand}">${item.brandName}</span>
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>

        <!-- Content Body -->
        <div class="sol-card-body">
          <div class="sol-category-tag">${item.category}</div>
          <h3 class="sol-title">${item.title}</h3>
          <p class="sol-excerpt">${item.excerpt}</p>

          <ul class="sol-highlights">
            ${item.highlights.map(h => `
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>

          <!-- Action Footer -->
          <div class="sol-card-footer">
            <button class="btn-sol-detail btn-open-modal" data-id="${item.id}">
              <span>Xem Bản Vẽ & Chi Tiết</span>
            </button>
            <button class="btn-sol-contact btn-book-sol" data-title="${item.title}">
              <span>Tư Vấn Dự Án</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    attachCardEvents();
  }

  // ---------------- EVENT LISTENERS CHO THẺ GIẢI PHÁP ----------------
  function attachCardEvents() {
    // Nút Xem Bản Vẽ & Chi Tiết
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openSolutionModal(id);
      });
    });

    // Nút Tư Vấn Dự Án
    document.querySelectorAll('.btn-book-sol').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-title');
        scrollToConsultForm(title);
      });
    });
  }

  // ---------------- MODAL CHI TIẾT GIẢI PHÁP ----------------
  function openSolutionModal(solutionId) {
    const item = solutionsData.find(s => s.id === solutionId);
    if (!item || !modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-header-banner">
        <img src="${item.image}" alt="${item.title}">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7,11,20,0.95), transparent); padding: 24px 30px 14px;">
          <span class="sol-brand-chip ${item.brand}" style="position: static; display: inline-block; margin-bottom: 8px;">${item.brandName}</span>
          <h2 style="font-size: 1.45rem; color: #FFFFFF; font-weight: 800; margin: 0;">${item.title}</h2>
        </div>
      </div>

      <div class="modal-body-padding">
        <div style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin-bottom: 20px;">
          ${item.excerpt}
        </div>

        <h4 class="modal-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6600" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          <span>Sơ Đồ Nguyên Lý & Kiến Trúc Hệ Thống</span>
        </h4>
        <p style="font-size: 0.88rem; color: #64748B; line-height: 1.55;">
          ${item.architectureDesc}
        </p>

        <h4 class="modal-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A0E9" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <span>Danh Mục Thiết Bị Cốt Lõi Dự Án</span>
        </h4>
        <div class="modal-components-grid">
          ${item.components.map(c => `
            <div class="modal-component-card ${c.productId ? 'has-product-link' : ''}">
              <div class="modal-component-name">
                <span>${c.name}</span>
                ${c.productId ? `
                  <a href="san-pham.html?product=${c.productId}" target="_blank" class="component-view-prod-btn" title="Xem giá và thông số sản phẩm trong kho Chu Gia">
                    <span>Xem Sản Phẩm</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                ` : ''}
              </div>
              <div class="modal-component-role">${c.role}</div>
            </div>
          `).join('')}
        </div>

        <h4 class="modal-section-heading" style="margin-top: 24px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>Phạm Vi Ứng Dụng Thực Tế</span>
        </h4>
        <p style="font-size: 0.88rem; color: #475569; background: #F1F5F9; padding: 10px 14px; border-radius: 8px; font-weight: 500;">
          🏢 ${item.scope}
        </p>

        <div style="display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap;">
          <a href="tel:0941204125" class="btn btn-primary" style="flex: 1; min-width: 200px; text-align: center;">
            <span>📞 Gọi Kỹ Sư Trưởng: 0941 204 125</span>
          </a>
          <button class="btn btn-outline modal-btn-consult" data-title="${item.title}" style="flex: 1; min-width: 200px;">
            <span>📋 Đặt Lịch Khảo Sát & Nhận Bản Vẽ</span>
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');

    const btnConsult = modalBody.querySelector('.modal-btn-consult');
    if (btnConsult) {
      btnConsult.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        scrollToConsultForm(item.title);
      });
    }
  }

  // Đóng modal
  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // ---------------- CUỘN TỚI FORM TƯ VẤN DỰ ÁN ----------------
  function scrollToConsultForm(solutionTitle = '') {
    const formSection = document.getElementById('consult-form');
    if (selectedSolutionInput && solutionTitle) {
      selectedSolutionInput.value = solutionTitle;
    }
    const noteArea = document.getElementById('projectNote');
    if (noteArea && solutionTitle) {
      noteArea.value = `Yêu cầu khảo sát & tư vấn thiết kế giải pháp: ${solutionTitle}`;
    }
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ---------------- XỬ LÝ TABS BỘ LỌC ----------------
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBrand = btn.getAttribute('data-brand');
      renderSolutions(currentBrand, currentSearch);
    });
  });

  // Nút Lọc Giải Pháp Đô Thị Từ Banner Spotlight
  const btnFilterCity = document.getElementById('btnFilterCitySolutions');
  if (btnFilterCity) {
    btnFilterCity.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-brand') === 'dahua-city'));
      currentBrand = 'dahua-city';
      renderSolutions('dahua-city', currentSearch);
      const target = document.getElementById('solutionsGrid') || document.querySelector('.solutions-toolbar');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ---------------- XỬ LÝ Ô TÌM KIẾM NHANH ----------------
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderSolutions(currentBrand, currentSearch);
    });
  }

  // ---------------- XỬ LÝ SUBMIT FORM TƯ VẤN ----------------
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Quý khách';
      const phone = document.getElementById('clientPhone')?.value || '';
      const sol = selectedSolutionInput?.value || 'Giải pháp chuyên dụng';

      alert(`Cảm ơn ${name} (${phone})!\nChu Gia Technology đã tiếp nhận yêu cầu tư vấn giải pháp: "${sol}".\nKỹ sư trưởng dự án sẽ liên hệ lại trong vòng 30 phút để khảo sát và lên phương án!`);
      consultForm.reset();
    });
  }

  // Khởi chạy render lần đầu
  renderSolutions('all', '');
});
