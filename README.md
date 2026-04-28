# 🏗️ HospitMan — Hospital Construction Management Platform

> Plateforme de suivi de projet de construction d'hôpital de 300 lits pour le Directeur de Construction.

## 📋 Fonctionnalités

| Module | Description |
|---|---|
| **Dashboard** | KPIs temps réel, courbe en S, matrice des risques |
| **Périmètre** | Lots, livrables, demandes de modification |
| **Planning** | Gantt interactif, avancement planifié vs réel |
| **Coûts** | Budget par lot, factures, EVM (SPI, CPI, EAC) |
| **RH** | Effectifs, présence journalière |
| **Qualité** | Inspections, NCR, module HSE optionnel |
| **Communication** | Réunions, PV, RFI, actions à suivre |
| **Risques** | Registre des risques, matrice heatmap |
| **Rapports** | PDF/Excel hebdomadaire et mensuel |
| **Notifications** | Alertes Telegram (retards, risques critiques) |

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/ghazisellami-ux/hospitman.git
cd hospitman

# Start with Docker
docker compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (TypeScript, Recharts)
- **Backend**: FastAPI (Python 3.11, SQLAlchemy)
- **Database**: PostgreSQL 16
- **Infra**: Docker Compose
- **CI/CD**: GitHub Actions

## 📁 Structure

```
hospitman/
├── frontend/          # Next.js app
│   └── src/app/       # Pages (dashboard, scope, schedule, etc.)
├── backend/           # FastAPI app
│   └── app/
│       ├── models/    # SQLAlchemy models
│       ├── routers/   # API endpoints
│       ├── schemas/   # Pydantic schemas
│       └── services/  # EVM, Telegram, Reports
├── docker-compose.yml
└── .github/workflows/ # CI pipeline
```

## 🌐 Bilingual (FR/EN)

The interface supports French and English. Switch languages using the toggle in the top-right corner.

## 📱 Telegram Notifications

Configure your Telegram Bot token and Chat ID in the Project Settings page to receive alerts for:
- ⚠️ Schedule delays
- 🚨 Critical risks
- 📋 New Non-Conformity Reports
