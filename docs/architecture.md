# Architecture: IaC WebApps

## Purpose

IaC WebApps is a browser-based, client-side SPA for visually designing infrastructure and generating production-ready IaC configurations. Users drag-and-drop cloud resources onto a canvas, configure properties in a form, and export to Terraform, OpenTofu, Pulumi (TypeScript), or Helm Charts. An integrated DevSecOps scanner identifies common misconfigurations before deployment.

## Architecture Overview

```
Browser SPA (React 19 + TypeScript)
  ├─ Visual Designer (React Flow canvas)
  ├─ Configuration Form (resource properties)
  ├─ Code Preview (HCL / Pulumi TS / Helm YAML)
  ├─ Security Scanner (static analysis)
  ├─ AI Copilot (DeepSeek / OpenAI)
  └─ Zustand Store (persisted state)
```

**Key constraint**: No backend for core functionality. IaC generation, cost estimation, and security scanning run entirely in-browser. API keys for AI providers are stored only in session memory, never persisted to localStorage.

## Design & Components

### Core State (`src/store.ts`)

Zustand store with `persist` middleware (localStorage):
- `resources: Resource[]` — canvas nodes with type, name, properties, position
- `selectedResourceId: string | null` — current form context
- `providerSettings: AllProviderSettings` — per-provider config (regions, credentials)
- `backend: BackendConfig | null` — remote state backend config
- `devopsSettings: DevOpsSettings` — CI/CD provider, branch name
- `iacTool: IaCTool` — `terraform` | `opentofu` | `pulumi` | `helm`
- `aiSettings: AISettings` — AI provider + API key (key not persisted)

Sensitive fields (password, secret, token, api_key, etc.) are stripped before persistence via `stripSensitiveProviderSettings()`.

### Data Model (`src/types.ts`)

```typescript
interface Resource {
  id: string;
  type: ResourceType;      // e.g., 'aws_instance', 'kubernetes_deployment'
  name: string;
  properties: Record<string, unknown>;
  position?: { x: number; y: number };
}

interface ResourceSchema {
  type: ResourceType;
  provider: ProviderType;
  name: string;
  description: string;
  fields: ResourceField[];
}
```

Provider/resource schemas are defined in `src/data/providers.ts` and `src/data/templates.ts`.

### IaC Generators (`src/utils/`)

| Generator | Output | Key Function |
|---|---|---|
| `generator.ts` | Terraform / OpenTofu HCL | `generateHCL()`, `generateTerraformFiles()` |
| `pulumiGenerator.ts` | Pulumi TypeScript | `generatePulumiFiles()` |
| `helmGenerator.ts` | Helm Chart YAML | `generateHelmFiles()` |
| `hclParser.ts` | Reverse import | `parseHCL()` — converts existing `.tf` to resources |

All generators accept `Resource[]` + provider settings + optional backend/devops config and return `TerraformFile[]` (filename + content pairs).

### Security Scanner (`src/utils/securityScanner.ts`)

Static analysis on `Resource[]` returning `SecurityFinding[]`:
- Checks for public S3 buckets, open SSH/HTTP security groups, hardcoded secrets
- Severity levels: `low`, `medium`, `high`, `critical`
- Used by `SecurityReport.tsx` component
- SARIF export via `sarifExport.ts`

### AI Copilot (`src/components/AICopilot.tsx`)

Natural language → resource creation via DeepSeek-V3 or OpenAI GPT-4o:
- User describes infrastructure in plain text
- AI returns resource definitions matching provider schemas
- API key stored only in session (not persisted)

### Visual Designer (`src/components/VisualDesigner.tsx`)

React Flow canvas:
- Nodes represent `Resource` objects
- Drag from palette to add; click to select
- Position updates flow back to store via `updateResourcePosition()`
- Edge connections represent dependencies (future)

## Data Flow

```
User adds resource (sidebar drag / AI / template)
  ↓
store.addResource(type) → create Resource with default properties
  ↓
Visual Designer renders node; Configuration Form shows fields
  ↓
User edits properties → store.updateResource(id, updates)
  ↓
CodePreview re-runs generator → HCL / Pulumi / Helm
  ↓
Security Scanner analyzes → findings displayed in SecurityReport modal
  ↓
User downloads code or exports as ZIP (jszip)
```

## Interfaces

### UI Components (`src/components/`)

- `Header.tsx` — app header, theme toggle, global actions
- `Sidebar.tsx` — resource palette grouped by provider
- `VisualDesigner.tsx` — React Flow canvas
- `ConfigurationForm.tsx` — property editor for selected resource
- `CodePreview.tsx` — tabbed code viewer with syntax highlighting (react-syntax-highlighter)
- `SecurityReport.tsx` — scanner findings modal
- `AICopilot.tsx` — chat interface for AI-assisted design
- `TemplateGallery.tsx` — pre-built infrastructure blueprints
- `BackendSettings.tsx` — remote state backend config
- `DevOpsSettings.tsx` — CI/CD integration settings
- `ProviderSettings.tsx` — per-provider configuration
- `About.tsx` — project info

### Export Formats

1. **Single HCL file**: Concatenated `versions.tf` + `provider.tf` + `variables.tf` + `main.tf` + `outputs.tf`
2. **Multiple files**: `generateTerraformFiles()` returns `TerraformFile[]`
3. **ZIP download**: jszip bundles all files for download
4. **Pulumi TypeScript**: `index.ts` + `Pulumi.yaml`
5. **Helm Chart**: `Chart.yaml` + `values.yaml` + `templates/`

## Local Development

```bash
# Install dependencies
npm ci

# Dev server with hot reload
npm run dev          # http://localhost:5173

# Type checking
npm run build        # tsc -b && vite build

# Linting
npm run lint         # eslint .

# Testing (Vitest)
npm run test         # vitest run
npm run test:watch   # vitest watch
npm run coverage     # vitest run --coverage

# Preview production build
npm run preview      # http://localhost:4173

# Docker
docker compose up -d --build   # http://localhost:8088
```

Coverage thresholds (70% statements/lines/functions, 60% branches) enforced in `vitest.config.ts`.

## Extension Points

1. **Add a resource type**: Define `ResourceSchema` in `src/data/providers.ts` under the appropriate provider, add `ResourceType` union member
2. **Add a provider**: Extend `ProviderType`, add provider config to `PROVIDERS` array, implement any provider-specific fields
3. **Add IaC generator**: Create new generator in `src/utils/`, integrate into `CodePreview.tsx` switch on `iacTool`
4. **Add security rule**: Extend `scanResources()` in `securityScanner.ts` with new check returning `SecurityFinding`
5. **Add template**: Define in `src/data/templates.ts:ARCHITECTURE_TEMPLATES` with resource list
6. **Add AI provider**: Extend `AIProvider` type, add API integration in `AICopilot.tsx`

## Security Notes

- Sensitive fields (passwords, tokens, API keys) are never persisted to localStorage
- CSP headers configured in `nginx.conf` restrict external resources
- Docker container runs as non-root user (`appuser:appgroup`)
- Healthcheck on `:8080` every 30s
- No backend API calls for core functionality (AI features require user-provided API key)
