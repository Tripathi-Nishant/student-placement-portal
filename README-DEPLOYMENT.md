# Student Placement Portal — AWS EC2 deployment

This repository already contains the React/Vite frontend, Express API and PostgreSQL schema.
The `infra/cloudformation.yaml` template provisions the AWS infrastructure and configures the app.

## Repository layout

```text
student-placement-portal/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── db.js
│       └── server.js
├── database/
│   └── init.sql
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── infra/
│   └── cloudformation.yaml
├── .gitignore
└── README.md
```

Do not delete or replace the existing `backend`, `database`, or `frontend` folders.

## Push the deployment template to GitHub

From the root of your cloned repository:

```bash
mkdir -p infra
# Copy cloudformation.yaml into infra/cloudformation.yaml
git add infra/cloudformation.yaml README-DEPLOYMENT.md
git commit -m "Add AWS CloudFormation deployment"
git push origin main
```

If you put this deployment guide in the root as `README-DEPLOYMENT.md`, add that file too.
The CloudFormation template clones this public repository when the EC2 instance starts.

## Deploy in AWS

1. Open AWS Console → CloudFormation → Create stack → With new resources (standard).
2. Select **Upload a template file** and upload `infra/cloudformation.yaml` from your local checkout.
3. Set stack name: `StudentPlacementPortal`.
4. Set `KeyPairName` to an existing EC2 key pair in the selected AWS Region.
5. Set `SSHLocation` to your current public IP in CIDR form, such as `198.51.100.25/32`.
6. Set `InstanceType` to `t3.small` for this classroom demo.
7. Enter a strong `DBPassword` (12–41 allowed characters; do not use a single quote).
8. Leave `RepositoryUrl` at the default unless you forked the repository.
9. Continue through the wizard and create the stack.

Wait for the stack to reach `CREATE_COMPLETE`. Then open the stack's **Outputs** tab:
- `PortalURL`: open the website.
- `APIHealthURL`: should return `{"status":"ok","service":"placement-api","database":"connected"}`.
- `SSHCommand`: use it after replacing `YOUR_KEY.pem`.

**Important:** CloudFormation can finish creating EC2 before its user-data script has finished. If the website is not ready yet, wait a few more minutes and check the bootstrap log over SSH:

```bash
sudo tail -n 150 /var/log/placement-portal-bootstrap.log
sudo systemctl status placement-api
sudo systemctl status postgresql
sudo systemctl status nginx
```

## Application configuration expected by this template

Backend `.env` is generated on EC2 and is not committed to GitHub:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=placement_portal
DB_USER=placement_user
DB_PASSWORD=<provided securely during CloudFormation stack creation>
```

Frontend `.env.production` is generated before Vite build:

```env
VITE_API_URL=/api
```

Nginx serves the built React app on port 80 and reverse-proxies `/api` to `127.0.0.1:5000`.
The security group does not expose ports 5000 or 5432 publicly.

## Security and cleanup

- Never commit `.env`, database passwords, private keys, or credentials.
- Restrict SSH to your own public IP `/32`.
- This is a teaching/demo deployment, not a production-hardened portal.
- EC2 and EBS can incur AWS charges. Delete the CloudFormation stack when finished to remove the resources created by this template.
