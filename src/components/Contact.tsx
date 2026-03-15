interface ContactProps {
  data?: {
    badge?: string;
    title?: string;
    highlight?: string;
    subtitle?: string;
    phone?: string;
    phoneHref?: string;
    address?: string;
    mapHref?: string;
    hours?: string;
    facebookUrl?: string;
    mapEmbedSrc?: string;
  };
}

export default function Contact({ data }: ContactProps) {
  const contactItems = [
    {
      icon: '📞',
      label: 'Điện thoại / Zalo',
      value: data?.phone || '0965 699 399 · 0949 231 826',
      href: data?.phoneHref || 'tel:0965699399',
    },
    {
      icon: '📍',
      label: 'Địa chỉ cửa hàng',
      value: data?.address || 'Đường đôi, phố Tân Phát, xã Thổ Tang, Vĩnh Phúc',
      href: data?.mapHref || 'https://maps.app.goo.gl/TpEuzCXo31nRFwnB8',
    },
    {
      icon: '🕐',
      label: 'Giờ mở cửa',
      value: data?.hours || 'Thứ 2 – Chủ Nhật: 7:00 – 20:00',
      href: undefined,
    },
  ];

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-header">
          <div className="section-badge">{data?.badge || '📍 Liên hệ & Tìm đến'}</div>
          <h2 className="section-title">
            {data?.title || 'Đến Ghé Thăm'}{' '}
            <span className="highlight">{data?.highlight || 'Cửa Hàng Khánh Linh'}</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            {data?.subtitle || 'Trực tiếp trải nghiệm sản phẩm tại cửa hàng hoặc liên hệ qua điện thoại/Zalo để được tư vấn và đặt hàng giao tận nơi.'}
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h3 className="contact-info-title">Thông Tin Liên Hệ</h3>
            <p className="contact-info-sub">
              Chúng tôi luôn sẵn sàng tư vấn để bạn chọn được chiếc vali phù hợp nhất.
            </p>

            <div className="contact-items">
              {contactItems.map((item) =>
                item.href ? (
                  <a href={item.href} className="contact-item" key={item.label} target="_blank" rel="noreferrer">
                    <div className="contact-item-icon">{item.icon}</div>
                    <div className="contact-item-content">
                      <div className="contact-item-label">{item.label}</div>
                      <div className="contact-item-value">{item.value}</div>
                    </div>
                  </a>
                ) : (
                  <div className="contact-item" key={item.label} style={{ cursor: 'default' }}>
                    <div className="contact-item-icon">{item.icon}</div>
                    <div className="contact-item-content">
                      <div className="contact-item-label">{item.label}</div>
                      <div className="contact-item-value">{item.value}</div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="contact-social">
              <a
                href={data?.facebookUrl || "https://web.facebook.com/khanhlinh1062"}
                target="_blank"
                rel="noreferrer"
                className="social-btn facebook"
              >
                📘 Facebook Khánh Linh
              </a>
              <a href={data?.phoneHref || "tel:0965699399"} className="social-btn zalo">
                💬 Zalo Ngay
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="map-container">
            <iframe
              title="Bản đồ NPP Khánh Linh"
              src={data?.mapEmbedSrc || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.9429532287877!2d105.486983!3d21.2737256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134f30001d39839%3A0x8ed361a0eed26fa1!2zTlBQIGJhbG8sIHTDumkgeMOhY2gsIHZhbGksIHZwcCBLaMOhbmggTGluaA!5e0!3m2!1sen!2s!4v1772370285759!5m2!1sen!2s"}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
