module.exports = {
    "dataSource": "issues",
    "prefix": "",
    "onlyMilestones": false,
    "groupBy": {
        "Bugs Fixed:": ["bug"],
        "Closed (no labels):": ["closed"],
        "Documentation Improvements:": ["documentation"],
        "Duplicate Issues:": ["duplicate"],
        "Enhancements:": ["enhancement"],
        "Good First Issues:": ["good first issue"],
        "Greenkeeper Updates:": ["greenkeeper"],
        "Help Wanted:": ["help wanted"],
        "Invalid Issues:": ["invalid"],
        "On Hold Issues:": ["on hold"],
        "Questions:": ["question"],
        "Won't Fix:": ["wontfix"]
    },
    "changelogFilename": "CHANGELOG.md",
    "template": {
        commit: ({ message, url, author, name }) => `- [${message}](${url}) - ${author ? `@${author}` : name}`,
        issue: "- [{{text}}]({{url}}) {{name}}",
        label: "[**{{label}}**]",
        noLabel: "closed",
        group: "\n#### {{heading}}\n",
        changelogTitle: "# Changelog\n\n",
        release: "## {{release}} ({{date}})\n{{body}}",
        releaseSeparator: "\n---\n\n"
    }
}