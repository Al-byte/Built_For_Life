# Built For Life — refactored frontend

Eight existing pages use **one shared CSS file**, **three shared JavaScript modules**, and **one page-specific JavaScript module per page**.

## Open in VS Code

1. Open the entire `bfl_refactored_complete` folder (rather than an individual HTML file).
2. Run VS Code **Live Server**, or from the project root run `python -m http.server 5500`.
3. Visit `http://localhost:5500/` and use the navigation links to move between pages.
4. Do not use `file://` to open pages: browser ES modules require a web server.

## Folder layout

```
index.html
pages/
  account.html
  curriculum.html
  weekly-playbook.html
  progress-goals.html
  huddle.html
  plans-membership.html
  help-faqs.html
assets/
  css/bfl.css
  js/
    common.js
    navigation.js
    storage.js
    pages/
      dashboard.js
      account.js
      curriculum.js
      weekly-playbook.js
      progress-goals.js
      huddle.js
      plans-membership.js
      help-faqs.js
```

## How each page loads JavaScript

- `index.html`: `<script type="module" src="assets/js/pages/dashboard.js"></script>`
- Files inside `pages/`: `<script type="module" src="../assets/js/pages/FILENAME.js"></script>`
- Shared helpers are imported by page modules (`../navigation.js`, `../common.js`, `../storage.js`).
- Bootstrap's CDN bundle is still loaded by each page before the ES module.

## Preserved demo localStorage keys

- `bfl-account-demo-v1`
- `bfl-playbook-demo-completed-1` / `bfl-playbook-demo-completed-2`
- `bfl-progress-goals-prototype-v1`
- `bfl-huddle-prototype-v1`
- `bfl-membership-demo-v1`
- `bfl-faq-feedback-demo-v1`

These are for local **sample data only**, not for real user profiles, youth records, or authentication. Do not put secrets in frontend JS. Supabase integrations will need server-enforced permissions.

## Notes

- Existing shared sidebar/footer HTML remains in each page; this refactor extracts JavaScript, **not** HTML templates.
- Existing page-specific FAQ styles were moved into `bfl.css` without duplicating the other seven pages' styles.
- Live dashboard goals are DOM-only as before. They do not persist until connected to a common data service.
- Bootstrap icons and Google Fonts are fetched from their existing CDNs.
