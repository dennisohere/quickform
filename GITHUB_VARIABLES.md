# GitHub Variables Setup

This document explains how to configure GitHub repository variables for automated deployment.

## 🔧 Required GitHub Variables

Set these in your GitHub repository: **Settings → Secrets and variables → Actions → Variables**

### VPS Configuration

| Variable   | Description         | Example                           |
| ---------- | ------------------- | --------------------------------- |
| `VPS_HOST` | Your VPS IP address | `192.3.24.5`                      |
| `VPS_USER` | SSH user for VPS    | `root`                            |
| `VPS_PATH` | Project path on VPS | `/var/projects/quickform/sandbox` |

### SSL Configuration (Optional)

| Variable     | Description                | Example                 |
| ------------ | -------------------------- | ----------------------- |
| `SSL_DOMAIN` | Your domain name           | `quickform.example.com` |
| `SSL_EMAIL`  | Email for SSL certificates | `admin@example.com`     |

### Database Configuration

| Variable      | Description       | Example                |
| ------------- | ----------------- | ---------------------- |
| `DB_DATABASE` | Database name     | `quickform_db`         |
| `DB_USERNAME` | Database user     | `postgres`             |
| `DB_PASSWORD` | Database password | `your_secure_password` |

## 🔐 Required GitHub Secrets

Set these in your GitHub repository: **Settings → Secrets and variables → Actions → Secrets**

| Secret            | Description                    |
| ----------------- | ------------------------------ |
| `SSH_PRIVATE_KEY` | Private SSH key for VPS access |

## 🚀 How It Works

### 1. Automatic Deployment

When you push to specific branches, GitHub Actions automatically deploys:

- **`main`** → Production environment
- **`staging`** → Staging environment
- **`sandbox`** → Sandbox environment

### 2. Manual Deployment

You can also trigger manual deployments with custom settings:

1. Go to **Actions → Deploy QuickForm → Run workflow**
2. Choose environment (sandbox/staging/production)
3. Optionally enable force rebuild or volume clearing
4. Click **Run workflow**

### 3. Environment-Specific Configuration

The workflow uses GitHub repository variables for configuration:

- **PROJECT_PORT**: Set the port for your environment
- **PROJECT_NAME**: Set the project name
- **FORCE_REBUILD**: Set to "true" to force rebuild containers
- **CLEAR_VOLUMES**: Set to "true" to clear project volumes

For multiple environments, you can set different values in GitHub repository variables.

## 📋 Variable Priority

The deployment script uses variables in this order:

1. **Manual Input** (workflow_dispatch inputs - highest priority)
2. **GitHub Variables** (repository variables)
3. **Default values** (in workflow and deploy.sh)

### Example: PROJECT_NAME

```bash
# If set in manual input: PROJECT_NAME = "myapp"
# Then the script uses: PROJECT_NAME = "myapp"

# If set in GitHub Variables: PROJECT_NAME = "quickform"
# Then the script uses: PROJECT_NAME = "quickform"

# If not set anywhere
# Then the script uses: PROJECT_NAME = "quickform" (default)
```

## 🔍 Checking Variable Values

The deployment script shows which variables are being used:

```bash
🔧 Configuration Sources:
✅ Running in GitHub Actions
  GitHub Variables:
    PROJECT_NAME: myapp
    PROJECT_PORT: 8082
    FORCE_REBUILD: true
    CLEAR_VOLUMES: false
```

## 🛠️ Setup Instructions

### Step 1: Add SSH Key to VPS

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions"
ssh-copy-id -i ~/.ssh/id_rsa.pub root@your-vps-ip
```

### Step 2: Add SSH Private Key to GitHub

1. Copy your private key content:
    ```bash
    cat ~/.ssh/id_rsa
    ```
2. Go to GitHub repository → Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Name: `SSH_PRIVATE_KEY`
5. Value: Paste your private key content

### Step 3: Add Repository Variables

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click **Variables** tab
3. Add each variable from the table above

### Step 4: Test Deployment

1. Push to `sandbox` branch
2. Check Actions tab for deployment status
3. Verify your application is accessible

## 🔧 Customization Examples

### Different Project Names

```bash
# Set in GitHub Variables
PROJECT_NAME = "myapp"
PROJECT_PORT = "9090"
```

### Force Rebuild on Every Deployment

```bash
# Set in GitHub Variables
FORCE_REBUILD = "true"
```

### Clear Volumes for Fresh Start

```bash
# Set in GitHub Variables
CLEAR_VOLUMES = "true"
```

### Multiple Environments

```bash
# Production
VPS_PATH = "/var/projects/quickform/production"
PROJECT_PORT = "8080"
PROJECT_NAME = "quickform-prod"

# Staging
VPS_PATH = "/var/projects/quickform/staging"
PROJECT_PORT = "8082"
PROJECT_NAME = "quickform-staging"

# Sandbox
VPS_PATH = "/var/projects/quickform/sandbox"
PROJECT_PORT = "8084"
PROJECT_NAME = "quickform-sandbox"
```

**Note**: For truly separate environments, you might want to use different GitHub repositories or different variable sets.

## 🚨 Security Notes

- **Never commit secrets** to your repository
- **Use strong passwords** for database
- **Rotate SSH keys** regularly
- **Limit SSH access** to specific IPs if possible
- **Monitor deployment logs** for any issues

## 📞 Troubleshooting

### Common Issues

**1. SSH Connection Failed**

- Verify SSH private key is correct
- Check VPS firewall settings
- Ensure VPS_HOST is accessible

**2. Permission Denied**

- Verify VPS_USER has proper permissions
- Check VPS_PATH exists and is writable

**3. Port Already in Use**

- Change PROJECT_PORT in GitHub Variables
- Check what's running on the port

**4. Database Connection Issues**

- Verify database credentials
- Check if database service is running
- Use CLEAR_VOLUMES=true for fresh start

### Debug Mode

To see more detailed output, you can temporarily add debug variables:

```bash
# Set in GitHub Variables for debugging
FORCE_REBUILD = "true"
CLEAR_VOLUMES = "true"
```

This will show more verbose output and help identify issues.
