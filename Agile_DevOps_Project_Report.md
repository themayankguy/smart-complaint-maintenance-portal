# Project Report: Continuous Agile Product Development & DevOps
## Smart Complaint & Maintenance Portal (SCMP)
**Subject:** Agile Product Development using DevOps

---

## 1. Executive Summary
This report details the end-to-end agile development and DevOps lifecycle of the **Smart Complaint & Maintenance Portal (SCMP)**. The project was executed using a single-developer Agile methodology, leveraging Scrum frameworks via Jira, strict version control using Git and GitHub, and Continuous Integration (CI/CD) pipelines powered by Jenkins. The goal was to build a robust, scalable, and premium web application while strictly adhering to modern DevOps practices.

## 2. Introduction & Problem Statement
Facility management in large organizations, residential complexes, and university campuses is often chaotic. Complaints regarding plumbing, IT, or electrical issues are usually managed via disjointed platforms like WhatsApp groups, paper forms, or generic emails. This leads to lost SLA tracking, inefficient delegation, zero management visibility, and a poor user experience. 

The **SCMP** solves this by centralizing the flow into a modern, three-tiered Role-Based Access Control (RBAC) system:
*   **Users:** Can instantly lodge and track complaints.
*   **Technicians:** Receive a streamlined queue of assigned tasks and update statuses in real-time.
*   **Admins/Management:** Utilize a global dashboard for analytics, issue tracking, and user management.

> 📸 **[Insert Screenshot Here: SCMP Project UI - Admin Dashboard or User Portal]**
> *(Caption: Figure 1 - The Smart Complaint & Maintenance Portal live user interface.)*

## 3. Agile Product Development (Scrum & Jira)
To structure the development process effectively, an Agile Scrum methodology was adapted for a single-person team. The entire product lifecycle was mapped out using Jira Software.

### 3.1. The Backlog & Sprint Planning
The project began by defining the product backlog. Features were broken down into user stories and tasks. For example:
*   *Story:* "Set up React frontend with Tailwind CSS"
*   *Task:* "Create User login and Signup endpoints in Python FastAPI"
*   *Feature:* "Implement role-based access for Admin, User, and Technician"

> 📸 **[Insert Screenshot Here: Jira Product Backlog]**
> *(Caption: Figure 2 - Jira Backlog showing prioritized user stories and product tasks.)*

### 3.2. Sprints & Execution
Development was divided into logical Sprints (e.g., Sprint 1: Backend & Auth, Sprint 2: Frontend & RBAC).
*   **Active Sprints:** Tasks were moved across the Scrum board logically from "To Do" to "In Progress" and finally to "Done," simulating a production sprint cycle.
*   **Sprint Reports:** At the end of each sprint cycle, Jira generated a Sprint Burndown Chart to analyze velocity and track the completion rate of the given tasks, ensuring the project stayed on schedule.

> 📸 **[Insert Screenshot Here: Jira Active Sprint Board]**
> *(Caption: Figure 3 - Active Scrum Board during the sprint showing tasks moving from To Do, to In Progress, and ending in Done.)*

> 📸 **[Insert Screenshot Here: Jira Sprint Burndown Chart]**
> *(Caption: Figure 4 - Sprint Burndown chart indicating the team's velocity and task completion rate over time.)*

## 4. Version Control and Source Management (Git & GitHub)
As a sole developer, maintaining code integrity and a clean history was paramount. Git was used locally, with GitHub acting as the remote repository.

### 4.1. Committing and Pushing
A disciplined commit strategy was enforced. Changes were committed with clear, descriptive messages outlining the feature or fix.
*   **Example Commits:** 
    *   `c49d8f0 Initial backend skeleton setup`
    *   `4334c64 Sprint 1: Added authentication module implementation`
    *   `c3f2969 feat(analytics): add category and resolution dashboard #12`

> 📸 **[Insert Screenshot Here: GitHub Repository / Commit History]**
> *(Caption: Figure 5 - GitHub commit history demonstrating iterative development and version control.)*

### 4.2. Branching Strategy & Pull Requests
Instead of pushing directly to the `main` branch, isolated development branches (e.g., `feature/user-auth-backend`) were utilized. Once local verification was successful, the feature branches were merged into the `develop` or `main` branch via Pull Requests.

> 📸 **[Insert Screenshot Here: GitHub Pull Request / Branch Graph]**
> *(Caption: Figure 6 - GitHub interface showing a successful merged Pull Request from a feature branch.)*

### 4.3. Rollbacks & Error Recovery
Git's versioning was heavily utilized for rolling back unstable code. During the development of the database logic, a fatal 500 collision error occurred due to email duplication. Instead of patching over messy code, Git allowed for a seamless rollback to a stable state (`git checkout` and `git revert`), after which a clean fix (handling `IntegrityError` to a 400 Bad Request) was safely implemented and committed.

## 5. DevOps & Continuous Integration (Jenkins)
To ensure enterprise-level stability and automate the testing/build phases, a robust CI/CD pipeline was integrated using Jenkins.

### 5.1. Jenkins Pipeline Architecture
The project root contains a declarative `Jenkinsfile` which explicitly defines the pipeline stages. 
*   **Trigger:** The Jenkins server is configured to listen to the GitHub repository. Whenever code is pushed to the `develop` or `main` branches, Jenkins automatically triggers a build.
*   **Stages Engine:** 
    1.  **Checkout:** Pulls the latest source code from GitHub.
    2.  **Build/Test:** Installs backend dependencies (`requirements.txt`), frontend packages (`npm install`), and runs automated linters to validate code quality.
    3.  **Deploy Preparation:** Packages the application securely, ensuring the build completes asynchronously without human intervention.

> 📸 **[Insert Screenshot Here: Jenkins Build History & Pipeline Stages]**
> *(Caption: Figure 7 - Jenkins CI/CD dashboard highlighting successful automated builds, test validations, and execution stages.)*

This DevOps approach ensured that broken code was never merged into the primary product lines.

## 6. Technical Stack Implementation
The application architecture was built using modern, highly performant technologies:
*   **Frontend:** React.js via Vite, utilizing Tailwind CSS for styling and Framer Motion for premium micro-animations. Recharts provided dynamic data visualization for the Admin dashboard.
*   **Backend:** Python FastAPI was chosen for extreme raw performance, asynchronous request handling, and its automatically generated interactive Swagger documentation.
*   **Database:** MySQL relational database, managed via SQLAlchemy ORM ensuring transactional integrity.
*   **Security:** Secure stateless JWT (JSON Web Tokens) with PBKDF2 password hashing mechanism.

### 6.1 Challenges Overcome
*   **Local Routing & Port Squatting:** Addressed React SPA 404 routing errors by creating a custom Python `spa_server.py` to elegantly override default HTTP handler logic.

## 7. Conclusion
Developing the Smart Complaint & Maintenance Portal utilizing an Agile and DevOps mentality proved highly successful. By leveraging Jira for strict Scrum tracking, GitHub for disciplined version control and rollbacks, and Jenkins for automated CI/CD pipelines, the project maintained enterprise-quality software development standards despite being executed by a single developer. The resulting application is scalable, secure, and ready for production deployment.
