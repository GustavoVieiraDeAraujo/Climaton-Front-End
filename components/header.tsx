import { BrandLogo } from '@/components/brand-logo'

export function Header() {
  return <header className="site-header">
    <a className="brand" href="#inicio" aria-label="Clima em Ação, início">
      <BrandLogo size={40} /> CLIMA<span className="brand-muted">EM AÇÃO</span>
    </a>
    <nav aria-label="Navegação principal">
      <a href="#historia">01 - História</a>
      <a href="#dashboard">02 - Dados</a>
      <a href="#territorio">03 - Território</a>
      <a href="#mapa">04 - Mapa</a>
      <a href="#insights">05 - Insights</a>
      <a href="#acao">06 - Ação</a>
      <a href="#inicio">07 - Sobre o Projeto</a>
    </nav>
  </header>
}
