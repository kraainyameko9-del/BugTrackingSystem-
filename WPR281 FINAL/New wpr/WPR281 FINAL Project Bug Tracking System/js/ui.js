// Stores which issue is currently selected in the table.
let selectedIssueId = null;

// Starts the app after the HTML has loaded.
window.addEventListener('DOMContentLoaded', function () {
    initializeData();
    refreshAllIssueStatuses();
    fillSelectLists();
    renderDashboard();
    connectButtons();
});

// Connects all clickable buttons, filters and forms.
function connectButtons() {
    document.getElementById('showCreateFormBtn').addEventListener('click', function () {
        document.getElementById('createIssueSection').classList.remove('d-none');
        document.getElementById('createIssueSection').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('hideCreateFormBtn').addEventListener('click', function () {
        document.getElementById('createIssueSection').classList.add('d-none');
    });

    document.getElementById('showPeopleProjectsBtn').addEventListener('click', function () {
        document.getElementById('peopleProjectsSection').classList.remove('d-none');
        document.getElementById('peopleProjectsSection').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('hidePeopleProjectsBtn').addEventListener('click', function () {
        document.getElementById('peopleProjectsSection').classList.add('d-none');
    });

    document.getElementById('statusFilter').addEventListener('change', renderIssuesTable);
    document.getElementById('priorityFilter').addEventListener('change', renderIssuesTable);
    document.getElementById('issueSearch').addEventListener('input', renderIssuesTable);

    document.getElementById('createIssueForm').addEventListener('submit', handleCreateIssue);

    document.getElementById('resetDemoDataBtn').addEventListener('click', function () {
        if (confirm('Reset demo data? This will discard all changes.')) {
            resetDemoData();
            renderDashboard();
            showToast('Demo data reset. Dashboard updated.');
            setTimeout(() => location.reload(), 800);
        }
    });
}

// Fills all dropdown lists used by the create issue form.
function fillSelectLists() {
    fillPeopleSelect('reportedBy', false);
    fillPeopleSelect('assignedTo', true);
    fillProjectSelect('projectId');
}

// Reusable function for people dropdowns.
function fillPeopleSelect(selectId, includeUnassigned) {
    const select = document.getElementById(selectId);
    const people = getAllPeople();
    select.innerHTML = '';

    if (includeUnassigned) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Unassigned';
        select.appendChild(option);
    }

    people.forEach(function (person) {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = getPersonDisplayName(person.id);
        select.appendChild(option);
    });
}

// Reusable function for the project dropdown.
function fillProjectSelect(selectId) {
    const select = document.getElementById(selectId);
    const projects = getAllProjects();
    select.innerHTML = '';

    projects.forEach(function (project) {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

// Re-renders the full screen after creating, editing or resetting data.
function renderDashboard() {
    refreshAllIssueStatuses();
    renderStats();
    renderAnalytics();
    renderIssuesTable();
    renderPeopleAndProjects();

    if (selectedIssueId !== null) {
        renderSingleIssue(selectedIssueId);
    }
}

// Updates the four summary cards.
function renderStats() {
    const issues = getAllIssues();

    document.getElementById('totalIssuesCount').textContent = issues.length;
    document.getElementById('openIssuesCount').textContent = countIssuesByStatus('Open');
    document.getElementById('overdueIssuesCount').textContent = countIssuesByStatus('Overdue');
    document.getElementById('resolvedIssuesCount').textContent = countIssuesByStatus('Resolved');
}

// Counts issues for a specific status.
function countIssuesByStatus(status) {
    return getAllIssues().filter(function (issue) {
        return issue.status === status;
    }).length;
}

// Builds the Tsee-style analytics progress bars.
function renderAnalytics() {
    const analyticsContainer = document.getElementById('analyticsContainer');
    const totalIssues = getAllIssues().length;

    // Each analytics item has a bar colour class and a matching text colour class.
    const analyticsItems = [
        { label: 'Open', count: countIssuesByStatus('Open'), barClass: 'progress-open', textClass: 'analytics-text-open' },
        { label: 'Overdue', count: countIssuesByStatus('Overdue'), barClass: 'progress-overdue', textClass: 'analytics-text-overdue' },
        { label: 'Resolved', count: countIssuesByStatus('Resolved'), barClass: 'progress-resolved', textClass: 'analytics-text-resolved' }
    ];

    analyticsContainer.innerHTML = '';

    analyticsItems.forEach(function (item) {
        // The percentage updates every time the dashboard re-renders after create/edit/reset.
        const percentage = totalIssues === 0 ? 0 : Math.round((item.count / totalIssues) * 100);
        const block = document.createElement('div');
        block.className = 'analytics-item';
        block.innerHTML = `
            <div class="analytics-row">
                <span class="analytics-label ${item.textClass}">${escapeHtml(item.label)}</span>
                <span class="analytics-value ${item.textClass}">${item.count} (${percentage}%)</span>
            </div>
            <div class="progress-base" aria-label="${escapeHtml(item.label)} issues: ${percentage} percent">
                <div class="progress-fill ${item.barClass}" style="width: ${percentage}%;"></div>
            </div>
        `;
        analyticsContainer.appendChild(block);
    });
}

// Displays the filtered ticket table.
function renderIssuesTable() {
    const tableBody = document.getElementById('issuesTableBody');
    const emptyMessage = document.getElementById('emptyIssuesMessage');
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const searchText = document.getElementById('issueSearch').value.trim().toLowerCase();

    const filteredIssues = getAllIssues().filter(function (issue) {
        const statusMatches = statusFilter === 'All' || issue.status === statusFilter;
        const priorityMatches = priorityFilter === 'All' || issue.priority === priorityFilter;
        const searchMatches = searchText === '' || issue.summary.toLowerCase().includes(searchText) || getProjectName(issue.projectId).toLowerCase().includes(searchText) || getPersonDisplayName(issue.assignedTo).toLowerCase().includes(searchText);
        return statusMatches && priorityMatches && searchMatches;
    });

    tableBody.innerHTML = '';
    emptyMessage.classList.toggle('d-none', filteredIssues.length !== 0);

    filteredIssues.forEach(function (issue) {
        const row = document.createElement('tr');
        row.classList.toggle('selected-row', issue.id === selectedIssueId);
        row.setAttribute('tabindex', '0');
        row.innerHTML = buildIssueRowHtml(issue);

        row.addEventListener('click', function () {
            selectedIssueId = issue.id;
            renderIssuesTable();
            renderSingleIssue(issue.id);
        });

        row.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                selectedIssueId = issue.id;
                renderIssuesTable();
                renderSingleIssue(issue.id);
            }
        });

        tableBody.appendChild(row);
    });
}

// Creates one table row. Values are escaped to avoid accidental HTML injection.
function buildIssueRowHtml(issue) {
    return `
        <td><span class="ticket-id">${escapeHtml(issue.id)}</span></td>
        <td class="summary-cell">
            <strong>${escapeHtml(issue.summary)}</strong>
            <small>Created ${escapeHtml(issue.createdDate)}</small>
        </td>
        <td>${escapeHtml(getProjectName(issue.projectId))}</td>
        <td>${escapeHtml(getPersonDisplayName(issue.assignedTo))}</td>
        <td><span class="badge ${getPriorityClass(issue.priority)}">${escapeHtml(issue.priority)}</span></td>
        <td><span class="badge status-badge ${getStatusClass(issue.status)}">${escapeHtml(issue.status)}</span></td>
    `;
}

// Displays every required field for one selected issue.
function renderSingleIssue(issueId) {
    const issue = getIssueById(issueId);
    const detailPanel = document.getElementById('issueDetailPanel');

    if (!issue) {
        renderEmptyDetailPanel();
        return;
    }

    detailPanel.className = '';
    detailPanel.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
                <h3 class="detail-title">${escapeHtml(issue.summary)}</h3>
                <div class="d-flex flex-wrap gap-2">
                    <span class="badge status-badge ${getStatusClass(issue.status)}">${escapeHtml(issue.status)}</span>
                    <span class="badge ${getPriorityClass(issue.priority)}">${escapeHtml(issue.priority)}</span>
                </div>
            </div>
        </div>

        <div class="detail-group">
            <h3>Main information</h3>
            ${detailRow('Ticket ID', issue.id)}
            ${detailRow('Description', issue.description)}
            ${detailRow('Project', getProjectName(issue.projectId))}
            ${detailRow('Identified by', getPersonDisplayName(issue.reportedBy))}
            ${detailRow('Created date', issue.createdDate)}
        </div>

        <div class="detail-group">
            <h3>Assignment and dates</h3>
            ${detailRow('Assigned person', getPersonDisplayName(issue.assignedTo))}
            ${detailRow('Target date', issue.targetResolutionDate)}
            ${detailRow('Actual date', issue.actualResolutionDate || 'Not resolved yet')}
            ${detailRow('Resolution', issue.resolutionSummary || 'No resolution summary yet')}
        </div>

        <div class="edit-panel">
            <h3 class="mini-heading">Edit selected issue</h3>
            <form id="editIssueForm" class="row g-3">
                <div class="col-12 col-md-6">
                    <label class="form-label" for="editAssignedTo">Assigned to</label>
                    <select class="form-select" id="editAssignedTo"></select>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label" for="editPriority">Priority</label>
                    <select class="form-select" id="editPriority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label" for="editTargetResolutionDate">Target resolution date</label>
                    <input type="date" class="form-control" id="editTargetResolutionDate">
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label" for="editActualResolutionDate">Actual resolution date</label>
                    <input type="date" class="form-control" id="editActualResolutionDate">
                </div>
                <div class="col-12">
                    <label class="form-label" for="editResolutionSummary">Resolution summary</label>
                    <textarea class="form-control" id="editResolutionSummary" rows="3" placeholder="Explain how the issue was resolved."></textarea>
                </div>
                <div class="col-12 d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    prepareEditForm(issue);
}

// Restores the placeholder when no issue is selected.
function renderEmptyDetailPanel() {
    const detailPanel = document.getElementById('issueDetailPanel');
    detailPanel.className = 'detail-placeholder';
    detailPanel.innerHTML = `
        <div class="placeholder-icon">☝️</div>
        <h3>Select an issue</h3>
        <p>Click any ticket in the table to open the full issue view.</p>
    `;
}

// Fills the edit form with the selected issue's current values.
function prepareEditForm(issue) {
    const assignedSelect = document.getElementById('editAssignedTo');
    assignedSelect.innerHTML = '';

    const unassignedOption = document.createElement('option');
    unassignedOption.value = '';
    unassignedOption.textContent = 'Unassigned';
    assignedSelect.appendChild(unassignedOption);

    getAllPeople().forEach(function (person) {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = getPersonDisplayName(person.id);
        assignedSelect.appendChild(option);
    });

    assignedSelect.value = issue.assignedTo;
    document.getElementById('editPriority').value = issue.priority;
    document.getElementById('editTargetResolutionDate').value = issue.targetResolutionDate;
    document.getElementById('editActualResolutionDate').value = issue.actualResolutionDate;
    document.getElementById('editResolutionSummary').value = issue.resolutionSummary;

    document.getElementById('editIssueForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formValues = {
            assignedTo: document.getElementById('editAssignedTo').value,
            priority: document.getElementById('editPriority').value,
            targetResolutionDate: document.getElementById('editTargetResolutionDate').value,
            actualResolutionDate: document.getElementById('editActualResolutionDate').value,
            resolutionSummary: document.getElementById('editResolutionSummary').value.trim()
        };

        editIssue(issue.id, formValues);
        renderDashboard();
        showToast('Issue updated and saved.');
    });
}

// Reads the create form, calls createIssue, then refreshes the UI.
function handleCreateIssue(event) {
    event.preventDefault();

    const formValues = {
        summary: document.getElementById('summary').value.trim(),
        description: document.getElementById('description').value.trim(),
        projectId: document.getElementById('projectId').value,
        priority: document.getElementById('priority').value,
        reportedBy: document.getElementById('reportedBy').value,
        assignedTo: document.getElementById('assignedTo').value,
        targetResolutionDate: document.getElementById('targetResolutionDate').value
    };

    const newIssue = createIssue(formValues);
    selectedIssueId = newIssue.id;
    event.target.reset();
    fillSelectLists();
    renderDashboard();
    // Reset filters after adding new issue to ensure it's visible
    document.getElementById('issueSearch').value = '';
    document.getElementById('statusFilter').value = 'All';
    document.getElementById('priorityFilter').value = 'All';
    renderIssuesTable();
    renderSingleIssue(newIssue.id);
    showToast('New issue created and saved.');
}

// Renders the people and projects section for the live demonstration.
function renderPeopleAndProjects() {
    const peopleList = document.getElementById('peopleList');
    const projectList = document.getElementById('projectList');

    peopleList.innerHTML = '';
    projectList.innerHTML = '';

    getAllPeople().forEach(function (person) {
        const item = document.createElement('div');
        item.className = 'stack-item';
        item.innerHTML = `
            <strong>${escapeHtml(person.name + ' ' + person.surname)}</strong>
            <span>@${escapeHtml(person.username)} · ${escapeHtml(person.email)}</span>
        `;
        peopleList.appendChild(item);
    });

    getAllProjects().forEach(function (project) {
        const item = document.createElement('div');
        item.className = 'stack-item';
        item.innerHTML = `
            <strong>${escapeHtml(project.name)}</strong>
            <span>${escapeHtml(project.id)}</span>
        `;
        projectList.appendChild(item);
    });
}

// Helps to keep the detail view layout consistent.
function detailRow(label, value) {
    return `
        <div class="detail-row">
            <div class="detail-label">${escapeHtml(label)}</div>
            <span>${escapeHtml(value)}</span>
        </div>
    `;
}

// Converts a project id into a readable project name.
function getProjectName(projectId) {
    const project = getProjectById(projectId);
    return project ? project.name : 'Unknown Project';
}

// Converts a person id into a readable full name.
function getPersonDisplayName(personId) {
    if (personId === '') {
        return 'Unassigned';
    }

    const person = getPersonById(personId);
    return person ? person.name + ' ' + person.surname : 'Unknown Person';
}

// Returns the correct CSS class for a status badge.
function getStatusClass(status) {
    if (status === 'Resolved') {
        return 'status-resolved';
    }

    if (status === 'Overdue') {
        return 'status-overdue';
    }

    return 'status-open';
}

// Returns the correct CSS class for a priority badge.
function getPriorityClass(priority) {
    if (priority === 'High') {
        return 'priority-high';
    }

    if (priority === 'Medium') {
        return 'priority-medium';
    }

    return 'priority-low';
}

// Shows a short message in the bottom-right corner.
function showToast(message) {
    const toastArea = document.getElementById('toastArea');
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = message;
    toastArea.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 2600);
}

// Prevents user-entered text from being treated as HTML.
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
