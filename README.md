# IaC WebApps (v1.0.0)

A powerful, multi-tool visual platform for generating and managing Infrastructure as Code (IaC) configurations. Design your infrastructure visually and instantly generate production-ready code for **Terraform, OpenTofu, or Pulumi**.

[![Project Status](https://img.shields.io/badge/status-active-emerald.svg)]()
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Creator](https://img.shields.io/badge/created%20by-Wahid%20Hendrawan-indigo.svg)](https://wahidhendrawan.onrender.com/)

## 🚀 Key Features

*   **Multi-Tool Support**: Seamlessly switch between **Terraform**, **OpenTofu**, and **Pulumi (TypeScript)**.
*   **Visual Designer (Drag & Drop)**: Interactive canvas powered by **React Flow** for designing infrastructure topology with automated relationship mapping.
*   **Architecture Templates**: Start fast with pre-configured blueprints (e.g., AWS Web Server, Azure VM).
*   **Advanced Logic**: Support for **Terraform Modules**, **Remote State Backends** (S3, GCS, Azure), and **Resource Dependencies**.
*   **DevOps & CI/CD**: Automatic generation of **GitHub Actions** and **GitLab CI** pipelines.
*   **Real-Time Generation & Validation**: Live code preview with syntax highlighting and schema validation to catch errors early.
*   **Full Project Export**: Download a complete, structured project (ZIP) ready for deployment.

## 🛠 Supported Providers

*   **Public Cloud**: AWS, Azure, Google Cloud, Alibaba Cloud, Huawei Cloud.
*   **On-Premise/Hybrid**: VMware vSphere, Proxmox VE, Sangfor HCI.
*   **Local**: Local File System management.

## 📦 Getting Started

### Prerequisites

*   **Docker** and **Docker Compose**.
*   Alternatively, **Node.js (v20+)** and **npm** for development.

### Running with Docker

The fastest way to experience IaC WebApps:

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

### Local Development

1.  Install dependencies: `npm install`
2.  Start dev server: `npm run dev`
3.  Build for production: `npm run build`

## 🎨 Technology Stack

*   **Framework**: React 19, TypeScript
*   **Design**: Tailwind CSS, Framer Motion
*   **Diagramming**: @xyflow/react (React Flow)
*   **State**: Zustand
*   **Deployment**: Docker, Nginx

## 📜 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for the full text.

---

**IaC WebApps** - Created with ❤️ by [Wahid Hendrawan](https://wahidhendrawan.onrender.com/)
