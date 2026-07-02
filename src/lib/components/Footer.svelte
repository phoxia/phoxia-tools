<script lang="ts">
  import { resolve } from "$app/paths";
  import { t } from "$lib/i18n/i18n.svelte";
  import { revoke } from "$lib/consent/consent.svelte";
  import { revokeClipboardConsent } from "$lib/consent/clipboardConsent.svelte";

  let locale = $derived(t());
</script>

<footer class="footer">
  <div class="footer-inner">
    <!-- ── TOP ── -->
    <div class="footer-top">
      <a href={resolve("/")} class="footer-logo" aria-label={locale.aria.homeLogo}>
        <img
          src="/brand/symbol.png"
          alt=""
          width="22"
          height="22"
          aria-hidden="true"
          loading="lazy"
        />
        <span class="logo-phoxia">Phoxia</span>
        <span class="logo-tools">Tools</span>
      </a>

      <nav class="footer-links" aria-label={locale.aria.footerNav}>
        <a href="https://phoxia.org/contact">{locale.footer.contact}</a>
        <a href={resolve("/privacy")}>{locale.footer.privacy}</a>
        <a href={resolve("/terms")}>{locale.footer.terms}</a>
      </nav>
    </div>

    <!-- ── BOTTOM ── -->
    <div class="footer-bottom">
      <div class="footer-copy">
        <span class="copy-symbol">&copy;</span>
        <span class="copy-year">{new Date().getFullYear()}</span>
        <span class="copy-name">Phoxia</span>
        <span class="copy-sep" aria-hidden="true">&middot;</span>
        <span class="copy-license">{locale.footer.legal}</span>
      </div>

      <div class="footer-bottom-right">
        <button class="cookie-btn" onclick={revoke}>
          {locale.consent.revoke}
        </button>
        <span class="footer-bottom-sep" aria-hidden="true">&middot;</span>
        <button class="cookie-btn" onclick={revokeClipboardConsent}>
          {locale.clipboardWatcher.settingsLink}
        </button>
        <span class="footer-bottom-sep" aria-hidden="true">&middot;</span>
        <a
          href="https://discord.gg/HD2p367Zb5"
          target="_blank"
          rel="noopener noreferrer"
          class="external-link"
          aria-label={locale.aria.discord}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
            />
          </svg>
          {locale.footer.discord}
        </a>
        <a
          href="https://github.com/phoxia-org/phoxia-tools"
          target="_blank"
          rel="noopener noreferrer"
          class="external-link"
          aria-label={locale.aria.github}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          {locale.footer.github}
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
    padding: 1.5rem;
  }

  .footer-inner {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* ── Top ── */
  .footer-top {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .footer-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .logo-phoxia {
    color: var(--color-text);
  }

  .logo-tools {
    color: var(--color-accent);
  }

  .footer-logo:hover {
    opacity: 0.75;
  }

  .footer-links {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .footer-links a {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s;
  }

  .footer-links a:hover {
    color: var(--color-text);
  }

  /* ── Bottom ── */
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-border);
    gap: 1rem;
    flex-wrap: wrap;
  }

  .footer-copy {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .copy-symbol {
    font-size: 0.78rem;
    color: var(--color-text-muted);
    font-family: var(--font-body);
  }

  .copy-year {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .copy-name {
    font-family: var(--font-heading);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-text-muted);
    letter-spacing: -0.01em;
  }

  .copy-sep {
    color: var(--color-border-strong);
    font-size: 0.72rem;
  }

  .copy-license {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--color-text-faint);
    letter-spacing: 0.01em;
  }

  .footer-bottom-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .footer-bottom-sep {
    color: var(--color-border-strong);
    font-size: 0.72rem;
  }

  .cookie-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text-faint);
    padding: 0;
    transition: color 0.15s;
  }

  .cookie-btn:hover {
    color: var(--color-text-muted);
  }

  .external-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text-faint);
    text-decoration: none;
    transition: color 0.15s;
  }

  .external-link:hover {
    color: var(--color-text-muted);
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .footer-top {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .footer-links {
      width: 100%;
      justify-content: center;
      gap: 1rem;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .footer-copy {
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-bottom-right {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
