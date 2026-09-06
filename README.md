# NEXUS-DR — AI Landslide Early Warning & Disaster Response Platform

NEXUS-DR is a web-based platform for landslide risk monitoring, early warning, and coordinated disaster response. It brings together risk forecasting, field data, alerts, and inter-agency response tracking into a single dashboard.

## Features

- **Risk Engine** — Computes and visualizes landslide risk levels across monitored zones.
- **Forecast** — Displays predictive risk trends and weather-driven hazard indicators.
- **Alerts** — Issues and tracks early warning notifications for at-risk areas.
- **Field Data** — Captures on-ground reports and sensor/field inputs.
- **Response Coordination** — Tracks incident response stages and dispatch metrics (e.g. median dispatch time) across agencies such as NDRF, SDRF, and municipal teams.
- **Roads** — Monitors road/route status relevant to evacuation and access.
- **Platform Overview** — Central dashboard tying together risk, alerts, and response data.
- **Multi-language support** — Language switcher for wider accessibility.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript / React
- **Styling:** Tailwind CSS

## Project Structure

```
project/
├── app/
│   ├── alerts/
│   ├── field/
│   ├── forecast/
│   ├── platform/
│   ├── response/
│   ├── risk-engine/
│   ├── roads/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── app-shell.tsx
│   ├── language-provider.tsx
│   ├── language-switcher.tsx
│   ├── page-header.tsx
│   ├── risk-bits.tsx
│   ├── risk-map-inner.tsx
│   └── risk-map.tsx
└── lib/
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is set up for deployment on **AWS Amplify**:

1. Push the repository to GitHub.
2. Connect the repo in the AWS Amplify console.
3. Amplify auto-detects the Next.js build settings.
4. Deploy — Amplify provides a live shareable URL (`https://main.drw619y9ezen3.amplifyapp.com`).

## License

Specify your project's license here (e.g. MIT).
