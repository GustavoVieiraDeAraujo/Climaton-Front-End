import { BrandLogo } from '@/components/brand-logo'

export function Header() {
  return <header className="site-header" role="banner">
    <a className="brand" href="#inicio" aria-label="Clima em Ação, início">
      <BrandLogo size={40} /> CLIMA<span className="brand-muted">EM AÇÃO</span>
    </a>
    <nav aria-label="Navegação principal">
      <div className="nav-row">
        <a href="#historia">01 - História</a>
        <a href="#dashboard">02 - Eixos</a>
        <a href="#territorio">03 - Território</a>
        <a href="#prioridades">04 - Prioridades</a>
        <a href="#mapa">05 - Mapa</a>
        <a href="#relatos">06 - Relatos</a>
      </div>
      <div className="nav-row">
        <a href="#rede-apoio">07 - Rede de Apoio</a>
        <a href="#cobertura">08 - Cobertura</a>
        <a href="#insights">09 - Insights</a>
        <a href="#comparacao">10 - Comparação</a>
        <a href="#acao">11 - Ação</a>
        <a href="#fontes">12 - Fontes</a>
      </div>
    </nav>
  </header>
}
