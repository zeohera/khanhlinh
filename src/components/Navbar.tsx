import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Trang Chủ', href: '/' },
  { label: 'Sản Phẩm', href: '/#danh-muc' },
  { label: 'Về Chúng Tôi', href: '/#about' },
  { label: 'Liên Hệ', href: '/#contact' },
]

interface NavbarProps {
  siteData?: {
    phone?: string;
    phoneHref?: string;
    highlight?: string; // Logo Name
    logoSub?: string;
  };
}

export default function Navbar({ siteData }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHomePage = location.pathname === '/'
  const isSolid = !isHomePage || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    
    if (href === '/') {
       navigate('/')
       window.scrollTo({ top: 0, behavior: 'smooth' })
       return
    }
    
    if (href.startsWith('/#')) {
       const targetId = href.replace('/#', '')
       if (isHomePage) {
          const el = document.getElementById(targetId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
       } else {
          navigate('/')
          setTimeout(() => {
             const el = document.getElementById(targetId)
             if (el) el.scrollIntoView({ behavior: 'smooth' })
          }, 300) // slight delay to allow React to render the Home page
       }
    }
  }

  return (
    <>
      <nav className={`navbar ${isSolid ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="navbar-logo" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <img src="/mascot.jpg" alt="Khánh Linh mascot" className="logo-avatar" />
              <div className="logo-text">
                <span className="logo-name">{siteData?.highlight || 'KHÁNH LINH'}</span>
                <span className="logo-sub">{siteData?.logoSub || 'Nhà Phân Phối'}</span>
              </div>
            </Link>

            <ul className="navbar-links">
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => handleNavClick(e, l.href)}>{l.label}</a>
                </li>
              ))}
            </ul>

            <a href={siteData?.phoneHref || "tel:0965699399"} className="nav-phone">
              📞 {siteData?.phone || "0965 699 399"}
            </a>

            <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>✕</button>
        {navLinks.map(l => (
          <a key={l.href} href={l.href} onClick={(e) => handleNavClick(e, l.href)}>{l.label}</a>
        ))}
        <a href={siteData?.phoneHref || "tel:0965699399"} style={{ color: 'var(--primary)', fontWeight: 800 }} onClick={() => setMobileOpen(false)}>
          📞 {siteData?.phone || "0965 699 399"}
        </a>
      </div>
    </>
  )
}
