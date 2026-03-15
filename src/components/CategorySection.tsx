import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  ID: number;
  name: string;
  description: string;
  prices: { [key: string]: number };
  imageUrls: string[] | null;
  isHidden: boolean;
}

interface CategorySectionProps {
  id: number;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  products: Product[];
  bg?: 'white' | 'cream';
}

export default function CategorySection({
  id, badge, title, titleHighlight, subtitle, products, bg = 'cream',
}: CategorySectionProps) {
  const [activeIndices, setActiveIndices] = useState<Record<number, number>>({});

  const handleScroll = (prodIdx: number, e: any) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    if (activeIndices[prodIdx] !== index) {
      setActiveIndices(prev => ({ ...prev, [prodIdx]: index }));
    }
  };

  // Lọc sản phẩm không bị ẩn
  const displayProducts = products.filter(p => !p.isHidden);

  return (
    <section
      className="cat-section"
      id={`cat-${id}`}
      style={{ 
        background: bg === 'white' ? 'var(--white)' : 'var(--cream)',
        scrollMarginTop: 'var(--nav-height)' 
      }}
    >
      <div className="container" style={{ margin: '0 auto', maxWidth: 1200, padding: '80px 24px' }}>
        <div className="cat-header" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-badge" style={{ display: 'inline-flex', background: 'rgba(232, 101, 138, 0.1)', color: 'var(--primary)', padding: '6px 18px', borderRadius: 99, fontSize: 13, fontWeight: 700, marginBottom: 12, border: '1.5px solid var(--pink-200)' }}>{badge}</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--dark)' }}>
            {title} {titleHighlight && <span className="highlight" style={{ color: 'var(--primary)' }}>{titleHighlight}</span>}
          </h2>
          <p className="section-subtitle" style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 640, margin: '14px auto 0', lineHeight: 1.6 }}>{subtitle}</p>
          <div style={{ marginTop: 20 }}>
            <Link to={`/category/${id}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid rgba(232, 101, 138, 0.3)', paddingBottom: 2, fontSize: 14 }}>
              Khám phá danh mục sỉ &rarr;
            </Link>
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0', fontSize: 15 }}>Chưa có sản phẩm nào trong cửa hàng.</div>
        ) : (
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
            {displayProducts.map((product, prodIdx) => (
              <div 
                key={product.ID} 
                className="product-card" 
                style={{ 
                  background: '#fff', 
                  borderRadius: 24, 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 25px -5px rgba(232, 101, 138, 0.15)', 
                  border: '1.5px solid rgba(232, 101, 138, 0.08)', 
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ aspectRatio: '1/1', background: '#fdf2f5', position: 'relative', overflow: 'hidden' }}>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <>
                      <div 
                        className="swipe-gallery" 
                        onScroll={(e) => handleScroll(prodIdx, e)}
                      >
                        {product.imageUrls.map((url: string, index: number) => (
                          <div key={index} className="swipe-item">
                            <img 
                              src={url} 
                              alt={`${product.name} ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                      {product.imageUrls.length > 1 && (
                        <div className="swipe-dots">
                          {product.imageUrls.map((_: any, idx: number) => (
                            <div 
                              key={idx} 
                              className={`swipe-dot ${idx === (activeIndices[prodIdx] || 0) ? 'active' : ''}`} 
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f08aaa' }}>
                      <span style={{ fontSize: '2rem' }}>🧸</span>
                    </div>
                  )}
                  {/* Badge nhỏ cho loại hàng */}
                   <div style={{ position: 'absolute', top: 16, left: 16 }}>
                      <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>NEW</span>
                   </div>
                </div>
                
                <div style={{ padding: 24, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: '#3d1a26', margin: '0 0 10px 0', lineHeight: 1.3 }}>{product.name}</h3>
                  <p style={{ fontSize: 14, color: '#9e7b87', margin: '0 0 20px 0', minHeight: 42, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                  
                  <div style={{ background: '#fff9fa', padding: '16px', borderRadius: 16, marginBottom: 20, border: '1px dashed #f9d0de', marginTop: 'auto' }}>
                      {Object.entries(product.prices || {}).map(([tier, price], idx) => (
                        <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: idx === Object.entries(product.prices || {}).length - 1 ? 0 : 8 }}>
                          <span style={{ fontSize: 13, color: '#6b3a4a', fontWeight: 600 }}>{tier}</span>
                          <span style={{ fontSize: 18, fontWeight: 800, color: '#e8658a' }}>
                            {new Intl.NumberFormat('vi-VN').format(price as number)} <small style={{ fontSize: 12, fontWeight: 600 }}>đ</small>
                          </span>
                        </div>
                      ))}
                      {Object.keys(product.prices || {}).length === 0 && <div style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>Liên hệ báo giá</div>}
                  </div>

                  <Link 
                    to={`/product/${product.ID}`} 
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: '0.92rem', borderRadius: 16 }}
                  >
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
