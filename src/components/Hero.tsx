interface HeroProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    tags?: string[];
    actions?: Array<{ label: string; href: string; type: 'primary' | 'outline' | 'glass' }>;
  };
  categories: string[];
}

export default function Hero({ data, categories: allCategories }: HeroProps) {
  const displayCategories = (data?.tags && data.tags.length > 0) ? data.tags : allCategories;
  const actions = data?.actions || [
    { label: '🧳 Xem Vali', href: '#products', type: 'primary' },
    { label: '🧸 Gấu Bông', href: '#gau-bong', type: 'outline' },
    { label: '📞 Liên Hệ', href: 'tel:0965699399', type: 'glass' },
  ];

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
            <div className="hero-badge">{data?.badge || '✨ Tổng Kho Sỉ Hot Trend · Giá Tận Gốc'}</div>

            <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
              {data?.title || (
                <>
                  Khánh Linh –<br />
                  <span style={{ fontStyle: 'italic' }}>Nhà Phân Phối</span><br />
                  Giá Tốt Nhất! 🌸
                </>
              )}
            </h1>

            <p className="hero-sub">
              {data?.subtitle || (
                <>
                  NPP chính thức <strong>Vali Hùng Phát</strong> · Gấu Bông · Mũ Bảo Hiểm và nhiều sản phẩm
                  hot trend khác tại Vĩnh Phúc. Giá tận gốc – Tuyển CTV toàn quốc!
                </>
              )}
            </p>

            {/* Category tags */}
            <div className="hero-categories">
              {displayCategories.map(c => (
                <span key={c} className="hero-cat-tag">{c}</span>
              ))}
            </div>

            <div className="hero-actions">
              {actions.map((btn, idx) => (
                <a 
                  key={idx} 
                  href={btn.href} 
                  className={`btn ${btn.type === 'primary' ? 'btn-white' : btn.type === 'outline' ? 'btn-outline' : 'btn-white'}`}
                  style={btn.type === 'outline' ? { color: 'white', borderColor: 'rgba(255,255,255,0.5)' } : btn.type === 'glass' ? { background: 'rgba(255,255,255,0.15)', color: 'white' } : {}}
                >
                  {btn.label}
                </a>
              ))}
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
