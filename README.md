# EvoTrends — Official Website

**Commercializing Complex Technologies**

Static website for EvoTrends — a strategic commercialization partner for DeepTech and R&D-driven companies.

## Stack

- Pure HTML5 + CSS3 + vanilla JavaScript
- No frameworks, no build step required
- Hosted on GitHub Pages + Cloudflare CDN
- Contact form: [Formspree](https://formspree.io) (requires setup — see below)

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero, services overview, selected cases, industries, CTA |
| `services.html` | Full services: 6 categories with detailed scope |
| `approach.html` | Methodology: Technology-to-Product Framework, AI & Digital tools |
| `expertise.html` | Core competencies: 4 expertise areas + industries |
| `projects.html` | Portfolio: FIDCHEM, Resto-AI, NDA engagements, consortium work |
| `about.html` | Company overview, positioning, experience, who we work with |
| `contact.html` | Contact form with topic selector + sidebar info |

## Setup

### 1. GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `(root)`
4. Your site will be live at `https://peterdiez.github.io/EvoTrends`

### 2. Custom Domain (Cloudflare)

1. Add your domain in GitHub Pages settings → "Custom domain"
2. In Cloudflare DNS, add:
   - `CNAME` → `www` → `peterdiez.github.io`
   - `A` records for apex domain (GitHub Pages IPs):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. Set SSL/TLS to **Full** in Cloudflare
4. Enable **Always Use HTTPS**

### 3. Contact Form (Formspree)

1. Go to [formspree.io](https://formspree.io) → Create free account
2. Create a new form → copy the form ID
3. In `contact.html`, replace `YOUR_FORM_ID` with your actual ID:
   ```html
   action="https://formspree.io/f/YOUR_ACTUAL_ID"
   ```

## Project Structure

```
/
├── index.html
├── services.html
├── approach.html
├── expertise.html
├── projects.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── .nojekyll
└── README.md
```

## Development

No build step required. Open any `.html` file directly in a browser, or use a local server:

```bash
# Python
python3 -m http.server 8080

# Node (if npx available)
npx serve .
```

---

© 2026 EvoTrends
