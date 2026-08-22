import { BrandLogo } from '@/components/brand-logo'

export function Footer() {
  return <footer className="footer section-wrap">
    <div className="brand"><BrandLogo /> CLIMA<span className="brand-muted">EM AÇÃO</span></div>
    <span>Dado real e auditado · dataset_unificado/clima_brasil_climate_scanner.sqlite</span>
    <span>ClimatonBrasil 2026 · TCU</span>
  </footer>
}
