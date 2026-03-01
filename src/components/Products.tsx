import { useState } from 'react'

interface Product {
  id: number
  img: string
  name: string
  code: string
  material: 'PP' | 'PC' | 'ABS'
  sizes: string[]
  features: string[]
  tag?: string
}

const products: Product[] = [
  {
    id: 1,
    img: '/products/608267710_1877738613129439_5032609240618239074_n.jpg',
    name: 'Travelking 8801',
    code: 'Mã 8801',
    material: 'PP',
    sizes: ['21"', '25"', '29"'],
    features: ['Nhựa PP 100% bền bỉ, chống vỡ nứt', 'Khóa số TSA chuẩn quốc tế', 'Bánh xe kép 360° bọc cao su non', 'Tay kéo hợp kim nhôm chống gỉ'],
    tag: 'Bán chạy',
  },
  {
    id: 2,
    img: '/products/608673895_1877738469796120_278734754941285857_n.jpg',
    name: 'Vali Hùng Phát 668',
    code: 'Mã 668',
    material: 'PP',
    sizes: ['20"', '24"', '28"'],
    features: ['Nhựa PP đàn hồi cao, chống bể vỡ', 'Khóa số âm hiện đại, bảo mật cao', 'Quai xách chắc chắn, chịu lực tốt', 'Nội thất rộng, chia ngăn thông minh'],
  },
  {
    id: 3,
    img: '/products/608888147_1877738546462779_4772499597664113854_n.jpg',
    name: 'Vali Hùng Phát 6009',
    code: 'Mã 6009',
    material: 'PC',
    sizes: ['20"', '24"'],
    features: ['Nhựa PC 100% chống trầy chống bể', 'Ốp góc kim loại chịu lực', 'Khóa số cao cấp an toàn', 'Tích hợp giá đỡ điện thoại'],
    tag: 'Cao cấp',
  },
  {
    id: 4,
    img: '/products/608899689_1877738503129450_4370017666272296804_n.jpg',
    name: 'Vali Hùng Phát 218',
    code: 'Mã 218',
    material: 'ABS',
    sizes: ['20"', '24"', '28"'],
    features: ['Chất liệu Nhựa ABS chắc chắn', 'Tay kéo chắc chắn, bền bỉ', 'Bánh xe 360 độ linh hoạt', 'Khóa 3 số bảo mật – 16+ màu'],
  },
  {
    id: 5,
    img: '/products/608912303_1877738596462774_6453700119686628234_n (1).jpg',
    name: 'Vali Hùng Phát 221',
    code: 'Mã 221',
    material: 'ABS',
    sizes: ['20"', '24"', '28"'],
    features: ['ABS vân sần chịu lực, chống va đập', 'Khóa 3 số bảo mật', 'Khóa số mở rộng tiện lợi', 'Móc khóa treo thông minh'],
  },
  {
    id: 6,
    img: '/products/608916359_1877738533129447_4705196868849491565_n.jpg',
    name: 'Vali Hùng Phát 222',
    code: 'Mã 222',
    material: 'ABS',
    sizes: ['16"', '20"', '24"'],
    features: ['Nhựa ABS siêu nhẹ, chịu lực tốt', 'Khoá số bảo mật 3 số', 'Bánh xe đôi xoay 360 độ', 'Tích hợp 2 tay xách chắc chắn'],
  },
  {
    id: 7,
    img: '/products/609100942_1877738566462777_1305699388984424382_n.jpg',
    name: 'Vali Hùng Phát 8803',
    code: 'Mã 8803',
    material: 'PP',
    sizes: ['20"', '24"', '28"'],
    features: ['Vỏ nhựa PP cao cấp siêu bền', 'Thiết kế rãnh ngang tinh tế', 'Khóa TSA quốc tế', 'Bánh xe kép chạy êm ái'],
    tag: 'Mới',
  },
  {
    id: 8,
    img: '/products/609176167_1877738463129454_2131267310450226004_n.jpg',
    name: 'Vali Hùng Phát HP025',
    code: 'Mã HP025',
    material: 'ABS',
    sizes: ['20"', '24"'],
    features: ['Chất liệu ABS cao cấp', 'Thiết kế đa ngăn tiện lợi', 'Khóa bảo mật 3 số', 'Tay kéo đa tầng linh hoạt'],
  },
  {
    id: 9,
    img: '/products/611527692_1877738499796117_4753254847290957261_n.jpg',
    name: 'Vali Hùng Phát 8811',
    code: 'Mã 8811',
    material: 'PP',
    sizes: ['20"', '24"', '28"'],
    features: ['Nhựa PP cứng cáp, siêu bền', 'Khóa TSA chống trộm', 'Bánh xe cao su chạy êm', 'Tay kéo nhôm nguyên khối'],
  },
  {
    id: 10,
    img: '/products/611581319_1877738573129443_8009295668061846834_n.jpg',
    name: 'Vali Hùng Phát Classic',
    code: 'Mã Classic',
    material: 'ABS',
    sizes: ['20"', '24"', '28"'],
    features: ['Thiết kế cổ điển sang trọng', 'ABS vân kẻ sọc tinh tế', 'Khóa 3 số an toàn', 'Đa dạng màu sắc thời trang'],
  },
  {
    id: 11,
    img: '/products/611633255_1877738386462795_2375200141401658813_n.jpg',
    name: 'Vali Hùng Phát 221 Pro',
    code: 'Mã 221 Pro',
    material: 'ABS',
    sizes: ['20"', '24"', '28"'],
    features: ['ABS vân sần chịu lực cao', '8 màu sắc nổi bật', 'Khóa số bảo mật', 'Móc treo đa năng tiện lợi'],
  },
  {
    id: 12,
    img: '/products/611938041_1877738389796128_3016860403022395287_n.jpg',
    name: 'Vali Hùng Phát 222 Pro',
    code: 'Mã 222 Pro',
    material: 'ABS',
    sizes: ['16"', '20"', '24"'],
    features: ['ABS siêu nhẹ 10 màu sắc', 'Tích hợp 2 tay xách', 'Khay đựng nước tiện dụng', 'Móc treo bên hông tiện lợi'],
  },
  {
    id: 13,
    img: '/products/611956788_1877738589796108_1126216221803454225_n (1).jpg',
    name: 'Vali Hùng Phát 6009 Pro',
    code: 'Mã 6009 Pro',
    material: 'PC',
    sizes: ['20"', '24"'],
    features: ['Nhựa PC 100% siêu bền', 'Ốp góc kim loại cao cấp', 'Tích hợp giá đỡ điện thoại', 'Khóa số cao cấp bảo mật'],
    tag: 'Cao cấp',
  },
]

const FILTERS = ['Tất cả', 'PP', 'PC', 'ABS'] as const
type Filter = (typeof FILTERS)[number]

const materialColor: Record<string, string> = {
  PP: '#E8658A',
  PC: '#9b59b6',
  ABS: '#27ae60',
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Tất cả')
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const filtered = products.filter(
    (p) => activeFilter === 'Tất cả' || p.material === activeFilter
  )

  return (
    <section className="products" id="products">
      <div className="container">
        <div className="products-header">
          <div className="section-badge">🧳 Vali Hùng Phát Chính Hãng</div>
          <h2 className="section-title">
            Vali Chất Lượng –{' '}
            <span className="highlight">13 Mẫu Mã</span>
          </h2>
          <p className="section-subtitle">
            Từ nhựa PP siêu bền đến PC cao cấp và ABS thời trang, Khánh Linh mang đến
            lựa chọn hoàn hảo cho mọi chuyến hành trình của bạn.
          </p>
        </div>

        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'Tất cả' ? '🧳 Tất cả' : `✦ Nhựa ${f}`}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filtered.map((p) => (
            <div className="product-card" key={p.id} onClick={() => setLightboxSrc(p.img)}>
              <div className="product-img-wrap">
                <img src={p.img} alt={p.name} loading="lazy" />
                {p.tag && <div className="product-badge">{p.tag}</div>}
                <div className="product-overlay">
                  <div className="overlay-btn">🔍 Xem chi tiết</div>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-material" style={{
                  background: `${materialColor[p.material]}18`,
                  color: materialColor[p.material],
                }}>
                  Nhựa {p.material}
                </div>
                <ul className="product-features">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="product-sizes">
                  {p.sizes.map((s) => <span className="size-tag" key={s}>{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxSrc && (
        <div className="lightbox" onClick={() => setLightboxSrc(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxSrc} alt="Xem ảnh sản phẩm" />
            <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          </div>
        </div>
      )}
    </section>
  )
}
