interface AboutProps {
  data?: {
    badge?: string;
    title?: string;
    titleHighlight?: string;
    description?: string;
    highlights?: Array<{ text: string }>;
    stats?: Array<{ value: string; label: string }>;
  };
}

export default function About({ data }: AboutProps) {
  const displayHighlights = data?.highlights || [
    {
      text: 'Thương hiệu Hùng Phát thành lập năm 2006, xuất phát từ làng nghề truyền thống Kiêu Kỵ, Gia Lâm, Hà Nội.',
    },
    {
      text: 'Nhà máy rộng 33.000m² với 12 dây chuyền sản xuất hiện đại, tự chủ 95% linh kiện từ bánh xe, tay kéo đến vỏ nhựa.',
    },
    {
      text: 'Đạt chứng nhận BSCI, tiêu chuẩn xuất khẩu sang Mỹ, Anh, Nhật Bản và hơn 10 quốc gia khác.',
    },
    {
      text: 'Hơn 2.000 điểm bán trên toàn quốc và hệ thống NPP phủ rộng 63 tỉnh thành.',
    },
  ];

  const displayStats = data?.stats || [
    { value: '20+', label: 'Năm Kinh Nghiệm' },
    { value: '33K m²', label: 'Diện Tích Nhà Máy' },
    { value: '10+', label: 'Quốc Gia XK' },
    { value: '2000+', label: 'Điểm Bán' },
  ];

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-inner">
          {/* Left: Text Content */}
          <div>
            <div className="about-badge">{data?.badge || 'ℹ️ Về chúng tôi'}</div>
            <h2 className="about-title">
              {data?.title || 'NPP Khánh Linh –'}{' '}
              <span style={{ color: '#F5A623' }}>{data?.titleHighlight || 'Đối Tác Tin Cậy'}</span>{' '}
              Của Bạn
            </h2>
            <p className="about-desc">
              {data?.description || (
                <>
                  Là nhà phân phối chính thức của <strong style={{ color: 'white' }}>Vali Hùng Phát</strong> tại
                  khu vực Vĩnh Phúc, Khánh Linh cam kết mang đến sản phẩm chính hãng, chất lượng
                  cao với giá cạnh tranh nhất. Chúng tôi trực tiếp nhập hàng từ nhà máy,
                  đảm bảo nguồn gốc rõ ràng và bảo hành đầy đủ theo chính sách hãng.
                </>
              )}
            </p>

            <div className="about-highlights">
              {displayHighlights.map((h) => (
                <div className="about-highlight" key={h.text}>
                  <div className="highlight-dot" />
                  <p className="highlight-text">{h.text}</p>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn-accent">
              📍 Tìm Đến Chúng Tôi
            </a>
          </div>

          {/* Right: Stats */}
          <div>
            <div className="about-stats">
              {displayStats.map((s) => (
                <div className="about-stat-card" key={s.label}>
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <span style={{ fontSize: '2rem' }}>🏅</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                    Chứng nhận BSCI & Cúp Vàng Sản Phẩm
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>
                    Tiêu chuẩn tuân thủ xã hội doanh nghiệp quốc tế
                  </div>
                </div>
              </div>
              <div style={{
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <span style={{ fontSize: '2rem' }}>🌍</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                    Xuất khẩu USA · UK · Japan · EU
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>
                    Đạt chuẩn những thị trường khó tính nhất thế giới
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
