// The priorities that are allowed by the project scope.
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

// The statuses that are allowed by the project scope.
const VALID_STATUSES = ['Open', 'Overdue', 'Resolved'];

// Creates today's date in yyyy-mm-dd format for easy comparison with input type="date".
function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

// Keeps status consistent: resolved date wins, then overdue, otherwise open.
function enforceStatusRule(issue) {
    const today = getTodayDateString();
    const hasResolutionDate = issue.actualResolutionDate !== undefined && issue.actualResolutionDate !== '';
    const hasTargetDate = issue.targetResolutionDate !== undefined && issue.targetResolutionDate !== '';

    if (hasResolutionDate) {
        return 'Resolved';
    }

    if (hasTargetDate && issue.targetResolutionDate < today) {
        return 'Overdue';
    }

    return 'Open';
}

// Creates a complete issue object from form values, gives it an id, then saves it.
function createIssue(formValues) {
    const newIssue = {
        id: getNextIssueId(),
        summary: formValues.summary,
        description: formValues.description,
        reportedBy: formValues.reportedBy,
        createdDate: getTodayDateString(),
        projectId: formValues.projectId,
        assignedTo: formValues.assignedTo,
        status: 'Open',
        priority: VALID_PRIORITIES.includes(formValues.priority) ? formValues.priority : 'Medium',
        targetResolutionDate: formValues.targetResolutionDate,
        actualResolutionDate: '',
        resolutionSummary: ''
    };

    newIssue.status = enforceStatusRule(newIssue);
    addIssue(newIssue);
    return newIssue;
}

// Assigns or reassigns an issue to a person. An empty person id means Unassigned.
function assignIssue(issueId, personId) {
    const existingIssue = getIssueById(issueId);

    if (!existingIssue) {
        return false;
    }

    return updateIssue(issueId, { assignedTo: personId });
}

// Updates allowed issue fields from the edit form and recalculates status.
function updateIssueFromForm(issueId, formValues) {
    const existingIssue = getIssueById(issueId);

    if (!existingIssue) {
        return false;
    }

    const updatedIssue = Object.assign({}, existingIssue, {
        assignedTo: formValues.assignedTo,
        priority: VALID_PRIORITIES.includes(formValues.priority) ? formValues.priority : existingIssue.priority,
        targetResolutionDate: formValues.targetResolutionDate,
        actualResolutionDate: formValues.actualResolutionDate,
        resolutionSummary: formValues.resolutionSummary
    });

    updatedIssue.status = enforceStatusRule(updatedIssue);

    return updateIssue(issueId, {
        assignedTo: updatedIssue.assignedTo,
        priority: updatedIssue.priority,
        targetResolutionDate: updatedIssue.targetResolutionDate,
        actualResolutionDate: updatedIssue.actualResolutionDate,
        resolutionSummary: updatedIssue.resolutionSummary,
        status: updatedIssue.status
    });
}

// Alias kept for readability and for any code that calls editIssue directly.
function editIssue(issueId, formValues) {
    return updateIssueFromForm(issueId, formValues);
}

// Runs on page load so old unresolved tickets can automatically become overdue.
function refreshAllIssueStatuses() {
    const issues = getAllIssues();

    issues.forEach(function (issue) {
        const correctStatus = enforceStatusRule(issue);

        if (VALID_STATUSES.includes(correctStatus) && issue.status !== correctStatus) {
            updateIssue(issue.id, { status: correctStatus });
        }
    });
}
