# EvoTrends — Project Log
> Читай этот файл ПЕРВЫМ при старте каждой сессии.
> Добавляй новые записи СВЕРХУ. Старые не удаляй.

---

## SESSION LOG

### [2026-03-26] — Сессия #2
**Статус:** Completed

**Что сделано:**
- Применена цветовая схема Nordic Sunrise (Navy #003366 + Orange #FF6633) — CSS-переменные обновлены
- Исправлены все хардкодированные цвета rgba(0,212,255,...) → rgba(255,102,51,...) в style.css
- Создан SVG логотип: круг O + диагональ EV, orange/amber, вставлен во все 7 страниц (nav + footer)
- Добавлена анимация логотипа на главной странице: stroke-draw (рисование) + медленное вращение
- Герой index.html переделан в 2-колоночный layout на десктопе (текст + анимированный логотип)
- Обновлён email в contact.html: info@evotrends.pro → petr.desyatov@gmail.com

**Текущее состояние:**
- Все файлы сайта обновлены и готовы к деплою
- Контактная форма: Formspree (нужно заменить YOUR_FORM_ID в contact.html)

**Открытые задачи:**
- [ ] Загрузить изменения в GitHub (git add . && git commit -m "Nordic Sunrise rebrand + SVG logo animation" && git push)
- [ ] Активировать Formspree форму (заменить YOUR_FORM_ID в contact.html)
- [ ] Настроить GitHub Pages если ещё не сделано
- [ ] Подключить Cloudflare + домен evotrends.pro
- [ ] Добавить новые проекты (Пётр обещал описать)
- [ ] Опционально: добавить фото в about.html
- [ ] Опционально: добавить LinkedIn URL в contact.html сайдбар

**Следующий шаг:**
Push в GitHub → проверить сайт онлайн → активировать Formspree

---

### [2026-03-26] — Сессия #1
**Статус:** Completed
**GitHub Repo:** https://github.com/PeterDiez/EvoTrends.git

**Что сделано:**
- Создана полная новая версия сайта EvoTrends (7 страниц + CSS + JS)
- Дизайн: тёмный (#050c1a), акценты cyan (#00d4ff) + purple (#7c3aed), шрифт Inter
- Фокус смещён с туризма на DeepTech/R&D commercialization
- Контактная форма: Formspree (требует активации — заменить YOUR_FORM_ID)

**Текущее состояние файлов:**
- `index.html` — Главная: hero, 6 сервисов, кейсы FIDCHEM/Resto-AI, индустрии, CTA
- `services.html` — 6 категорий услуг с детальным описанием (two-col layout)
- `approach.html` — Методология: 4-шаговый Technology-to-Product Framework + AI Tools
- `expertise.html` — 4 ключевые компетенции + компетенции-стрипы + 6 индустрий
- `projects.html` — FIDCHEM (full card), Resto-AI (full card), NDA x3, Консорциумы
- `about.html` — Полный About с текстом от Петра: What we do / Approach / Experience / Who we work with / Positioning
- `contact.html` — Форма с выбором темы (5 кнопок) + сайдбар с info
- `css/style.css` — ~550 строк, полная дизайн-система
- `js/main.js` — Nav scroll, mobile menu, scroll reveal, URL params для contact
- `README.md` — Инструкция по GitHub Pages + Cloudflare + Formspree
- `.nojekyll` — Отключает Jekyll обработку на GitHub Pages

**Открытые задачи:**
- [ ] Загрузить файлы в GitHub репозиторий
- [ ] Активировать Formspree форму (заменить YOUR_FORM_ID в contact.html)
- [ ] Настроить GitHub Pages (Settings → Pages → main branch)
- [ ] Подключить Cloudflare + свой домен (evotrends.pro)
- [ ] Добавить реальный email/LinkedIn в contact.html сайдбар (сейчас placeholder: info@evotrends.pro)
- [ ] Добавить новые проекты (Пётр обещал описать)
- [ ] Опционально: добавить фото в about.html

**Принятые решения:**
- Статический сайт (HTML/CSS/JS) без фреймворков — проще деплоить на GitHub Pages
- Тёмный + яркие акценты (cyan+purple) — соответствует DeepTech-аудитории
- Formspree для форм — бесплатно, работает со статическими сайтами
- .nojekyll файл — GitHub Pages без него ломает пути к css/js

**Следующий шаг (для следующей сессии):**
Загрузить сайт в GitHub → активировать GitHub Pages → проверить работу сайта → добавить Formspree → настроить домен через Cloudflare

**Контекст для нового компьютера:**
Сайт создан и лежит в папке проекта (EvoTrends - Web&Business dev).
GitHub repo: https://github.com/PeterDiez/EvoTrends.git
Команды для git push — см. инструкцию ниже в PROJECT_LOG.
Дизайн-система полностью в css/style.css (CSS переменные в :root).
Контактная форма нерабочая пока не заменят YOUR_FORM_ID.

---

## GIT SYNC COMMANDS (macOS)

### Первый раз (инициализация):
```bash
cd "/путь/к/папке/EvoTrends - Web&Business dev"
git init
git remote add origin https://github.com/PeterDiez/EvoTrends.git
git add .
git commit -m "Initial commit: EvoTrends website v2"
git branch -M main
git push -u origin main
```

### Каждый раз после изменений:
```bash
cd "/путь/к/папке/EvoTrends - Web&Business dev"
git add .
git commit -m "описание что изменил"
git push
```

### Получить изменения с GitHub (если редактировал на другом компьютере):
```bash
git pull origin main
```
