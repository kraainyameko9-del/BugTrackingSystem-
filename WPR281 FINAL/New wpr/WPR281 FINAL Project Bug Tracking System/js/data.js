const STORAGE_KEY = 'bugFlowData';

const seedData = {
    projects: [
        { id: 'project-1', name: 'E-Commerce Platform' },
        { id: 'project-2', name: 'Mobile App' },
        { id: 'project-3', name: 'Admin Dashboard' },
        { id: 'project-4', name: 'API Gateway' }
    ],
    people: [
        { id: 'person-1', name: 'Sarah', surname: 'Johnson', email: 'sarah.johnson@example.com', username: 'sjohnson' },
        { id: 'person-2', name: 'Michael', surname: 'Chen', email: 'michael.chen@example.com', username: 'mchen' },
        { id: 'person-3', name: 'Emily', surname: 'Rodriguez', email: 'emily.rodriguez@example.com', username: 'erodriguez' },
        { id: 'person-4', name: 'David', surname: 'Kim', email: 'david.kim@example.com', username: 'dkim' },
        { id: 'person-5', name: 'Lisa', surname: 'Anderson', email: 'lisa.anderson@example.com', username: 'landerson' },
        { id: 'person-6', name: 'James', surname: 'Wilson', email: 'james.wilson@example.com', username: 'jwilson' }
    ],
    issues: [
        {
            id: 'issue-1',
            summary: 'Login button not responding on mobile devices',
            description: 'Users report that the login button does not respond to taps on iOS devices.',
            reportedBy: 'person-5',
            createdDate: '2026-04-10',
            projectId: 'project-2',
            assignedTo: 'person-2',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-18',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-2',
            summary: 'Payment gateway timeout on checkout',
            description: 'Customers experience timeout errors when processing payments during checkout.',
            reportedBy: 'person-1',
            createdDate: '2026-04-12',
            projectId: 'project-1',
            assignedTo: 'person-3',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-17',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-3',
            summary: 'Product images not loading in grid view',
            description: 'Product thumbnail images fail to load in the grid view layout.',
            reportedBy: 'person-5',
            createdDate: '2026-04-05',
            projectId: 'project-1',
            assignedTo: 'person-2',
            status: 'Resolved',
            priority: 'Medium',
            targetResolutionDate: '2026-04-12',
            actualResolutionDate: '2026-04-11',
            resolutionSummary: 'Fixed the image path and updated lazy loading logic.'
        },
        {
            id: 'issue-4',
            summary: 'Dashboard charts display incorrect data',
            description: 'Sales analytics charts show incorrect monthly revenue totals.',
            reportedBy: 'person-1',
            createdDate: '2026-04-08',
            projectId: 'project-3',
            assignedTo: 'person-4',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-15',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-5',
            summary: 'Search autocomplete suggestions are slow',
            description: 'Autocomplete takes 3 to 5 seconds before showing search suggestions.',
            reportedBy: 'person-2',
            createdDate: '2026-04-11',
            projectId: 'project-1',
            assignedTo: 'person-4',
            status: 'Overdue',
            priority: 'Medium',
            targetResolutionDate: '2026-04-20',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-6',
            summary: 'API rate limiting not working correctly',
            description: 'The rate limiting middleware is not throttling requests as configured.',
            reportedBy: 'person-3',
            createdDate: '2026-04-09',
            projectId: 'project-4',
            assignedTo: 'person-6',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-14',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-7',
            summary: 'User profile update fails with special characters',
            description: 'Profile forms fail when names contain apostrophes or hyphens.',
            reportedBy: 'person-5',
            createdDate: '2026-04-01',
            projectId: 'project-3',
            assignedTo: 'person-3',
            status: 'Resolved',
            priority: 'Medium',
            targetResolutionDate: '2026-04-10',
            actualResolutionDate: '2026-04-09',
            resolutionSummary: 'Updated validation to allow common special characters.'
        },
        {
            id: 'issue-8',
            summary: 'Email notifications contain broken links',
            description: 'Order confirmation emails include broken order tracking links.',
            reportedBy: 'person-5',
            createdDate: '2026-03-28',
            projectId: 'project-1',
            assignedTo: 'person-1',
            status: 'Resolved',
            priority: 'Medium',
            targetResolutionDate: '2026-04-05',
            actualResolutionDate: '2026-04-04',
            resolutionSummary: 'Corrected email template domain configuration.'
        },
        {
            id: 'issue-9',
            summary: 'Mobile app crashes on Android 12',
            description: 'App crashes after login on Android 12 devices.',
            reportedBy: 'person-5',
            createdDate: '2026-04-01',
            projectId: 'project-2',
            assignedTo: 'person-4',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-10',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-10',
            summary: 'Cart total calculation error with discount codes',
            description: 'Applying multiple discounts can show a negative cart total.',
            reportedBy: 'person-1',
            createdDate: '2026-04-13',
            projectId: 'project-1',
            assignedTo: 'person-3',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-19',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-11',
            summary: 'Dark mode toggle not persisting across sessions',
            description: 'The dark mode setting resets after every page refresh.',
            reportedBy: 'person-4',
            createdDate: '2026-04-14',
            projectId: 'project-3',
            assignedTo: 'person-2',
            status: 'Open',
            priority: 'Low',
            targetResolutionDate: '2026-05-25',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-12',
            summary: 'File upload progress bar stuck at 99%',
            description: 'Large file uploads complete, but the UI progress bar remains at 99%.',
            reportedBy: 'person-1',
            createdDate: '2026-03-25',
            projectId: 'project-3',
            assignedTo: 'person-2',
            status: 'Resolved',
            priority: 'Low',
            targetResolutionDate: '2026-04-08',
            actualResolutionDate: '2026-04-07',
            resolutionSummary: 'Fixed the progress calculation after multipart upload completion.'
        },
        {
            id: 'issue-13',
            summary: 'Database connection pool exhaustion',
            description: 'API server sometimes runs out of database connections during peak traffic.',
            reportedBy: 'person-3',
            createdDate: '2026-04-03',
            projectId: 'project-4',
            assignedTo: 'person-6',
            status: 'Overdue',
            priority: 'High',
            targetResolutionDate: '2026-04-12',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-14',
            summary: 'Pagination breaks after applying filters',
            description: 'Product listing pagination shows incorrect page numbers after filters are applied.',
            reportedBy: 'person-5',
            createdDate: '2026-04-15',
            projectId: 'project-1',
            assignedTo: 'person-4',
            status: 'Overdue',
            priority: 'Medium',
            targetResolutionDate: '2026-04-22',
            actualResolutionDate: '',
            resolutionSummary: ''
        },
        {
            id: 'issue-15',
            summary: 'Push notifications not working on iOS',
            description: 'iOS users are not receiving push notifications for order updates.',
            reportedBy: 'person-5',
            createdDate: '2026-04-07',
            projectId: 'project-2',
            assignedTo: 'person-1',
            status: 'Overdue',
            priority: 'Medium',
            targetResolutionDate: '2026-04-21',
            actualResolutionDate: '',
            resolutionSummary: ''
        }
    ],
    nextIssueId: 16
};

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
        return null;
    }

    return JSON.parse(storedValue);
}

// First-time setup: if storage is empty, put the demo data into storage.
function initializeData() {
    const existingData = getFromLocalStorage(STORAGE_KEY);

    if (existingData === null) {
        saveToLocalStorage(STORAGE_KEY, seedData);
        return seedData;
    }

    return existingData;
}

// Returns the full data object currently stored in localStorage.
function getAllData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initializeData();
}

// Saves the full data object after a create or edit action.
function saveAllData(data) {
    saveToLocalStorage(STORAGE_KEY, data);
}

// Restores the original test data for demo day.
function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    saveToLocalStorage(STORAGE_KEY, seedData);
}

function getAllProjects() {
    return getAllData().projects;
}

function getAllPeople() {
    return getAllData().people;
}

function getAllIssues() {
    return getAllData().issues;
}

function getProjectById(projectId) {
    return getAllProjects().find(function (project) {
        return project.id === projectId;
    });
}

function getPersonById(personId) {
    return getAllPeople().find(function (person) {
        return person.id === personId;
    });
}

function getIssueById(issueId) {
    return getAllIssues().find(function (issue) {
        return issue.id === issueId;
    });
}

function getNextIssueId() {
    let data = getAllData();
    if (data.nextIssueId === undefined) {
        data.nextIssueId = 16;
        saveAllData(data);
    }
    const idNum = data.nextIssueId;
    data.nextIssueId++;
    saveAllData(data);
    return `issue-${idNum}`;
}

// Adds a new ticket to the issue list and immediately saves it.
function addIssue(issue) {
    const data = getAllData();
    data.issues.push(issue);
    saveAllData(data);
}

// Finds one ticket by id, merges in new values, and saves the updated list.
function updateIssue(issueId, updates) {
    const data = getAllData();
    const issueIndex = data.issues.findIndex(function (issue) {
        return issue.id === issueId;
    });

    if (issueIndex === -1) {
        return false;
    }

    data.issues[issueIndex] = Object.assign({}, data.issues[issueIndex], updates);
    saveAllData(data);
    return true;
}
