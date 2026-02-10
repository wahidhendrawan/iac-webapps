# Terraform Builder Webapp

A modern, visual web application for generating Infrastructure as Code (IaC) configurations using Terraform. This tool simplifies the process of creating infrastructure for multi-cloud (AWS, Azure, Google Cloud) and on-premise (VMware vSphere) environments by providing an intuitive graphical interface.

## Features

* **Visual Resource Management**: Drag-and-drop or click-to-add resources from a comprehensive sidebar.
* **Multi-Cloud Support**: Configure resources for:
    * **AWS** (EC2, S3)
    * **Azure** (Virtual Machines)
    * **Google Cloud** (Compute Instances)
    * **VMware vSphere** (Virtual Machines)
    * **Local** (Files)
* **Real-Time Code Generation**: Instantly preview the generated Terraform HCL code as you configure your resources.
* **Live Syntax Highlighting**: View the generated code with syntax highlighting for better readability.
* **Property Configuration**: Dynamic forms based on resource schemas allow you to easily configure properties (e.g., AMI ID, instance type, machine type).
* **Copy & Download**: Quickly copy the generated code to your clipboard or download it as a `.tf` file.
* **Dockerized**: Run the entire application in a lightweight Docker container.

## Getting Started

### Prerequisites

* **Docker** and **Docker Compose** installed on your machine.
* Alternatively, **Node.js** (v18+) and **npm** for local development.

### Running with Docker Compose

The easiest way to run the application is using Docker Compose.

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/terraform-builder-webapp.git](https://github.com/your-username/terraform-builder-webapp.git)
    cd terraform-builder-webapp
    ```

2.  Start the application:
    ```bash
    docker compose up -d
    ```

3.  Access the web interface at:
    ```
    http://localhost:8080
    ```

4.  To stop the application:
    ```bash
    docker compose down
    ```

### Running Locally (Development)

To run the application locally for development:

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Access the application at `http://localhost:5173`.

4.  To build for production:
    ```bash
    npm run build
    ```

## Usage

1.  **Select a Provider**: Browse the sidebar on the left to find the provider you want to use (e.g., AWS, Azure).
2.  **Add a Resource**: Click on a resource type (e.g., "EC2 Instance") to add it to your project.
3.  **Configure Properties**: Select the added resource in the project tree. The center panel will display a form where you can configure its properties (e.g., AMI ID, Instance Type).
4.  **Preview Code**: The right panel displays the generated Terraform HCL code in real-time.
5.  **Export**: Use the "Copy" or "Download" buttons in the top-right corner of the code preview panel to save your configuration.

## Technologies Used

* **Frontend**: React, TypeScript, Vite
* **Styling**: Tailwind CSS
* **State Management**: Zustand
* **Icons**: Lucide React
* **Code Highlighting**: React Syntax Highlighter
* **Containerization**: Docker, Nginx

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.