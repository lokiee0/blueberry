<script lang="ts">
  const bridge = window.blueberry;
  const runtime = `Electron ${bridge.versions.electron}`;
</script>

<svelte:head>
  <meta
    name="description"
    content="Blueberry is a clean-room, security-first desktop browser foundation."
  />
</svelte:head>

<main class="shell">
  <header class="toolbar">
    <div class="brand" aria-label="Blueberry home">
      <span class="berry" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
      </span>
      <span>Blueberry</span>
    </div>

    <div class="omnibox" aria-label="Address bar preview">
      <span class="shield" aria-hidden="true">◆</span>
      <span>Search or enter an address</span>
      <kbd>⌘ K</kbd>
    </div>

    <button class="profile" type="button" aria-label="Local profile">B</button>
  </header>

  <section class="hero">
    <div class="glow glow-one"></div>
    <div class="glow glow-two"></div>

    <div class="hero-content">
      <span class="eyebrow">MILESTONE 0 · FOUNDATION</span>
      <h1>A calmer place to<br /><em>browse and build.</em></h1>
      <p>
        Blueberry starts with a small, secure core. The browser, tools, and AI layers will grow from
        isolated process boundaries—not inherited trust.
      </p>

      <div class="status-row">
        <span class="status"><i></i> Secure shell ready</span>
        <span class="runtime">{runtime} · {bridge.platform}</span>
      </div>
    </div>

    <aside class="foundation-card" aria-label="Security foundation">
      <div class="card-topline">
        <span>Foundation checks</span>
        <span class="score">3 / 3</span>
      </div>

      <ul>
        <li>
          <span class="check">✓</span>
          <div><strong>Context isolated</strong><small>Renderer globals are separated</small></div>
        </li>
        <li>
          <span class="check">✓</span>
          <div>
            <strong>Node access disabled</strong><small>No direct filesystem or process APIs</small>
          </div>
        </li>
        <li>
          <span class="check">✓</span>
          <div>
            <strong>Sandbox enabled</strong><small>Untrusted renderer privileges reduced</small>
          </div>
        </li>
      </ul>

      <div class="boundary">
        <span>Main</span><b></b><span>Preload</span><b></b><span>Renderer</span>
      </div>
    </aside>
  </section>

  <section class="next-section">
    <p class="section-label">COMING NEXT</p>
    <div class="feature-grid">
      <article>
        <span>01</span>
        <h2>Browser shell</h2>
        <p>Tabs, navigation, history, and bookmarks with explicit boundaries.</p>
      </article>
      <article>
        <span>02</span>
        <h2>Local profiles</h2>
        <p>Private persistence designed around clear ownership and deletion.</p>
      </article>
      <article>
        <span>03</span>
        <h2>AI workspace</h2>
        <p>Provider-neutral conversations with permission-controlled tools.</p>
      </article>
    </div>
  </section>
</main>
