interface CatItem {
  img?: string
  name: string
  desc?: string
}

interface CategorySectionProps {
  id: string
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  items: CatItem[]
  bg?: 'white' | 'cream'
}

const CONTACT_PHONE = '0965 699 399'
const CONTACT_PHONE2 = '0949 231 826'
const CONTACT_ADDRESS = 'Phố Tân Phát, Thổ Tang, Vĩnh Phúc'

export default function CategorySection({
  id, badge, title, titleHighlight, subtitle, items, bg = 'cream',
}: CategorySectionProps) {
  return (
    <section
      className="cat-section"
      id={id}
      style={{ background: bg === 'white' ? 'var(--white)' : 'var(--cream)' }}
    >
      <div className="container">
        <div className="cat-header">
          <div className="section-badge">{badge}</div>
          <h2 className="section-title">
            {title} <span className="highlight">{titleHighlight}</span>
          </h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <div className="cat-grid">
          {items.map((item, i) => (
            item.img ? (
              /* Real product card */
              <div className="cat-real-card" key={i}>
                <div className="cat-real-img">
                  <img src={item.img} alt={item.name} loading="lazy" />
                </div>
                <div className="cat-real-info">
                  <div className="cat-real-name">{item.name}</div>
                  {item.desc && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Placeholder card with contact info */
              <div className="cat-placeholder-card" key={i}>
                <div className="cat-placeholder-img">
                  <div className="placeholder-icon">📸</div>
                  <div className="placeholder-label">
                    {item.name}<br />
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.68rem' }}>
                      Ảnh sắp cập nhật
                    </span>
                  </div>
                </div>
                <div className="cat-placeholder-info">
                  <div className="placeholder-contact-title">📞 Đặt hàng ngay!</div>
                  <div className="placeholder-contact-items">
                    <div className="placeholder-contact-item">
                      📱 {CONTACT_PHONE}
                    </div>
                    <div className="placeholder-contact-item">
                      📱 {CONTACT_PHONE2}
                    </div>
                    <div className="placeholder-contact-item" style={{ fontSize: '0.65rem' }}>
                      📍 {CONTACT_ADDRESS}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  )
}
