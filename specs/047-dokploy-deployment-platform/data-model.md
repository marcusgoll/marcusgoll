# Data Model: dokploy-deployment-platform

## Overview

This feature is an infrastructure enhancement with no application-level data models. All data models are internal to Dokploy (deployment history, environment variables, monitoring metrics).

## Existing Entities (No Changes)

### Post
**Purpose**: Blog post content (unchanged)

**Fields**:
- `id`: UUID (PK)
- `slug`: String - URL-friendly identifier
- `title`: String - Post title
- `content`: Text - MDX content
- `published_at`: Timestamp
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Impact**: None - Dokploy is deployment abstraction layer

---

### Subscriber
**Purpose**: Newsletter subscribers (unchanged)

**Fields**:
- `id`: UUID (PK)
- `email`: String - Subscriber email
- `subscribed_at`: Timestamp
- `status`: Enum (active, unsubscribed)

**Impact**: None - Dokploy is deployment abstraction layer

---

## Dokploy Internal Entities (Not in Application Database)

These entities are managed by Dokploy's internal storage (not exposed to application).

### Application
**Purpose**: Configured Next.js application in Dokploy

**Managed by**: Dokploy UI
**Storage**: Dokploy internal database

**Fields** (inferred from Dokploy docs):
- Application ID
- Name: "marcusgoll"
- Repository: "https://github.com/marcusgoll/marcusgoll"
- Branch: "main"
- Build command: "npm run build"
- Start command: "npm run start"
- Domain: "marcusgoll.com"
- Environment variables: key-value pairs

**Access**: Via Dokploy UI or CLI

---

### Deployment
**Purpose**: Deployment history and logs

**Managed by**: Dokploy UI
**Storage**: Dokploy internal database

**Fields** (inferred):
- Deployment ID
- Commit SHA
- Status: pending, building, deploying, success, failed
- Started at: Timestamp
- Completed at: Timestamp
- Duration: Seconds
- Logs: Text (stdout/stderr)

**Access**: Via Dokploy UI (deployment history page)

---

### Environment Variable
**Purpose**: Application secrets and configuration

**Managed by**: Dokploy UI
**Storage**: Dokploy internal database (encrypted)

**Fields** (inferred):
- Variable ID
- Key: String (e.g., DATABASE_URL)
- Value: String (masked in UI)
- Application ID: Foreign key
- Updated at: Timestamp

**Security**: Encrypted at rest per NFR-006

---

### Database Backup
**Purpose**: Automated PostgreSQL backups

**Managed by**: Dokploy backup system
**Storage**: VPS filesystem or S3

**Fields** (inferred):
- Backup ID
- Database name
- Timestamp
- Size: Bytes
- Retention: 7 days (per FR-011)

**Access**: Via Dokploy UI (database backups page)

---

## Database Schema (Application - No Changes)

No schema changes required. Dokploy operates at infrastructure layer above application database.

**Application Database** (PostgreSQL via Supabase):
- Existing tables: posts, subscribers, etc. (unchanged)
- Dokploy only manages connection string, not schema

---

## Configuration as Data

### Dokploy Configuration Export (Version Controlled)

**Purpose**: Disaster recovery, infrastructure as code

**Format**: YAML (exported via Dokploy CLI)

**Example Structure**:
```yaml
# specs/047-dokploy-deployment-platform/configs/dokploy-config.yaml
version: 1.0
applications:
  - name: marcusgoll
    repository: https://github.com/marcusgoll/marcusgoll
    branch: main
    buildCommand: npm run build
    startCommand: npm run start
    domains:
      - marcusgoll.com
      - www.marcusgoll.com
    environment:
      - key: NODE_ENV
        value: production
      # Secrets stored separately, not in version control

databases:
  - name: marcusgoll-postgres
    type: postgresql
    version: 15
    backupSchedule: daily
    backupRetention: 7
```

**Storage**: `specs/047-dokploy-deployment-platform/configs/` (version controlled)

**Use Case**: Recreate Dokploy setup if VPS lost (per US8)

---

## API Schemas

No application API changes. Dokploy API is internal to platform.

**Dokploy REST API** (used by CLI):
- GET `/api/applications` - List applications
- POST `/api/applications` - Create application
- GET `/api/deployments` - Deployment history
- POST `/api/deployments/:id/rollback` - Rollback deployment

**Access**: Authenticated via Dokploy admin token (not exposed to public)

---

## State Shape (No Frontend Changes)

No frontend state changes. Dokploy UI is separate admin interface.

**Application Frontend**: Unchanged (marcusgoll.com)
**Admin Interface**: Dokploy UI (deploy.marcusgoll.com) - managed by Dokploy

---

## Migration Impact

**Database Migrations**: None required (no schema changes)

**Configuration Migration**:
1. Export environment variables from VPS `.env.production`
2. Import into Dokploy UI (one-time manual process)
3. Delete VPS `.env.production` after validation

**Rollback**: Keep backup of `.env.production` for 7 days

