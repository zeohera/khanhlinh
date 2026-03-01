import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Products from './components/Products'
import CategorySection from './components/CategorySection'
import Features from './components/Features'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

// ─── Gấu Bông / Stuffed Animals ───────────────────────────────────────────
const gauBongItems = [
  { name: 'Gấu Bông Cute 🧸', desc: 'Size nhỏ – tặng quà dễ thương' },
  { name: 'Thỏ Bông Lớn 🐰', desc: 'Size vừa – ôm ngủ siêu xịn' },
  { name: 'Gấu Trúc Panda 🐼', desc: 'Hot trend – siêu bán chạy' },
  { name: 'Mèo Bông Shiro 🐱', desc: 'Cute, mềm mịn, dễ thương' },
]

// ─── Mũ Bảo Hiểm ─────────────────────────────────────────────────────────
const muBaoHiemItems = [
  { name: 'Mũ Bảo Hiểm Nửa Đầu 🪖', desc: 'Chuẩn QCVN – giá tốt' },
  { name: 'Mũ Bảo Hiểm Trùm Đầu 🪖', desc: 'An toàn toàn diện' },
  { name: 'Mũ Nón Sơn Thời Trang 🪖', desc: 'Nhiều màu, phong cách' },
  { name: 'Mũ BH Trẻ Em 🪖', desc: 'An toàn cho bé yêu' },
]

// ─── Nón Mũ Thời Trang ───────────────────────────────────────────────────
const nonMuItems = [
  { name: 'Nón Bucket Hat 🎩', desc: 'Hot trend – tai bèo' },
  { name: 'Mũ Lưỡi Trai 🧢', desc: 'Unisex, đa phong cách' },
  { name: 'Mũ Len Mùa Đông 🎿', desc: 'Ấm áp – cute' },
  { name: 'Nón Rộng Vành ☀️', desc: 'Chống nắng – đi biển' },
]

// ─── Túi & Ví Da ─────────────────────────────────────────────────────────
const tuiViDaItems = [
  { name: 'Túi Tote Vải Canvas 👜', desc: 'Đi học, đi chơi tiện lợi' },
  { name: 'Ví Da Nam 👛', desc: 'Da PU cao cấp, nhiều ngăn' },
  { name: 'Túi Đeo Chéo Mini 👝', desc: 'Thời trang, nhỏ gọn' },
  { name: 'Ví Clutch Nữ 👜', desc: 'Dự tiệc – sang trọng' },
]

// ─── Cặp Sách & Balo ─────────────────────────────────────────────────────
const capSachBaloItems = [
  { name: 'Balo Học Sinh 🎒', desc: 'Thêu hình cute – bền đẹp' },
  { name: 'Balo Laptop 14" 💼', desc: 'Chống sốc, ngăn laptop riêng' },
  { name: 'Cặp Đi Học 📚', desc: 'Nhẹ, nhiều ngăn, có gương' },
  { name: 'Balo Du Lịch 🏞️', desc: 'Chống nước, dung tích lớn' },
]

// ─── Đồ Chơi Thông Minh ──────────────────────────────────────────────────
const doChoiItems = [
  { name: 'Xếp Hình Lego 🧩', desc: 'Phát triển tư duy cho bé' },
  { name: 'Đồ Chơi STEM 🔬', desc: 'Học mà chơi, chơi mà học' },
  { name: 'Xe Điều Khiển RC 🚗', desc: 'Tốc độ cao, pin sạc' },
  { name: 'Búp Bê Thời Trang 🪆', desc: 'Sáng tạo thời trang cho bé gái' },
]

// ─── Văn Phòng Phẩm ──────────────────────────────────────────────────────
const vanPhongPhamItems = [
  { name: 'Bút Viết Cao Cấp ✒️', desc: 'Trơn, bền, đẹp' },
  { name: 'Sổ Tay Cute 📓', desc: 'Nhiều mẫu, giá tốt' },
  { name: 'Bộ Dụng Cụ Văn Phòng 📎', desc: 'Ghim, kẹp, thước...' },
  { name: 'Sticker Trang Trí 🌸', desc: 'Set sticker cute dễ thương' },
]

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />

        {/* Vali Hùng Phát - has all 13 real images */}
        <Products />

        {/* Gấu Bông */}
        <CategorySection
          id="gau-bong"
          badge="🧸 Bán Chạy"
          title="Gấu Bông –"
          titleHighlight="Siêu Cute Siêu Mềm"
          subtitle="Gấu bông, thỏ bông, mèo bông... đủ loại hình thú cute. Quà tặng hoàn hảo, ôm ngủ cực xịn. Inbox để xem ảnh thực tế và đặt hàng sỉ/lẻ!"
          items={gauBongItems}
          bg="white"
        />

        {/* Mũ Bảo Hiểm */}
        <CategorySection
          id="mu-bao-hiem"
          badge="🪖 An Toàn"
          title="Mũ Bảo Hiểm –"
          titleHighlight="Chuẩn QCVN"
          subtitle="Mũ bảo hiểm đầy đủ mẫu từ nửa đầu đến trùm đầu, có cả mũ trẻ em. Giá sỉ tận gốc, ship toàn quốc. Liên hệ để biết báo giá CTV!"
          items={muBaoHiemItems}
          bg="cream"
        />

        {/* Nón Mũ Thời Trang */}
        <CategorySection
          id="non-mu"
          badge="🎩 Thời Trang"
          title="Nón Mũ –"
          titleHighlight="Hot Trend 2025"
          subtitle="Bucket hat, mũ lưỡi trai, mũ len, nón rộng vành... tất cả đều hot trend. Nhiều màu sắc, phong cách đa dạng, phù hợp mọi lứa tuổi."
          items={nonMuItems}
          bg="white"
        />

        {/* Túi Ví Da */}
        <CategorySection
          id="tui-vi-da"
          badge="👜 Thời Trang"
          title="Túi & Ví Da –"
          titleHighlight="Đẳng Cấp Thời Trang"
          subtitle="Túi tote, túi đeo chéo, ví da nam nữ – đa dạng kiểu dáng, chất liệu. Phù hợp làm quà tặng, đi học, đi làm, đi chơi."
          items={tuiViDaItems}
          bg="cream"
        />

        {/* Cặp Sách & Balo */}
        <CategorySection
          id="cap-sach-balo"
          badge="🎒 Học Đường"
          title="Cặp Sách & Balo –"
          titleHighlight="Bền Đẹp Tiện Lợi"
          subtitle="Balo học sinh, balo laptop, balo du lịch chống nước. Thiết kế hiện đại, nhiều ngăn tiện dụng, chịu lực tốt. Giá sỉ cho CTV toàn quốc."
          items={capSachBaloItems}
          bg="white"
        />

        {/* Đồ Chơi Thông Minh */}
        <CategorySection
          id="do-choi"
          badge="🎮 Giáo Dục"
          title="Đồ Chơi Thông Minh –"
          titleHighlight="Phát Triển Trí Tuệ"
          subtitle="Đồ chơi STEM, xếp hình, xe điều khiển RC, búp bê... giúp bé phát triển tư duy sáng tạo và vận động. Phù hợp mọi lứa tuổi."
          items={doChoiItems}
          bg="cream"
        />

        {/* Văn Phòng Phẩm */}
        <CategorySection
          id="van-phong-pham"
          badge="📎 Văn Phòng"
          title="Văn Phòng Phẩm –"
          titleHighlight="Cute & Tiện Dụng"
          subtitle="Bút viết, sổ tay, sticker trang trí, dụng cụ văn phòng – đủ mẫu mã, đủ phong cách. Lý tưởng cho học sinh, sinh viên và văn phòng."
          items={vanPhongPhamItems}
          bg="white"
        />

        <Features />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
