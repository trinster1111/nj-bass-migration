# nj-bass-migration
Real-time and historical striped bass migration tracker, NOAA marine conditions dashboard, and behavioral lure matrix for the NJ coast.

 Pt. Beach Striper Tracker & Surf Guide

 fast, no-nonsense web application built for New Jersey surf and boat fishermen. Tracks real-time and historical striped bass (*Morone saxatilis*) migration patterns along the Jersey Shore, integrates live NOAA marine telemetry, and provides an interactive behavioral lure recommendation engine based on tide, barometer, moon phase, and bait presence.

 Key Features
- Live & Historical Migration Map:** Zone-based coastal tracking (Sandy Hook to Barnegat Light) comparing current biomass movement against historical weekly averages.
- Real-Time Marine Telemetry:** Automated fetching of water temperature, tide stage, wind, and barometric pressure via NOAA Tides & Currents and Open-Meteo APIs.
- Interactive "How They Act" Engine:** Algorithmic lure/bait selector built from local surfcasting logs across varying tide stages, light levels, and pressure trends.
- Conservation & Catch-and-Release Hub:** Direct resources for Stripers Forever, ASGA, and CCA NJ, alongside slot-limit harvest preparation guides.
- Local Fleet & Shop Network:** Verified reporting pipeline powered by Pt. Pleasant and Manasquan charter captains and tackle shops.

  Tech Stack
- Frontend: HTML5, Tailwind CSS, Vanilla JavaScript (ES6+)
- Mapping: Leaflet.js (OpenStreetMap / CARTO Dark Matter tiles)
- APIs: NOAA CO-OPS API (Station 8531680 / Manasquan), Open-Meteo Marine API
- Deployment: GitHub Pages / Vercel (CI/CD)
