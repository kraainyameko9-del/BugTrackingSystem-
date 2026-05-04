# Bug Tracking System

## Overview
This project is a web-based Bug Tracking System designed to record, assign, and manage software issues (tickets) within projects. The system allows an administrator to create issues, assign them to people, track their status and priority, and persist all data across browser sessions using the Web Storage API (localStorage).

---

## Features
- Create bug/issue tickets with full details
- Assign and reassign issues to people
- Edit issues (status, priority, resolution details)
- View all issues in a dashboard
- View full details of a single issue
- Manage people and projects
- Automatically track issue status (open, resolved, overdue)
- Persistent data storage using localStorage

---

## Technologies Used
- **HTML** – Structure of the web application
- **CSS & Bootstrap** – Styling and responsive layout
- **JavaScript** – Application logic and interaction
- **Web Storage API (localStorage)** – Data persistence

---

## Data Persistence
All data is stored in the browser using `localStorage`.  
The following entities persist across sessions:
- Projects
- People
- Issues (tickets)

Refreshing or reopening the browser does not remove existing data.

---

## Testing
The system was tested end-to-end to ensure that all features work together correctly. Testing focused on realistic usage scenarios and data persistence.

### Testing performed:
- Created more than 10 issues with varied priorities, statuses, and dates
- Assigned and reassigned issues to different people
- Edited issues to update status, priority, and resolution details
- Verified automatic overdue status based on target resolution dates
- Refreshed the browser to confirm all data persists using localStorage
- Verified correct display of data in both the dashboard and detailed issue view

Testing confirmed that the full workflow operates as intended:
**Create → Assign → View → Edit → Persist**

---

## Example Workflow
1. Create a new issue with summary, description, project, and priority
2. Assign the issue to a person
3. View the issue in the dashboard
4. Open the detailed issue view
5. Edit the issue to resolve it
6. Refresh the browser and confirm changes persist

---

## Team Roles
- **Nyameko Kraai:** Data models and localStorage persistence  
- **Ntalo Mashimbye:** Issue creation, assignment, and logic  
- **Ardent Svosvai:** HTML, CSS, UI design, and views  
- **Leila du Plessis:** System integration, testing, and presentation coordination  

---

## Notes
This project was developed as a demonstration system for educational purposes. Additional features could be added to improve scalability and usability, such as filtering, search, authentication, and role-based access.

