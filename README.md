[![CI](https://github.com/wahidhendrawan/iac-webapps/actions/workflows/ci.yml/badge.svg)](https://github.com/wahidhendrawan/iac-webapps/actions/workflows/ci.yml)

# IaC WebApps (v1.7.0)

[![Project Status](https://img.shields.io/badge/status-active-emerald.svg)]()
[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](tsconfig.json)
[![React](https://img.shields.io/badge/React%2019-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite)](vite.config.ts)
[![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss)](tailwind.config.js)
[![Docker](https://img.shields.io/badge/docker-compose%20ready-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![Creator](https://img.shields.io/badge/created%20by-Wahid%20Hendrawan-indigo.svg)](https://wahidhendrawan.onrender.com/)
[![GitHub last commit](https://img.shields.io/github/last-commit/wahidhendrawan/iac-webapps)](https://github.com/wahidhendrawan/iac-webapps/commits/main)

A powerful, multi-tool visual platform for generating and managing Infrastructure as Code (IaC) configurations. Design your infrastructure visually and instantly generate production-ready code for **Terraform, OpenTofu, Pulumi, or Helm Charts**.

## 🖼️ Screenshots

| Screen | Description |
|--------|-------------|
| **Visual Designer** | Drag-and-drop canvas with React Flow — add AWS, Azure, GCP, K8s, On-Prem resources visually |
| **AI Copilot** | Describe infrastructure in natural language — DeepSeek-V3 / GPT-4o generates resources automatically |
| **Cost Estimator** | Real-time cost breakdown with USD ↔ IDR conversion and per-resource pricing |
| **Security Scanner** | DevSecOps static analysis — find public S3, open SSH, hardcoded secrets before deploy |
| **Template Library** | Pre-configured blueprints: 3-Tier Network, Hybrid Cloud, Kubernetes Stack |

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🎨 **Visual Designer** | Interactive drag-and-drop canvas with React Flow — synchronized code/view/edit |
| 🔧 **Multi-IaC Export** | Generate Terraform, OpenTofu, Pulumi (TypeScript), or Helm Charts from one design |
| 🤖 **AI Copilot** | DeepSeek-V3 / GPT-4o integration — describe infra in natural language |
| 💰 **Cost Estimator** | Real-time pricing with hourly/daily/monthly breakdown + USD ↔ IDR conversion |
| 📚 **Template Library** | Start fast with 3-Tier Network, Hybrid Cloud, K8s Stack blueprints |
| 🔄 **HCL Importer** | Reverse-engineer existing `.tf` files into visual diagrams |
| 🔒 **DevSecOps Scanner** | Real-time static analysis — public S3, open SSH, secrets detection |
| 🧩 **Advanced Logic** | Modules, Remote State Backends, Resource Dependencies |
| ☁️ **Multi-Cloud** | AWS, Azure, GCP, Alibaba, Huawei, K8s, VMware vSphere, Proxmox VE, Sangfor HCI |

## 🛠 Supported Providers

*   **Public Cloud**: AWS, Azure, Google Cloud, Alibaba Cloud, Huawei Cloud.
*   **Container/K8s**: Kubernetes (Deployments, Services, Helm).
*   **On-Premise/Hybrid**: VMware vSphere, Proxmox VE, Sangfor HCI.
*   **Local**: Local File System management.

## 🗺️ Roadmap

- ✅ Drag-and-drop visual designer with React Flow
- ✅ Multi-IaC export (Terraform, OpenTofu, Pulumi, Helm)
- ✅ AI Copilot (DeepSeek-V3 / GPT-4o)
- ✅ Real-time cost estimator
- ✅ HCL reverse-engineering importer
- ✅ DevSecOps security scanner
- ⬜ **Live Terraform Plan Diff** — preview resource changes before applying
- ⬜ **GitHub Actions CI integration** — auto-Terraform plan on PR
- ⬜ **GitLab CI / Bitbucket Pipelines export**
- ⬜ **Terraform Cloud API integration** — remote state + runs
- ⬜ **Multi-user collaboration** — shared workspaces with real-time sync
- ⬜ **Export to CDK (AWS CDK, CDKTF)**

## ⚙️ Architecture

```text
Browser ──▶ Nginx :8088 ──▶ Vite Dev Server / Static SPA
                │
                └── /api proxy ──▶ (Future: IaC generation API)
```

Built entirely as a client-side SPA: no backend dependencies for core functionality.
IaC generation, cost estimation, and security scanning run in-browser.

## 🔌 Integration Roadmap

| Integration | Status | Description |
|---|---|---|
| GitHub Actions | ⬜ Planned | Auto-generate Terraform plan on every PR |
| GitLab CI | ⬜ Planned | IaC pipeline templates |
| Terraform Cloud | ⬜ Planned | Remote state + API-driven runs |
| Pulumi Cloud | ⬜ Planned | Deployment tokens + stack management |

## 📦 Getting Started

### Prerequisites

*   **Docker** and **Docker Compose**.
*   Alternatively, **Node.js (v20+)** and **npm**.

### Running with Docker

1.  **Clone & Enter**:
    ```bash
    git clone https://github.com/wahidhendrawan/iac-webapps.git
    cd iac-webapps
    ```

2.  **Launch**:
    ```bash
    docker compose up -d --build
    ```

3.  **Access**: Open [http://localhost:8088](http://localhost:8088) in your browser.

## 🎨 Technology Stack

*   **Framework**: React 19, TypeScript
*   **Diagramming**: @xyflow/react (React Flow)
*   **State Management**: Zustand (with Persistence)
*   **AI Integration**: DeepSeek API & OpenAI API
*   **Styling**: Tailwind CSS (Dark Mode supported)
*   **Currency API**: Open Exchange Rates

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for the full text.

---

**IaC WebApps** - Created with ❤️ by [Wahid Hendrawan](https://wahidhendrawan.onrender.com/)
