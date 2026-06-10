export default function Footer() {
  const socials = ["X", "GITHUB", "LINKEDIN"];

  return (
    <footer className="site-footer">
      <div className="outer">
        <div className="footer-row">
          <span className="footer-name">UTKARSH PANCHAL © 2026</span>
          <div className="footer-socials">
            {socials.map((s, i) => (
              <span key={s}>
                <button type="button" className="footer-social-link">
                  {s}
                </button>
                {i < socials.length - 1 && (
                  <span className="footer-social-sep">/</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
