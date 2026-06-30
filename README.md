# HatCode — Frontend

Pure HTML, CSS, and JavaScript frontend for HatCode, an open data quality and trustworthiness checker for relational databases.

## Structure

frontend/
├── index.html              Landing page
├── login.html               Login / signup (combined)
├── css/
│   ├── style.css            Design tokens + landing page
│   ├── auth.css              Auth pages
│   ├── app.css               Shared app shell (sidebar, topbar)
│   ├── scan.css               Scan page
│   ├── tables.css             Tables + table detail
│   ├── analysis.css           Violations, duplicates, anomalies
│   ├── config.css             Rules + connections
│   ├── history.css            Scan history
│   ├── settings.css           Settings
│   └── reports.css            Reports
├── js/
│   ├── main.js                Landing page animations
│   ├── auth.js                  Login/signup logic
│   ├── app.js                    Shared sidebar + avatar dropdown
│   └── ...                       (one JS file per page)
└── app/
├── dashboard.html
├── scan.html
├── tables.html
├── table-detail.html
├── violations.html
├── duplicates.html
├── anomalies.html
├── rules.html
├── connections.html
├── history.html
├── settings.html
└── reports.html

## Design system

**Palette:** Winter Chill (`#0B2E33`, `#4F7C82`, `#93B1B5`, `#B8E3E9`)
**Fonts:** Inter (UI), Plus Jakarta Sans (data/numbers)

## Running locally

Open `index.html` directly in a browser, or serve the folder with any static server.

## Backend

This frontend is designed to connect to a Spring Boot REST API (in progress, separate repo folder `/backend`).