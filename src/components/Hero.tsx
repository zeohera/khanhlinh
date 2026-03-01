const categories = [
  'Gấu Bông 🧸', 'Mũ Bảo Hiểm 🪖', 'Nón Mũ 🎩', 'Vali Hùng Phát 🧳',
  'Túi Ví Da 👜', 'Cặp Sách & Balo 🎒', 'Đồ Chơi Thông Minh 🎮', 'Văn Phòng Phẩm 📎',
]

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Decorative blobs */}
      <div className="hero-bg-blobs">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
      </div>

      {/* Floating emojis */}
      <div className="hero-floaties">
        {['🧸','🧳','🌸','💕','🎀','🌷','✨','💝'].map((e, i) => (
          <span key={i} className="hero-floaty" style={{
            top: `${10 + (i * 11) % 80}%`,
            left: `${(i * 13) % 90}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}>{e}</span>
        ))}
      </div>

      <div className="container">
        <div className="hero-inner">
          {/* Left Content */}
          <div>
            <div className="hero-badge">✨ Tổng Kho Sỉ Hot Trend · Giá Tận Gốc</div>

            <h1 className="hero-title">
              Khánh Linh –<br />
              <span style={{ fontStyle: 'italic' }}>Nhà Phân Phối</span><br />
              Giá Tốt Nhất! 🌸
            </h1>

            <p className="hero-sub">
              NPP chính thức <strong>Vali Hùng Phát</strong> · Gấu Bông · Mũ Bảo Hiểm và nhiều sản phẩm
              hot trend khác tại Vĩnh Phúc. Giá tận gốc – Tuyển CTV toàn quốc!
            </p>

            {/* Category tags */}
            <div className="hero-categories">
              {categories.map(c => (
                <span key={c} className="hero-cat-tag">{c}</span>
              ))}
            </div>

            <div className="hero-actions">
              <a href="#products" className="btn btn-white">🧳 Xem Vali</a>
              <a href="#gau-bong" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                🧸 Gấu Bông
              </a>
              <a href="tel:0965699399" className="btn btn-white" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                📞 Liên Hệ
              </a>
            </div>
          </div>

          {/* Right: Mascot */}
          <div className="hero-visual">
            <div className="hero-mascot-wrap">
              <div className="hero-mascot-ring" />
              <div className="hero-mascot-ring-2" />
              <img src="/mascot.jpg" alt="Mascot Khánh Linh - Thỏ cute kéo vali" className="hero-mascot-img" />

              <div className="hero-badge-float top-right">
                <span className="float-icon">🎀</span>
                <div>
                  <span className="float-label">Giá Sỉ</span>
                  <span className="float-sub">Tận Gốc</span>
                </div>
              </div>

              <div className="hero-badge-float bottom-left">
                <span className="float-icon">🏷️</span>
                <div>
                  <span className="float-label">CTV Toàn Quốc</span>
                  <span className="float-sub">Cộng tác viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
