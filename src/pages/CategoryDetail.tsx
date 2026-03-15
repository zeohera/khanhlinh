import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { API_ENDPOINTS } from '../config/api';

function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`);
        const resData = await response.json();
        setCategory(resData.data);
      } catch (error) {
        console.error('Failed to load category', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải danh mục...</div>;
  if (!category) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Không tìm thấy danh mục này.</div>;

  const displayProducts = (category.products || []).filter((p: any) => !p.isHidden);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', padding: 'calc(var(--nav-height) + 60px) 16px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: '#ffe4e6', color: '#e11d48', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {category.badge || 'Nổi bật'}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: '#3d1a26', marginBottom: 16 }}>
            {category.title} {category.titleHighlight && <span style={{ color: 'var(--primary)' }}>{category.titleHighlight}</span>}
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            {category.description}
          </p>
        </div>

        {displayProducts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>Chưa có sản phẩm nào trong danh mục này.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {displayProducts.map((product: any) => (
              <div key={product.ID} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', transition: 'transform 0.3s' }}>
                <div style={{ aspectRatio: '1/1', background: '#f9fafb', position: 'relative' }}>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Image</div>
                  )}
                  {/* Tag giá sỉ/lẻ */}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                     {Object.keys(product.prices || {}).map(tier => (
                        <span key={tier} style={{ background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', color: '#e11d48', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          {tier}
                        </span>
                     ))}
                  </div>
                </div>
                
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>{product.name}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px 0', minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                  
                  <div style={{ marginBottom: 16 }}>
                      {Object.entries(product.prices || {}).map(([tier, price]) => (
                        <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 14, color: '#4b5563' }}>Giá {tier}:</span>
                          <span style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price as number)}
                          </span>
                        </div>
                      ))}
                  </div>

                  <Link to={`/product/${product.ID}`} style={{ display: 'block', width: '100%', textAlign: 'center', background: '#e11d48', color: '#fff', padding: '10px 0', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default CategoryDetail;
