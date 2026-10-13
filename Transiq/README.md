# PayGate / Transiq UI Handoff

This is the shared UI and module integration guide for the PayGate payment gateway. The application has two navigation shells:

- **Customer menu** for Modules 1-5
- **Admin menu** for Module 6: Transaction Logs and Monitoring

The sidebar, typography, icons, colors, spacing, active states, and responsive layout are shared standards. Module teams should add page content without redesigning the shell.

## Files To Share Together

There is no single HTML file to share for this React application. Share these files together so the UI remains identical:

```text
src/
  main.jsx                 # React entry point; imports the global stylesheet
  index.css                # Global reset, font, body background, root sizing
  App.jsx                 # Role switch, sidebar selection, and routes
  App.css                 # Main layout, content offset, settings page, mode switcher
  components/
    CustomerSidebar.jsx   # Customer menu
    AdminSidebar.jsx      # Admin menu
    SidebarIcon.jsx       # Shared SVG icon set
    Sidebar.css           # Shared sidebar layout and visual design
```

Also share `package.json` so dependencies and scripts stay the same. The module folders under `src/modules/` contain each team's page and business logic.

**Important:** Do not copy only `CustomerSidebar.jsx` or `AdminSidebar.jsx`. The JSX depends on `SidebarIcon.jsx` and `Sidebar.css`, while the page position and global font depend on `index.css` and `App.css`.

## If Sharing The Home Page Only

For a teammate building only the customer Home page, share this minimum package:

```text
src/
  main.jsx
  index.css
  App.jsx
  App.css
  components/
    CustomerSidebar.jsx
    SidebarIcon.jsx
    Sidebar.css
  modules/01-landing/
    pages/HomePage.jsx       # teammate's page content
```

The teammate should replace only the Home page file and keep the shell files unchanged. In `App.jsx`, connect the page to the customer home route:

```jsx
import HomePage from './modules/01-landing/pages/HomePage';

<Route path="/" element={<HomePage />} />
```

The Home page itself should contain content only. It should not contain a second sidebar, global font declaration, `BrowserRouter`, or a full-screen layout that overrides the shell. Use a page wrapper such as:

```jsx
const HomePage = () => (
  <section className="module-page">
    <h1>Dashboard</h1>
    <p>Customer account overview.</p>
  </section>
);

export default HomePage;
```

If the teammate needs a different page-specific design, add a stylesheet beside `HomePage.jsx`; do not edit the shared sidebar or global CSS.

## Exact UI Standards

These values define the current company-style shell:

| Property | Standard |
| --- | --- |
| Font | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif` |
| Sidebar width | `252px` expanded; `76px` collapsed |
| Sidebar background | `#151716` |
| Sidebar border | `1px solid rgba(255, 255, 255, 0.08)` |
| Item height | `44px` minimum |
| Item radius | `7px` |
| Item text | `14px`, weight `500` |
| Icon | Monochrome SVG, `22px`, no emoji |
| Active indicator | Blue `#3d73d3`, `3px` wide |
| Content offset | `252px` on desktop; `0` on mobile |
| Mobile breakpoint | `640px` |
| Admin/customer switch | Top-right, development-only |

The global font and page defaults are in `src/index.css`. Sidebar-specific values are in `src/components/Sidebar.css`. Do not introduce a second font, emoji icons, random icon libraries, or a second navigation style.

## Run And Validate

Run commands from the `Transiq` frontend folder:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Open `http://localhost:5173/` in a browser.

## Customer/Admin Role Switch

For development, `App.jsx` contains:

```jsx
const [userMode, setUserMode] = useState('admin');

{userMode === 'admin' ? <AdminSidebar /> : <CustomerSidebar />}
```

The top-right **Customer menu** and **Admin menu** buttons switch between the two shells. In production, replace this temporary switch with the authenticated user's role. Do not create another sidebar.

## Customer Menu Contract

| Label | Route | Module |
| --- | --- | --- |
| Dashboard | `/` | 1 |
| My wallet | `/my-wallet` | 1 |
| My pockets | `/my-pockets` | 1 |
| Recipients | `/recipients` | 2 |
| Send money | `/send-money` | 3 |
| Transactions | `/transactions` | 4 |
| Financial analysis | `/financial-analysis` | 4 |
| Insights | `/insights` | 4 |
| Security | `/security` | 5 |

Customer workflow:

```text
Landing Page -> Customer -> Remitter -> Recipient -> Fund Amount
-> Payment Initiation -> Transaction -> Limited Banking
-> Success / Failure / Pending -> Transaction Log
```

## Admin Menu Contract: Module 6

| Label | Route | Ownership |
| --- | --- | --- |
| Overview | `/admin/monitoring` | Module 6 dashboard |
| Payment history | `/admin/history` | Module 6 |
| Transaction logs | `/admin/logs` | Module 6 |
| Pending monitor | `/admin/pending` | Module 6, live badge |
| Error logs | `/admin/errors` | Module 6, unresolved badge |
| Settings | `/admin/settings` | Standalone settings page |

Module 6 implementation:

```text
src/modules/06-logs/
  components/
  pages/
  store/
```

It contains the monitoring dashboard, transaction logs, payment history, pending monitor, error logs, and Zustand store.

## Adding A Module Page

Create the page inside the assigned module folder, then register its route in `src/App.jsx`:

```jsx
import RecipientsPage from './modules/02-remitter-recipient/pages/RecipientsPage';

<Route path="/recipients" element={<RecipientsPage />} />
```

Keep page-specific CSS inside the module. Do not modify `Sidebar.css` for page styling. Keep menu labels and documented routes stable so teams can work independently and integrate later.

## Settings

`/admin/settings` is a registered route and opens the standalone Settings workspace. Replace only its page content when the requirements are defined. The Settings icon is the `settings` cog in `SidebarIcon.jsx`; it must remain a cog, not a light bulb or sun symbol.

## Six Module Scope

1. Landing Page and Customer Management
2. Remitter and Recipient Management
3. Payment Initiation
4. Transaction and Fund Processing
5. Banking and Fund Handling
6. Transaction Logs and Monitoring

PayGate enables a customer acting as a remitter to initiate a fund transfer to a recipient, manages the transaction lifecycle, communicates with an authorized banking system, and records payment status and events.

## Strict Team Rules

- Share and reuse all shell files listed above.
- Do not use emoji icons, text-symbol icons, or mixed icon libraries.
- Do not expose internal labels such as `module 2` or `opens wizard` in the product UI.
- Do not duplicate or redesign the Customer/Admin sidebars.
- Keep the font, sidebar width, content offset, colors, icon size, and active state unchanged.
- Use semantic links for navigation and buttons for actions.
- Put module ownership in folders and documentation, not customer-facing labels.
- Run `npm run lint` and `npm run build` before handoff.
- Test both Customer and Admin menu buttons after route changes.

## Handoff Checklist

- [ ] Page created inside the assigned module folder
- [ ] Route registered in `src/App.jsx`
- [ ] Existing sidebar reused
- [ ] Existing global font and layout preserved
- [ ] No emoji or temporary module wording in visible UI
- [ ] Customer/Admin switching tested
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
