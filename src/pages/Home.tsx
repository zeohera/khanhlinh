import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import CategorySection from '../components/CategorySection';
import Features from '../components/Features';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

import { API_ENDPOINTS } from '../config/api';

interface Category {
  ID: number;
  name: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  isHidden: boolean;
  products: any[];
}

interface SiteContent {
  section: string;
  data: string;
}

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, contentRes] = await Promise.all([
          fetch(API_ENDPOINTS.CATEGORIES),
          fetch(API_ENDPOINTS.SITE_CONTENT)
        ]);
        
        const catData = await catRes.json();
        const contentData = await contentRes.json();
        
        setCategories(catData.data || []);
        
        const contentMap: Record<string, any> = {};
        (contentData.data || []).forEach((item: SiteContent) => {
          try {
            contentMap[item.section] = JSON.parse(item.data);
          } catch (e) {
            console.error(`Failed to parse content for ${item.section}`, e);
          }
        });
        setSiteContent(contentMap);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar siteData={siteContent.contact} />
      <main className="home-main">
        <Hero 
          data={siteContent.hero} 
          categories={categories.filter(c => !c.isHidden).map(c => c.name)} 
        />
        <Stats data={siteContent.stats} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', fontSize: 18, color: '#6b7280' }}>
            Đang tải dữ liệu cửa hàng...
          </div>
        ) : (
          <div id="danh-muc">
            {categories
              .filter(cat => !cat.isHidden)
              .map((cat, index) => (
                <CategorySection
                  key={cat.ID}
                  id={cat.ID}
                  badge={cat.badge || 'Nổi bật'}
                  title={cat.title || cat.name}
                  titleHighlight={cat.titleHighlight || ''}
                  subtitle={cat.description || ''}
                  products={cat.products || []}
                  bg={index % 2 === 0 ? 'white' : 'cream'}
                />
              ))}
          </div>
        )}

        <Features data={siteContent.features} />
        <About data={siteContent.about} />
        <Contact data={siteContent.contact} />
      </main>
      <Footer />
    </>
  );
}

export default Home;
