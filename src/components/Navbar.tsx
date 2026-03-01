import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Vali', href: '#products' },
  { label: 'Gấu Bông', href: '#gau-bong' },
  { label: 'Sản Phẩm', href: '#danh-muc' },
  { label: 'Về Chúng Tôi', href: '#about' },
  { label: 'Liên Hệ', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <a href="#" className="navbar-logo">
              <img src="/mascot.jpg" alt="Khánh Linh mascot" className="logo-avatar" />
              <div className="logo-text">
                <span className="logo-name">KHÁNH LINH</span>
                <span className="logo-sub">Nhà Phân Phối</span>
              </div>
            </a>

            <ul className="navbar-links">
              {navLinks.map(l => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>

            <a href="tel:0965699399" className="nav-phone">
              📞 0965 699 399
            </a>

            <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>✕</button>
        {navLinks.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
        ))}
        <a href="tel:0965699399" style={{ color: 'var(--primary)', fontWeight: 800 }} onClick={() => setMobileOpen(false)}>
          📞 0965 699 399
        </a>
      </div>
    </>
  )
}
