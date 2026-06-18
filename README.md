[![CI](https://github.com/wahidhendrawan/iac-webapps/actions/workflows/ci.yml/badge.svg)](https://github.com/wahidhendrawan/iac-webapps/actions/workflows/ci.yml)

# IaC WebApps (v1.7.0)

A powerful, multi-tool visual platform for generating and managing Infrastructure as Code (IaC) configurations. Design your infrastructure visually and instantly generate production-ready code for **Terraform, OpenTofu, Pulumi, or Helm Charts**.

[![Project Status](https://img.shields.io/badge/status-active-emerald.svg)]()
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Creator](https://img.shields.io/badge/created%20by-Wahid%20Hendrawan-indigo.svg)](https://wahidhendrawan.onrender.com/)

## 🚀 Key Features

*   **Multi-Tool Support**: Seamlessly switch between **Terraform**, **OpenTofu**, **Pulumi (TypeScript)**, and **Helm Charts**.
*   **DeepSeek AI Assistant**: Intelligent Copilot that can understand natural language and automatically add resources to your project using **DeepSeek-V3** or **GPT-4o**.
*   **Real-Time Cost Estimator**: Track your infrastructure spending with a breakdown of hourly, daily, and monthly costs, featuring **real-time USD to IDR currency conversion**.
*   **Visual Designer (Drag & Drop)**: Interactive canvas powered by **React Flow** with synchronized editing and automated relationship mapping.
*   **Architecture Templates**: Start fast with pre-configured blueprints (e.g., 3-Tier Network, Hybrid Cloud, K8s Stack).
*   **HCL Importer**: Reverse engineer existing Terraform `.tf` files into visual diagrams instantly.
*   **DevSecOps Security Scanner**: Real-time static analysis to detect vulnerabilities (e.g., public S3 buckets, open SSH ports) before deployment.
*   **Advanced Logic**: Support for Modules, Remote State Backends, and Resource Dependencies.

## 🛠 Supported Providers

*   **Public Cloud**: AWS, Azure, Google Cloud, Alibaba Cloud, Huawei Cloud.
*   **Container/K8s**: Kubernetes (Deployments, Services, Helm).
*   **On-Premise/Hybrid**: VMware vSphere, Proxmox VE, Sangfor HCI.
*   **Local**: Local File System management.

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
