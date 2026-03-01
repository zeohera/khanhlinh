const features = [
  {
    icon: '🛡️',
    title: 'Chống Sốc, Chống Vỡ',
    desc: 'Vỏ nhựa PP/PC/ABS được gia cố nhiều lớp, chịu lực va đập mạnh, bảo vệ đồ vật bên trong tuyệt đối.',
  },
  {
    icon: '🔐',
    title: 'Khóa TSA Chuẩn Quốc Tế',
    desc: 'Khóa số TSA được công nhận tại hơn 40 quốc gia, đảm bảo an toàn cho hành lý của bạn khi đi máy bay.',
  },
  {
    icon: '⚙️',
    title: 'Bánh Xe 360° Êm Ái',
    desc: 'Bánh xe kép bọc cao su chịu tải, xoay 360° linh hoạt trên mọi địa hình, di chuyển không gây tiếng ồn.',
  },
  {
    icon: '🎨',
    title: 'Đa Dạng Màu Sắc',
    desc: 'Hơn 16 màu sắc thời trang để lựa chọn – từ tông pastel nhẹ nhàng đến màu nổi bật cá tính.',
  },
  {
    icon: '💼',
    title: 'Nội Thất Thông Minh',
    desc: 'Dung tích rộng rãi với hệ thống chia ngăn thông minh, móc treo đồ tiện lợi, khay để cốc tích hợp.',
  },
  {
    icon: '✅',
    title: 'Bảo Hành Chính Hãng',
    desc: 'Sản phẩm NPP chính thức, bảo hành đầy đủ theo chính sách nhà sản xuất Hùng Phát, hỗ trợ sau bán hàng.',
  },
]

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features-header">
          <div className="section-badge">💎 Tại sao chọn chúng tôi</div>
          <h2 className="section-title">
            Chất Lượng Vượt Trội –{' '}
            <span className="highlight">Tin Dùng Hàng Triệu Khách</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Vali Hùng Phát được sản xuất tại nhà máy đạt chuẩn BSCI, xuất khẩu sang Mỹ, Anh, Nhật Bản –
            cam kết chất lượng quốc tế với giá Việt Nam.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
