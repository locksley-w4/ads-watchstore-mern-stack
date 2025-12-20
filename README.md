# Ads Watch Store

E-commerce platform for watches with advertising features.

## Features

- Product catalog with search and filtering
- User authentication and shopping cart
- Product/category/brand management
- Order tracking
- Advertising banners

## Tech Stack

**Frontend:** React 19, React Router, Axios  
**Backend:** Node.js, Express 5, MongoDB, Mongoose  
**Auth:** JWT, bcrypt, express-session  
**DevOps:** Docker, Nginx, Terraform (GCP), Ansible
Cloud integration may be fully implemented later. For now, let it reside in this repo...

## Prerequisites

- Node.js v14+
- Docker & Docker Compose
- MongoDB
- GCP account (for cloud deployment)

## Installation

### Local Development

1. Clone and install dependencies:
```bash
git clone https://github.com/yourusername/ads_watchstore.git
cd ads_watchstore

cd app/server && npm install
cd ../client && npm install
```

2. Configure environment (`app/server/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

3. Start servers:
```bash
# Backend
cd app/server && node src/index.js

# Frontend (new terminal)
cd app/client && npm start
```

### Docker

```bash
cd app
docker-compose up -d
```

Access at `http://localhost`

## Cloud Deployment

### Terraform (GCP)

```bash
cd terraform
terraform init
terraform apply
```

### Ansible

```bash
ansible-playbook -i ansible/inventory/inventory.yml ansible/playbooks/install_packages.yml
ansible-playbook -i ansible/inventory/inventory.yml ansible/playbooks/run_container.yml
```

## Project Structure

```
app/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── Dockerfile
├── server/          # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middlewares/
│   └── Dockerfile
└── docker-compose.yml

terraform/           # GCP infrastructure
ansible/             # Configuration management
```

## API Endpoints

**Auth:** `POST /v1/auth/{register,login,logout}`  
**User:** `GET /v1/user`, `PUT /v1/user`, `PUT /v1/user-password`  
**Products:** `GET /v1/products`, `GET /v1/product`, `POST /v1/product`, `PUT /v1/product/:id`, `DELETE /v1/product`  
**Categories:** `GET /v1/categories`, `POST /v1/category`  
**Brands:** `GET /v1/brands`, `POST /v1/brands`  
**Cart:** `GET /v1/cart`, `PUT /v1/cart/set/:productId`, `DELETE /v1/cart`  
**Marketing:** `GET /v1/offer-list`

## License

ISC
