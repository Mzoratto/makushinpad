# 🚀 Deployment Scripts

This directory contains deployment scripts for The Shin Shop project.

## 📁 Files

### `build-backend.sh`
Script to build the Medusa.js backend for deployment. Ensures the build happens from the correct directory.

**Usage:**
```bash
./deployment/build-backend.sh
```

### `start-backend.sh`
Script to start the Medusa.js backend server. Ensures the server starts from the correct directory.

**Usage:**
```bash
./deployment/start-backend.sh
```

## 🔧 Render Deployment

The main deployment configuration is in `medusa-backend/render.yaml`. These scripts were created as a fallback solution but are currently not used since the `rootDir` approach in render.yaml works correctly.

## 📋 Current Deployment Process

1. **Render detects changes** in the GitHub repository
2. **Builds from `medusa-backend/` directory** using `rootDir: ./medusa-backend`
3. **Runs build command**: `npm install && npm run build:prod`
4. **Starts server**: `npm run start`
5. **Server binds to**: `0.0.0.0:10000` for Render compatibility

## 🛠️ Troubleshooting

If deployment fails, these scripts can be used as an alternative by updating `medusa-backend/render.yaml`:

```yaml
buildCommand: ../deployment/build-backend.sh
startCommand: ../deployment/start-backend.sh
```
