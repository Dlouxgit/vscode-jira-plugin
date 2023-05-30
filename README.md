# jira-issue README

A simple extension for Jira issues within vscode.

![Jira Issues in Action](assets/jira-issue.gif)

## Features

Click on jira-issue in the sidebar, you can see the description and status of jira. 

The flag at the beginning of the line indicates that the Assignee of this issue is you

These emoji represent the status of Jira issue:

```
Open: 🆕
In Progress: 🕐
Resolved: 👍
Done: ✅
Closed: 🚪
Reopened: 🔙
Todo: 📝
Verity: ✔️
Bug: 🐛
```

Right click on the tree item and a menu will appear:

- OpenIssue
- Copy Issue Number
- Assign To Me

Hover over any jira issue and you can see two icons at the end of the row, click on them will trigger copy and assign to me.


The icons in the upper right corner of the main sidebar are refresh and filter.

## Set up

1. Open the command palette (Ctrl+Shift+P on Windows and Linux, Cmd+Shift+P on OS X) and search for jira.
2. set your Jira base url, bearer (or username and password)
3. Click jira-issue in the sidebar

### Tips

Here are some keybinds you can use: 

- Use `Cmd+Shift+[` to set the bearer token
- Use `Cmd+Shift+]` to set the base url
- Use `Cmd+Shift+-` to set the username
- Use `Cmd+Shift+\` to set the password


## License
[MIT](./License.md)

**Enjoy!**
