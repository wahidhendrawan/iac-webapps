# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-01

### Added
- **SARIF export** for security findings, enabling integration with GitHub Security tab and other SARIF-compatible tools.
- **Expanded IaC security scanner** with 60+ rules covering AWS, Azure, GCP, and Kubernetes misconfigurations.
- **GitHub Actions workflow** for automated SARIF upload to GitHub Security.
- **Architecture guide** at `docs/architecture.md` documenting component design, data flow, and extension points.
- **CODEOWNERS** file for code review assignments.

### Changed
- Enhanced security scanner with comprehensive rule coverage for cloud platforms.
- Tuned Dependabot configuration to reduce bulk updates.

## [0.0.0] - 2026-07-25

Initial release with basic IaC configuration generator and security scanning capabilities.
