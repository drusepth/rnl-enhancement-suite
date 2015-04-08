$(document).ready(function () {
    console.log('loaded jira');

    $('div#release-report-tab-body').bind("DOMSubtreeModified", function() {
        // Apply a red color to rejected lozenges
        $(this).find('.jira-issue-status-lozenge-yellow:contains("Rejected")')
            .removeClass('jira-issue-status-lozenge-yellow')
            .addClass('jira-issue-status-lozenge-warm-red');

        // Apply a brown color for QA lozenges
        $(this).find('.jira-issue-status-lozenge-yellow')
            .filter(function () {
                var lozenge_text = $(this).text().toLowerCase();
                return lozenge_text.indexOf('qa') > -1 || lozenge_text.indexOf('staging') > -1;
            })
            .removeClass('jira-issue-status-lozenge-yellow')
            .addClass('jira-issue-status-lozenge-medium-gray');

    });

    console.log('done applying jira');
});