# Job Application Tracker — DevOps Setup Guide

## 📦 Tech Stack
- **Docker** — Containerization
- **Docker Compose** — Multi-container orchestration
- **GitHub Actions** — CI (Test + Build + Push to DockerHub)
- **Jenkins** — CD (Pull image + Deploy containers)

---

## 🗂️ Project Structure

```
job-application-tracker/
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── ci.yml          ← GitHub Actions CI pipeline
├── docker-compose.yml      ← Runs all services together
├── Jenkinsfile             ← Jenkins CD pipeline
├── .env.example            ← Environment variable template
└── .gitignore
```

---

## 🚀 Full Pipeline Flow

```
You push code to GitHub
        ↓
GitHub Actions triggers automatically
        ↓
Runs tests (backend + frontend)
        ↓
Builds Docker images
        ↓
Pushes images to DockerHub
        ↓
Triggers Jenkins via webhook
        ↓
Jenkins pulls latest images
        ↓
Jenkins runs docker-compose up
        ↓
App is live! ✅
```

---

## ⚙️ Step-by-Step Setup

### STEP 1 — Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets and Variables → Actions → New secret

Add these secrets:
| Secret Name | Value |
|---|---|
| `DOCKERHUB_USERNAME` | `koteswaraprasad` |
| `DOCKERHUB_TOKEN` | Your DockerHub Access Token |
| `JENKINS_URL` | Your Jenkins server IP + port e.g. `192.168.1.10:8080` |
| `JENKINS_USER` | Jenkins username e.g. `admin` |
| `JENKINS_TOKEN` | Jenkins API token |

> **Get DockerHub Token:** hub.docker.com → Account Settings → Security → New Access Token

---

### STEP 2 — Start Jenkins Locally

```bash
docker-compose up -d jenkins
```

Then open: **http://localhost:8080**

Get the initial admin password:
```bash
docker exec job-tracker-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

- Install suggested plugins
- Create your admin user
- Install the **Docker Pipeline** plugin

---

### STEP 3 — Add Credentials in Jenkins

Go to Jenkins → Manage Jenkins → Credentials → Add:

1. **DockerHub credentials**
   - Kind: Username with password
   - ID: `dockerhub-credentials`
   - Username: `koteswaraprasad`
   - Password: Your DockerHub token

2. **GitHub credentials**
   - Kind: Username with password
   - ID: `github-credentials`
   - Username: Your GitHub username
   - Password: Your GitHub personal access token

---

### STEP 4 — Create Jenkins Pipeline Job

1. New Item → Pipeline
2. Name it: `job-tracker-deploy`
3. Under Pipeline → Definition: **Pipeline script from SCM**
4. SCM: Git
5. Repository URL: your GitHub repo URL
6. Script Path: `Jenkinsfile`
7. Save

---

### STEP 5 — Copy .env file

```bash
cp .env.example .env
# Edit .env with your actual values
nano .env
```

---

### STEP 6 — Run Everything Locally (without Jenkins)

```bash
docker-compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Jenkins | http://localhost:8080 |
| MongoDB | localhost:27017 |

---

### STEP 7 — Push Code and Watch Pipeline Run

```bash
git add .
git commit -m "Add DevOps setup"
git push origin main
```

Then watch:
- **GitHub Actions** tab in your repo for CI pipeline
- **Jenkins** dashboard at http://localhost:8080 for CD pipeline

---

## 🔐 Important Security Notes

- Never commit `.env` to GitHub (it's in `.gitignore`)
- Use DockerHub Access Tokens, not your password
- Change the default MongoDB password in production
- Use a strong `JWT_SECRET` value

---

## 🛑 Useful Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Remove all containers + volumes (fresh start)
docker-compose down -v
```
