// Logo temporária - marca provisória até a equipe definir identidade visual própria durante
// o hackathon. Mantém o mesmo motivo (círculo parcialmente preenchido) do glifo "◒" que estava
// no lugar, só como SVG real (reaproveitável em favicon/OG image), nas cores da paleta do site.
export function BrandLogo({ size = 22 }: { size?: number }) {
  return <svg className="brand-logo" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Clima em Ação">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--green)" strokeWidth="1.6" />
    <path d="M12 1.5A10.5 10.5 0 0 1 12 22.5Z" fill="var(--green)" />
    <path d="M12 6.5c2.6 3.1 3.9 5.3 3.9 7.2a3.9 3.9 0 1 1-7.8 0c0-1.9 1.3-4.1 3.9-7.2Z" fill="var(--lime)" />
  </svg>
}
