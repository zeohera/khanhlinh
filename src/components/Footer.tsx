const footerLinks = {
  'Sản Phẩm': [
    { label: '🧳 Vali Hùng Phát', href: '#products' },
    { label: '🧸 Gấu Bông', href: '#gau-bong' },
    { label: '🪖 Mũ Bảo Hiểm', href: '#mu-bao-hiem' },
    { label: '🎒 Cặp Sách & Balo', href: '#cap-sach-balo' },
    { label: '👜 Túi & Ví Da', href: '#tui-vi-da' },
    { label: '🎮 Đồ Chơi & VPP', href: '#do-choi' },
  ],
  'Liên Hệ': [
    { label: '📞 0965 699 399', href: 'tel:0965699399' },
    { label: '📞 0949 231 826', href: 'tel:0949231826' },
    { label: '📘 Facebook', href: 'https://web.facebook.com/khanhlinh1062' },
    { label: '📍 Xem Bản Đồ', href: 'https://maps.app.goo.gl/TpEuzCXo31nRFwnB8' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <div className="footer-logo">
              <img src="/mascot.jpg" alt="Khánh Linh mascot" className="footer-logo-avatar" />
              <span className="footer-logo-text">KHÁNH LINH</span>
            </div>
            <p className="footer-tagline">
              Nhà phân phối chính thức Vali Hùng Phát tại Vĩnh Phúc.
              Tổng kho sỉ hot trend: Gấu Bông · Mũ Bảo Hiểm · Túi Ví Da · Đồ Chơi · Văn Phòng Phẩm.
              Tuyển CTV toàn quốc – Giá tận gốc! 🌸
            </p>
            <a href="tel:0965699399" className="footer-phone">
              📞 0965 699 399
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <div className="footer-col-title">{group}</div>
              <ul className="footer-links">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} NPP Khánh Linh – Phố Tân Phát, Thổ Tang, Vĩnh Phúc 🌸
          </p>
          <div className="footer-socials">
            <a href="https://web.facebook.com/khanhlinh1062" target="_blank" rel="noreferrer" className="footer-social-icon" title="Facebook">f</a>
            <a href="https://maps.app.goo.gl/TpEuzCXo31nRFwnB8" target="_blank" rel="noreferrer" className="footer-social-icon" title="Google Maps">📍</a>
            <a href="tel:0965699399" className="footer-social-icon" title="Gọi ngay">📞</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
