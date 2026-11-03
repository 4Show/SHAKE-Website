document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.querySelector("[data-site-footer], footer");
    if (!placeholder) {
        return;
    }

    placeholder.outerHTML = `
        <footer class="site-footer">
          <div class="site-footer-main">
            <a class="site-footer-brand" href="../HTML/Home-SHAKE.html" aria-label="SHAKE home">
              <img src="../../media/logos/Distressed SHK Hustlers Oval Logo.png" alt="Distressed SHK Hustlers logo">
            </a>
            <section class="site-footer-newsletter" aria-labelledby="footer-newsletter-title">
              <h2 id="footer-newsletter-title">Get on the list</h2>
              <p>Get SHAKE updates and new-release announcements.</p>
              <form id="newsletterForm" action="../scripts/subscribe-newsletter.php" method="post">
                <label for="newsletter-email">Email address</label>
                <input id="newsletter-email" name="email" type="email" maxlength="254" autocomplete="email" placeholder="you@example.com" required>
                <label for="newsletter-phone">Phone number</label>
                <input id="newsletter-phone" name="phone" type="tel" maxlength="40" autocomplete="tel" placeholder="Your phone number">
                <button type="submit">Subscribe</button>
                <p class="site-footer-form-status" data-form-status role="status" aria-live="polite"></p>
              </form>
            </section>
            <section class="site-footer-social" aria-labelledby="footer-social-title">
              <h2 id="footer-social-title">Follow SHAKE</h2>
              <p class="site-footer-tagline" aria-label="Stay connected with the movement.">
                <span>Stay</span>
                <span>connected</span>
                <span>with</span>
                <span>the</span>
                <span>movement.</span>
              </p>
              <div class="site-footer-social-links">
                <a href="https://www.instagram.com/shk_shake" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img src="../../media/social/instagram.png" alt="">
                </a>
                <a href="https://www.tiktok.com/@ashake18_" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <img src="../../media/social/tiktok_logo.png" alt="">
                </a>
                <a href="#" aria-label="Twitter">
                  <img src="../../media/social/twitter_logo.png" alt="">
                </a>
                <a href="#" aria-label="Facebook">
                  <img src="../../media/social/facebook_logo.png" alt="">
                </a>
              </div>
            </section>
          </div>
          <div class="site-footer-bottom">
            <p>&copy; 2018 SHAKE - Luxury Streetwear. All rights reserved.</p>
            <a href="../HTML/Contact-SHAKE.html">Contact SHAKE</a>
          </div>
        </footer>
    `;
});
