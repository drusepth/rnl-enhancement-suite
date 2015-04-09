console.log('loaded jira');

var status_colors = {
    'to do': 'blue-gray',
    'analyze': 'blue-gray',
    'rejected': 'warm-red',
    'in progress': 'yellow',
    'demo': 'yellow',
    'needs review': 'yellow',
    'qa ready': 'medium-gray',
    'qa in progress': 'medium-gray',
    'staging ready': 'yellow',
    'on staging': 'medium-gray',
    'staging qa': 'medium-gray',
    'staging rejected': 'warm-red',
    'accepted for release': 'green',
    'done': 'green'
};

function eval_when_present(selector, block) {
    var watcher = setInterval(function () {
        if ($(selector)) {
            block();
            clearInterval(watcher);
        }
    }, 200);
}

function issues_in_status(desired_status) {
    return $('tr[data-issue-key]').filter(function () {
        return desired_status.toLowerCase() === $(this).find('td.status > span.jira-issue-status-lozenge').text().toLowerCase();
    });
}

$('nav.release-report-tab-header').on('click', '.release-report-tab', function() {
    eval_when_present('.release-report-issues', function () {

        // Recolor status lozenges
        $.each(status_colors, function (status, color) {
            issues_in_status(status)
                .find('.jira-issue-status-lozenge')
                .removeClass('jira-issue-status-lozenge-yellow') // #todo todo/done don't have yellow default
                .addClass('jira-issue-status-lozenge-' + color);
        });

        // Redraw release status bar
        var release_bar = $('div.aui-group.status-category-blocks');
        if (release_bar) {
            var issue_count_by_status = {},
                issue_count_by_color = {},
                total_issues = 0;

            $.each(status_colors, function (status, color) {
                var issue_count = issues_in_status(status).length;
                issue_count_by_status[status] = issue_count;
                if (color in issue_count_by_color) {
                    issue_count_by_color[color] += issue_count;
                } else {
                    issue_count_by_color[color] = issue_count;
                }
                total_issues += issue_count;
            });

            var segment_template = release_bar.find('div.aui-item')
                .first()
                .removeAttr('style')
                .removeClass('green')
                .removeClass('yellow')
                .removeClass('blue-gray')
                .removeClass('done')
                .removeClass('intermediate')
                .removeClass('new');

            release_bar.html('');
            $.each(issue_count_by_color, function (color, number) {
                console.log('adding segment for ' + color + ' size ' + number);
                if (number > 0) {
                    segment_template.clone()
                        .addClass(color)
                        .css('width', number / total_issues * 100 + '%')
                        .css('height', '20')
                        .css('color', '#ffffff')
                        .css('text-align', 'center')
                        .css('overflow', 'hidden')
                        .text(number + ' issue' + (number == 1 ? '' : 's'))
                        .appendTo(release_bar);
                }
            });
        }

    });
});




console.log('done applying jira');