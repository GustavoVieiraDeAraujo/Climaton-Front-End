import { BrandLogo } from '@/components/brand-logo'

export function Header() {
  return <header className="site-header" role="banner">
    <a className="brand" href="#inicio" aria-label="Clima em Ação, início">
      <BrandLogo size={40} /> CLIMA<span className="brand-muted">EM AÇÃO</span>
    </a>
    <nav aria-label="Navegação principal">
      <a href="#historia">01 - História</a>
      <a href="#dashboard">02 - A pergunta</a>
      <a href="#dashboard">03 - Os três eixos</a>
      <a href="#acao">04 - Ação</a>
    </nav>
  </header>
}
