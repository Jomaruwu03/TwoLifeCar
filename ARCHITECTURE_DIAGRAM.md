# 🏗️ TwoLifeCar Architecture Diagram

## Detailed System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            🌐 EXTERNAL ACCESS LAYER                            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
                              ┌─────────────────┐
                              │   👤 Users      │
                              │  (Browsers)     │
                              └─────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🔄 LOAD BALANCER LAYER                            │
│                                                                                 │
│    ┌─────────────────────────────────────────────────────────────────────┐    │
│    │                        Nginx Reverse Proxy                         │    │
│    │                          Port: 8080                                │    │
│    │                                                                     │    │
│    │  Routes:                                                           │    │
│    │  • /landing    → Landing Service (3000)                           │    │
│    │  • /dashboard  → Dashboard Service (3001)                         │    │
│    │  • /api        → API Service (5001)                               │    │
│    │  • /static     → Static Files                                     │    │
│    └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        │               │               │
                        ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🖥️ FRONTEND LAYER                                 │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   🌐 Landing    │    │  📊 Dashboard   │    │      🔧 API     │            │
│  │     Page        │    │     Admin       │    │    Backend      │            │
│  │                 │    │                 │    │                 │            │
│  │ React + Vite    │    │ React + Vite    │    │ Node.js + Exp   │            │
│  │ TypeScript      │    │ TypeScript      │    │ MongoDB Driver  │            │
│  │ Nginx Serve     │    │ Nginx Serve     │    │ CORS Enabled    │            │
│  │                 │    │                 │    │                 │            │
│  │ Port: 3000      │    │ Port: 3001      │    │ Port: 5001      │            │
│  │ Container: 5173 │    │ Container: 5173 │    │ Container: 5001 │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│           │                       │                       │                   │
│           └───────────────────────┼───────────────────────┘                   │
│                                   │                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              💾 DATABASE LAYER                                 │
│                                                                                 │
│              ┌─────────────────────────────────────────────────┐              │
│              │                 MongoDB 7                       │              │
│              │               (Jammy Base)                     │              │
│              │                                                 │              │
│              │  Collections:                                  │              │
│              │  • leads         (customer inquiries)          │              │
│              │  • users         (admin accounts)              │              │
│              │  • configs       (application settings)       │              │
│              │  • logs          (audit trail)                 │              │
│              │                                                 │              │
│              │  Port: 27017                                   │              │
│              │  Database: twolifecar_dev                      │              │
│              └─────────────────────────────────────────────────┘              │
│                                    │                                           │
│                                    ▼                                           │
│              ┌─────────────────────────────────────────────────┐              │
│              │              Docker Volumes                     │              │
│              │                                                 │              │
│              │  • mongodb_data     (persistent storage)       │              │
│              │  • mongodb_config   (configuration files)      │              │
│              └─────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌐 NETWORK LAYER                                  │
│                                                                                 │
│                    ┌───────────────────────────────────────┐                   │
│                    │        Docker Bridge Network          │                   │
│                    │      (twolifecar-network)            │                   │
│                    │                                       │                   │
│                    │  Internal DNS Resolution:             │                   │
│                    │  • api          → 172.18.0.2:5001   │                   │
│                    │  • dashboard    → 172.18.0.3:5173   │                   │
│                    │  • landing      → 172.18.0.4:5173   │                   │
│                    │  • mongodb      → 172.18.0.5:27017  │                   │
│                    │  • nginx        → 172.18.0.6:80     │                   │
│                    └───────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │    │    Nginx    │    │  Frontend   │    │     API     │
│   Request   │───▶│   Proxy     │───▶│   Service   │───▶│   Service   │
│             │    │   :8080     │    │ :3000/:3001 │    │    :5001    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                  │
                                                                  ▼
                                                        ┌─────────────┐
                                                        │  MongoDB    │
                                                        │   :27017    │
                                                        │  Database   │
                                                        └─────────────┘

1️⃣  User visits http://localhost:8080
2️⃣  Nginx routes to appropriate frontend (3000/3001)
3️⃣  Frontend loads and makes API calls to :5001
4️⃣  API processes request and queries MongoDB :27017
5️⃣  Data flows back through the chain to user
```

## 🚦 Service Dependencies

```
                          ┌─────────────┐
                          │   MongoDB   │◄─── Base Database
                          │   :27017    │
                          └─────────────┘
                                  ▲
                                  │ depends_on
                          ┌─────────────┐
                          │     API     │◄─── Business Logic
                          │   :5001     │
                          └─────────────┘
                                  ▲
                        ┌─────────┴─────────┐
                        │                   │ depends_on
                ┌─────────────┐    ┌─────────────┐
                │  Dashboard  │    │   Landing   │◄─── User Interface
                │   :3001     │    │   :3000     │
                └─────────────┘    └─────────────┘
                        ▲                   ▲
                        │                   │ depends_on
                        └─────────┬─────────┘
                                  │
                          ┌─────────────┐
                          │    Nginx    │◄─── Load Balancer
                          │   :8080     │
                          └─────────────┘
```

## 📊 Port Mapping Table

| Service   | Host Port | Container Port | Protocol | Status | Purpose                    |
|-----------|-----------|----------------|----------|--------|----------------------------|
| Landing   | 3000      | 5173          | HTTP     | ✅     | Public landing page        |
| Dashboard | 3001      | 5173          | HTTP     | ✅     | Admin dashboard            |
| API       | 5001      | 5001          | HTTP     | ✅     | REST API endpoints         |
| MongoDB   | 27017     | 27017         | TCP      | ✅     | Database connection        |
| Nginx     | 8080      | 80            | HTTP     | ✅     | Load balancer/Proxy        |

## 🔧 Environment Variables

### API Service
```bash
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://mongodb:27017/twolifecar_dev
```

### Frontend Services (Landing & Dashboard)
```bash
NODE_ENV=development
VITE_API_URL=http://localhost:5001
```

### MongoDB Service
```bash
MONGO_INITDB_DATABASE=twolifecar_dev
```

## 🛡️ Security Features

- **Network Isolation**: All services run in isolated Docker network
- **Non-root Users**: API runs with nodejs user (UID 1001)
- **CORS Configuration**: API configured with proper CORS headers
- **Input Validation**: API validates all incoming requests
- **Connection Limits**: MongoDB configured with connection pooling
- **Health Checks**: Built-in health monitoring for all services

## 📈 Performance Characteristics

### Resource Requirements
```
Service      CPU      Memory    Disk      Network
─────────────────────────────────────────────────
Landing      0.1%     ~50MB     ~100MB    Low
Dashboard    0.1%     ~50MB     ~100MB    Low
API          0.5%     ~100MB    ~50MB     Medium
MongoDB      1.0%     ~200MB    ~1GB      High
Nginx        0.1%     ~10MB     ~10MB     Medium
─────────────────────────────────────────────────
TOTAL        1.8%     ~410MB    ~1.26GB   Medium
```

### Scaling Capabilities
- **Horizontal**: Multiple frontend instances behind Nginx
- **Vertical**: Increase container resource limits
- **Database**: MongoDB replica sets for high availability
- **Load Balancing**: Nginx handles traffic distribution

## 🔍 Monitoring & Observability

### Health Check Endpoints
- **Landing**: `GET http://localhost:3000` → React app
- **Dashboard**: `GET http://localhost:3001` → React app  
- **API**: `GET http://localhost:5001/` → JSON response
- **MongoDB**: TCP connection test on port 27017
- **Nginx**: `GET http://localhost:8080` → Proxy status

### Logging Strategy
- **Application Logs**: stdout/stderr captured by Docker
- **Access Logs**: Nginx logs all incoming requests
- **Database Logs**: MongoDB query and connection logs
- **Container Logs**: Docker logs for each service

### Metrics Collection
```bash
# View real-time container stats
docker stats

# Monitor specific service
docker logs -f twolifecar-api-dev

# Check resource usage
docker system df
```

This architecture provides a robust, scalable, and maintainable foundation for the TwoLifeCar application with proper separation of concerns and comprehensive monitoring capabilities.
