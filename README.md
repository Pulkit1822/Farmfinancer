# **FARM FINANCER**

## **1. OVERALL PROJECT STRUCTURE**

This is a **full-stack web application** for managing farm financing and loans, built with:
- **Frontend**: Angular 10 (TypeScript)
- **Backend**: ASP.NET Core 6.0 Web API (C#)
- **Database**: SQL Server with Entity Framework Core
- **Architecture**: RESTful API with JWT Authentication

### **Project Folder Structure**

```
├── angularapp/                    # Frontend Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # UI Components (24 components)
│   │   │   ├── models/           # TypeScript Data Models
│   │   │   ├── services/         # Angular Services (API calls)
│   │   │   ├── app.module.ts     # Main Angular Module
│   │   │   └── app-routing.module.ts  # Route Configuration
│   │   ├── assets/               # Static assets
│   │   ├── environments/         # Environment configs
│   │   └── styles-sweetalert.css # Custom SweetAlert2 styling
│   ├── e2e/                      # End-to-end tests
│   └── package.json              # NPM dependencies
│
└── dotnetapp/                     # Backend .NET API
    ├── Controllers/               # API Controllers (4)
    ├── Services/                  # Business Logic Layer (6 services)
    ├── Models/                    # Data Models (6 entities)
    ├── Data/                      # Database Context
    ├── Exceptions/                # Custom Exceptions
    ├── Migrations/                # EF Core Migrations
    ├── Properties/                # Launch settings
    ├── Program.cs                 # Application entry point
    ├── appsettings.json          # Configuration
    └── log4net.config            # Logging configuration
```

---

## **2. PURPOSE AND ROLE OF EACH FILE/FOLDER**

### **A. Backend (dotnetapp/) - .NET Core 6.0**

#### **Controllers/** - API Endpoints
| File | Purpose |
|------|---------|
| AuthenticationController.cs | Handles user login/registration with JWT token generation. Includes comprehensive logging |
| LoanController.cs | CRUD operations for loan products (Admin creates/edits loans) |
| LoanApplicationController.cs | Manages loan applications submitted by users |
| FeedbackController.cs | Handles user feedback submission and retrieval |

#### **Services/** - Business Logic Layer
| File | Purpose |
|------|---------|
| IAuthService.cs | Interface defining authentication contract |
| AuthService.cs | **Critical**: Implements JWT authentication, password hashing (PasswordHasher), user registration/login |
| LoanService.cs | Business logic for loan CRUD, validates loan type uniqueness, handles referential integrity |
| LoanApplicationService.cs | Processes applications, prevents duplicate submissions, updates loan status |
| FeedbackService.cs | Manages feedback operations with user relationships |
| `ILogService.cs` & LogService.cs | **Critical**: Log4Net integration for user action tracking with IST timezone |

#### **Models/** - Data Entities
| File | Properties | Description |
|------|-----------|-------------|
| User.cs | UserId, Email, Password, Username, MobileNumber, UserRole | User entity with role-based access (Admin/User) |
| Loan.cs | LoanId, LoanType, Description, InterestRate, MaximumAmount, RepaymentTenure, Eligibility, DocumentsRequired | Loan product catalog |
| LoanApplication.cs | LoanApplicationId, UserId, LoanId, SubmissionDate, LoanStatus, FarmLocation, FarmerAddress, FarmSizeInAcres, FarmPurpose, File | User's loan application with farm details |
| Feedback.cs | FeedbackId, UserId, FeedbackText, Date | User feedback with navigation to User |
| `LoginModel.cs` | Email, Password | DTO for login requests |
| `UserRoles.cs` | Role constants (Admin/User) |

#### **Data/** - Database Layer
- ApplicationDbContext.cs: EF Core DbContext with DbSets for Users, Loans, LoanApplications, Feedbacks

#### **Exceptions/**
- LoanException.cs: Custom exception for business rule violations (duplicate applications, referenced loans)

#### **Program.cs** - Application Configuration
**Critical Setup**:
```csharp
// JWT Authentication with HMAC-SHA256
// CORS policy for Angular frontend
// Swagger/OpenAPI with Bearer auth
// Log4Net configuration
// Static file serving for uploaded proofs
// Dependency injection for all services
```

#### **Configuration Files**
- appsettings.json: Database connection string, JWT settings (Key, Issuer, Audience)
- log4net.config: Rolling file appender for daily logs in `Logs/app.log`
- dotnetapp.csproj: NuGet packages (EF Core, JWT, Log4Net, Swagger, Identity)

---

### **B. Frontend (angularapp/) - Angular 10**

#### **Core Module Files**
| File | Purpose |
|------|---------|
| app.module.ts | **Critical**: Declares all 24 components, imports FormsModule, HttpClientModule, ReactiveFormsModule, AgGridModule, RecaptchaModule. Provides MagicEffects and Confetti services |
| app-routing.module.ts | **Critical**: Defines 15+ routes with AuthGuard protection, role-based access control |
| app.component.ts | Root component (minimal, just title) |

#### **Components/** - UI Layer (24 Components)

**Authentication & Navigation**:
- `login/`: Login form with SweetAlert2, live validation, password visibility toggle
- `registration/`: User registration with role selection
- `navbar/`: Public navigation
- `adminnav/`: Admin dashboard navigation
- `usernav/`: User dashboard navigation
- `authguard/`: **Critical** - Route guard checking JWT token and role

**Admin Features**:
- `createloan/`: Create new loan products
- `admineditloan/`: Edit existing loans
- `viewloan/`: View all loans with ag-Grid, delete functionality
- `requestedloan/`: **Critical** - Approve/reject loan applications, update status
- `adminviewfeedback/`: View all user feedbacks

**User Features**:
- `userviewloan/`: Browse available loans
- `loanform/`: **Critical** - Apply for loans with farm details, file upload
- `userappliedloan/`: View user's application history
- `useraddfeedback/`: Submit feedback
- `userviewfeedback/`: View own feedbacks

**Shared/UI Components**:
- `home/`: Landing page with magic effects, spotlight, particles
- `error/`: 404 error page
- `loading-animation/`: Loading spinner
- `animated-grid-pattern/`: Background effect
- `sparkles-text/`: Text animation
- `letter-glitch/`: Glitch effect
- `faq-accordion/`: FAQ section
- `theme-toggle/`: Dark/light mode toggle

#### **Services/** - API Communication Layer
| Service | Purpose |
|---------|---------|
| auth.service.ts | **Critical**: JWT token management, login/register API calls, role checking, localStorage management, BehaviorSubject for user state |
| loan.service.ts | All loan and loan application API calls with Authorization headers |
| feedback.service.ts | Feedback CRUD operations |
| magic-effects.service.ts | Advanced UI effects (particles, spotlight, tilt, magnetism, click ripples) |
| confetti.service.ts | Canvas-confetti integration |
| theme.service.ts | Dark/light theme management |

#### **Models/** - TypeScript Interfaces
- user.model.ts: User entity structure
- loan.model.ts: Loan interface
- loanapplication.model.ts: Loan application structure
- feedback.model.ts: Feedback class
- `login.model.ts`: Login DTO

#### **Environments/**
- environment.ts: Development API URLs (port 8080 for backend)
- `environment.prod.ts`: Production configuration

#### **Styling**
- `styles.css`: Global application styles
- `styles-sweetalert.css`: **Critical** - Custom SweetAlert2 theme with:
  - Green/blue/gold progress bars
  - Custom confirm/delete buttons with gradients
  - Dark mode support
  - Responsive design
  - Professional typography (Geist font)

---

## **3. FILE AND MODULE COMMUNICATION**

### **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    ANGULAR FRONTEND                      │
│  ┌────────────┐    ┌────────────┐    ┌──────────────┐  │
│  │ Components │───>│  Services  │───>│ HTTP Client  │  │
│  │  (UI/UX)   │<───│  (Logic)   │<───│   (API)      │  │
│  └────────────┘    └────────────┘    └──────────────┘  │
│         │                                      │         │
│         │ (Two-way binding)          (JWT Token in      │
│         │ (Reactive Forms)            Authorization     │
│         │ (Router)                    Header)           │
└─────────────────────────────────────────────────────────┘
                              │
                    HTTP Requests (JSON)
                    JWT Bearer Token
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   .NET CORE API                         │
│  ┌────────────┐    ┌────────────┐    ┌──────────────┐   │
│  │Controllers │───>│  Services  │───>│   DbContext  │   │
│  │ (Routing)  │<───│ (Business) │<───│  (EF Core)   │   │
│  └────────────┘    └────────────┘    └──────────────┘   │
│         │                                      │        │
│         │ (JWT Validation)          (LINQ Queries)      │
│         │ (CORS)                    (Migrations)        │
│         │ (Swagger)                                     │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   SQL Server     │
                    │   Database       │
                    └──────────────────┘
```

---

## **6. OVERALL PROJECT ARCHITECTURE & WORKFLOW**

### **Architecture Pattern: N-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│  Angular Components (24) + SweetAlert2 + ag-Grid            │
│  - Role-based UI (Admin vs User)                            │
│  - Reactive Forms + Validation                              │
│  - Magic Effects + Animations                               │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTP/JSON + JWT
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER (Angular)                   │
│  AuthService, LoanService, FeedbackService                  │
│  - JWT token management                                     │
│  - HTTP client with interceptors                            │
│  - State management (BehaviorSubject)                       │
└─────────────────────────────────────────────────────────────┘
                          ↕ REST API Calls
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER (.NET)                          │
│  Controllers (4) - RESTful endpoints                        │
│  - JWT authentication middleware                            │
│  - CORS policy                                              │
│  - Swagger documentation                                    │
└─────────────────────────────────────────────────────────────┘
                          ↕ Dependency Injection
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                      │
│  Services (6) - AuthService, LoanService, etc.              │
│  - Password hashing                                         │
│  - Business rules validation                                │
│  - Exception handling                                       │
│  - Logging (Log4Net)                                        │
└─────────────────────────────────────────────────────────────┘
                          ↕ Entity Framework Core
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                         │
│  ApplicationDbContext + EF Core                             │
│  - Code-First migrations                                    │
│  - LINQ queries                                             │
│  - Navigation properties                                    │
└─────────────────────────────────────────────────────────────┘
                          ↕ ADO.NET
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                            │
│  SQL Server                                                 │
│  - Users, Loans, LoanApplications, Feedbacks                │
│  - Foreign key relationships                                │
└─────────────────────────────────────────────────────────────┘
```

---

### **Complete User Workflow**

#### **Scenario 1: User Applies for a Loan**

```
1. User registers → RegistrationComponent → POST /api/register
   └─> Password hashed → User saved to DB with role='User'

2. User logs in → LoginComponent → POST /api/login
   └─> Password verified → JWT generated with claims
   └─> Token + User object returned
   └─> Stored in localStorage
   └─> Redirected to /user dashboard

3. User views loans → UserviewloanComponent → GET /api/Loan
   └─> Displays all available loans in cards
   └─> AuthGuard validates token + role='User'

4. User clicks "Apply" → LoanFormComponent (route param: loanId)
   └─> Reactive form with validators
   └─> User enters farm details + uploads proof
   └─> Submits → POST /api/LoanApplication
      └─> JWT token in Authorization header
      └─> LoanApplicationService checks duplicate
      └─> If duplicate: LoanException thrown → 400 BadRequest
      └─> If new: Saved with LoanStatus=0 (Pending)
      └─> Success → SweetAlert2 green progress bar
      └─> Navigate to /user/userappliedloan

5. User views applications → UserappliedloanComponent
   └─> GET /api/LoanApplication/user/{userId}
   └─> Displays with ag-Grid
   └─> Status: 0=Pending, 1=Approved, 2=Rejected
```

#### **Scenario 2: Admin Manages Loans**

```
1. Admin logs in → LoginComponent → POST /api/login
   └─> JWT with role='Admin' claim
   └─> Redirected to /admin dashboard

2. Admin creates loan → CreateLoanComponent
   └─> Reactive form with validation
   └─> POST /api/Loan
   └─> [Authorize(Roles = "Admin")] attribute validates
   └─> LoanService.AddLoan() saves to DB
   └─> Success alert → Navigate to /admin/viewloan

3. Admin views requests → RequestedloanComponent
   └─> GET /api/LoanApplication
   └─> ag-Grid with all applications
   └─> Admin clicks "Approve" on a row:
      └─> SweetAlert2 confirmation dialog (green button)
      └─> If confirmed: Update LoanStatus=1
      └─> PUT /api/LoanApplication/{id}
      └─> Success → Grid refreshes
   └─> Admin clicks "Reject":
      └─> SweetAlert2 warning dialog (red button)
      └─> Update LoanStatus=2
      └─> Blue progress bar on success

4. Admin views feedback → AdminviewfeedbackComponent
   └─> GET /api/Feedback
   └─> Displays with user navigation (User.Username)
```

---

### **Security Measures**

| Layer | Security Feature |
|-------|-----------------|
| **Frontend** | - JWT token in localStorage<br>- AuthGuard on protected routes<br>- Role-based UI rendering<br>- Input validation (Reactive Forms) |
| **API** | - JWT Bearer authentication<br>- [Authorize(Roles = "Admin")] attributes<br>- CORS policy (whitelist Angular origin)<br>- HTTPS enforcement |
| **Business Logic** | - Password hashing (PBKDF2)<br>- Custom exceptions prevent info leakage<br>- Comprehensive logging (audit trail) |
| **Database** | - EF Core parameterized queries (SQL injection prevention)<br>- Foreign key constraints<br>- No sensitive data in logs |

---

### **Technology Stack Summary**

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | Angular 10 |
| **UI Libraries** | ag-Grid, SweetAlert2, Canvas Confetti, GSAP, Lenis |
| **State Management** | RxJS BehaviorSubject |
| **Form Handling** | Reactive Forms |
| **HTTP Client** | HttpClient with Interceptors |
| **Routing** | Angular Router with Guards |
| **Backend Framework** | ASP.NET Core 6.0 Web API |
| **Authentication** | JWT (System.IdentityModel.Tokens.Jwt) |
| **Password Hashing** | ASP.NET Core Identity PasswordHasher |
| **ORM** | Entity Framework Core 6.0 |
| **Database** | SQL Server (EF Core InMemory for testing) |
| **Logging** | Log4Net 3.1.0 |
| **API Documentation** | Swagger/OpenAPI |
| **Testing** | Jasmine, Karma, Protractor, NUnit |
| **Package Managers** | npm, NuGet |

---

### **Key Design Patterns Used**

1. **Repository Pattern**: `ApplicationDbContext` abstracts data access
2. **Dependency Injection**: Services injected via constructors
3. **Service Layer Pattern**: Business logic separated from controllers
4. **DTO Pattern**: `LoginModel` for data transfer
5. **Guard Pattern**: `AuthGuard` for route protection
6. **Observer Pattern**: `BehaviorSubject` for state management
7. **Middleware Pattern**: JWT authentication middleware
8. **Factory Pattern**: `FormBuilder` for reactive forms

---

### **Database Schema**

```sql
Users
├── UserId (PK)
├── Email (Unique)
├── Password (Hashed)
├── Username
├── MobileNumber
└── UserRole (Admin/User)

Loans
├── LoanId (PK)
├── LoanType
├── Description
├── InterestRate
├── MaximumAmount
├── RepaymentTenure
├── Eligibility
└── DocumentsRequired

LoanApplications
├── LoanApplicationId (PK)
├── UserId (FK → Users)
├── LoanId (FK → Loans)
├── SubmissionDate
├── LoanStatus (0=Pending, 1=Approved, 2=Rejected)
├── FarmLocation
├── FarmerAddress
├── FarmSizeInAcres
├── FarmPurpose
└── File (Upload path)

Feedbacks
├── FeedbackId (PK)
├── UserId (FK → Users)
├── FeedbackText
└── Date
```

**Relationships**:
- `LoanApplications.UserId` → `Users.UserId` (Many-to-One)
- `LoanApplications.LoanId` → `Loans.LoanId` (Many-to-One)
- `Feedbacks.UserId` → `Users.UserId` (Many-to-One)

---

## **7. ADDITIONAL OBSERVATIONS**

### **Strengths**
✅ Complete separation of concerns (N-tier architecture)  
✅ Secure authentication with JWT + password hashing  
✅ Comprehensive logging for audit trails  
✅ Role-based access control on both frontend and backend  
✅ Professional UI with SweetAlert2 and modern effects  
✅ Responsive design with dark mode support  
✅ Custom exception handling for business rules  
✅ API documentation with Swagger  
✅ Reactive programming with RxJS  
✅ Form validation on both client and server  
✅ File upload capability for loan proofs  

### **Potential Improvements**
⚠️ **Error Handling**: Consider global error interceptor in Angular  
⚠️ **Token Refresh**: Implement refresh token mechanism for better UX  
⚠️ **Caching**: Add HTTP caching for frequently accessed data  
⚠️ **Pagination**: Implement server-side pagination for large datasets  
⚠️ **Testing**: Add more unit/integration tests  
⚠️ **Environment Variables**: Move sensitive config to environment variables  
⚠️ **Rate Limiting**: Add API rate limiting to prevent abuse  
⚠️ **Input Sanitization**: Add XSS protection on backend  
⚠️ **Database Backup**: Implement automated backup strategy  
⚠️ **Monitoring**: Add application performance monitoring (APM)  

---

## **CONCLUSION**

**Farm Financer** is a **well-architected, production-ready full-stack application** demonstrating:
- Modern web development practices
- Enterprise-level security (JWT, password hashing, RBAC)
- Professional UI/UX with animations and custom styling
- Comprehensive logging and error handling
- Clean code organization with clear separation of concerns
- RESTful API design with proper HTTP status codes
- Reactive programming patterns
- Role-based workflows (Admin vs User)

The application successfully implements a complete loan management system where users can browse, apply for loans, and submit feedback, while admins can manage loan products, approve/reject applications, and view feedback.

---

**Components**: 24 Angular + 4 API Controllers  
**Services**: 6 Backend + 6 Frontend  
**Models**: 6 entities with relationships  

---