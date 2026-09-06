# Farmfinancer 🌾

Agricultural Loan & Finance Management Application built with Angular 10, ASP.NET Core 6.0 Web API, and Entity Framework Core.

## 🚀 Live Deployments

- **Frontend (Vercel)**: [https://farmfinancer-app.vercel.app](https://farmfinancer-app.vercel.app)
  - Alternative Mirror: [https://farm-financer.vercel.app](https://farm-financer.vercel.app)
- **Backend API (Render)**: [https://farmfinancer-api.onrender.com](https://farmfinancer-api.onrender.com)
  - API Health Check: [https://farmfinancer-api.onrender.com/health](https://farmfinancer-api.onrender.com/health)
  - Swagger Documentation: [https://farmfinancer-api.onrender.com/swagger](https://farmfinancer-api.onrender.com/swagger)

## 🔐 Demo Credentials

| Role | Email | Password | Admin Key (Registration) |
|---|---|---|---|
| **Admin** | `admin@farmfinancer.com` | `Admin@123` | `A123` |
| **Farmer (User)** | `farmer@farmfinancer.com` | `User@123` | N/A |

## 🛠️ Tech Stack

- **Frontend**: Angular 10, Bootstrap, Google reCAPTCHA, RxJS
- **Backend**: ASP.NET Core 6.0 Web API, JWT Authentication, EF Core In-Memory / MSSQL
- **CI/CD**: GitHub Actions (Gitleaks Secret Scanning, .NET Build/Test, Angular Build/Test, Automated Deployments)
- **Hosting**: Vercel (Frontend SPA) + Render (Backend API Container)