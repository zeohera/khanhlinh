import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { API_BASE_URL } from '../config/api';

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const resData = await response.json();
        setProduct(resData.data);
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollLeft = galleryRef.current.scrollLeft;
      const width = galleryRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIdx(index);
    }
  };

  const scrollToImage = (index: number) => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({
        left: index * galleryRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveIdx(index);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải sản phẩm...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Không tìm thấy sản phẩm này.</div>;

  const imageUrls = product.imageUrls || [];

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '90vh', padding: 'calc(var(--nav-height) + 60px) 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60 }}>
          {/* Left Column: Images */}
          <div>
            <div style={{ 
              background: '#fff', 
              borderRadius: 32, 
              overflow: 'hidden', 
              aspectRatio: '1/1', 
              marginBottom: 20,
              boxShadow: '0 20px 40px -10px rgba(232, 101, 138, 0.2)',
              border: '1px solid rgba(232, 101, 138, 0.1)',
              position: 'relative'
            }}>
              {imageUrls.length > 0 ? (
                <>
                  <div className="swipe-gallery" ref={galleryRef} onScroll={handleScroll}>
                    {imageUrls.map((url: string, index: number) => (
                      <div key={index} className="swipe-item">
                        <img 
                          src={url} 
                          alt={product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    ))}
                  </div>
                  {imageUrls.length > 1 && (
                    <div className="swipe-dots">
                      {imageUrls.map((_: any, idx: number) => (
                        <div key={idx} className={`swipe-dot ${idx === activeIdx ? 'active' : ''}`} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#fdf2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 40 }}>🧸</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
                {imageUrls.map((url: string, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => scrollToImage(index)}
                    style={{ 
                      width: 70, height: 70, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      border: activeIdx === index ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                      boxShadow: activeIdx === index ? '0 4px 12px rgba(232, 101, 138, 0.25)' : 'none',
                      transition: 'all 0.3s var(--ease)',
                      opacity: activeIdx === index ? 1 : 0.6
                    }}
                  >
                    <img src={url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div style={{ padding: '0' }}>
            <div style={{ marginBottom: 32 }}>
               <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                 NPP KHÁNH LINH • Đầu Trăm & Đầu Chục
               </div>
               <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--dark)', marginBottom: 16, lineHeight: 1.2 }}>
                 {product.name}
               </h1>
               
               <div style={{ 
                 background: 'linear-gradient(135deg, #fff 0%, #fff0f5 100%)', 
                 padding: 24, 
                 borderRadius: 20, 
                 marginBottom: 24,
                 border: '1px solid var(--pink-200)',
                 boxShadow: '0 8px 24px rgba(232, 101, 138, 0.05)'
               }}>
                 <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 0, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Báo giá hệ thống:</h3>
                 {Object.keys(product.prices || {}).length === 0 ? (
                   <p style={{ margin: 0, color: '#9e7b87', fontStyle: 'italic', fontSize: 14 }}>Đang cập nhật báo giá chính thức...</p>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                     {Object.entries(product.prices || {}).map(([tier, price]) => (
                       <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #f9d0de', paddingBottom: 10 }}>
                         <span style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 700 }}>{tier}</span>
                         <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>
                           {new Intl.NumberFormat('vi-VN').format(price as number)} <small style={{ fontSize: 14 }}>đ</small>
                         </span>
                       </div>
                     ))}
                   </div>
                 )}
               </div>

               <div style={{ marginBottom: 32 }}>
                 <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', marginBottom: 10, borderLeft: '3px solid var(--primary)', paddingLeft: 10 }}>Mô tả chi tiết</h3>
                 <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                   {product.description || 'Sản phẩm đang được cập nhật thông tin mô tả chi tiết từ nhà phân phối Khánh Linh.'}
                 </p>
               </div>
            </div>

            <div style={{ 
              background: 'var(--dark)', 
              padding: 24, 
              borderRadius: 20, 
              color: 'white',
              boxShadow: '0 12px 30px rgba(61, 26, 38, 0.25)'
            }}>
               <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Liên hệ đặt hàng & Tư vấn mở đại lý:</h3>
               <a href="tel:0965699399" className="btn btn-primary" style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '16px 0', fontSize: 17, borderRadius: 12, background: 'var(--primary)', border: 'none' }}>
                  📞 Gọi Hotline: 0965 699 399
               </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetail;
