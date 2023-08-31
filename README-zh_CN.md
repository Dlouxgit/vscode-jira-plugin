# jira-issue README

一个简单的 jira issue 插件。

> 这个 vscode 扩展是一个精简版本，仅包含最常用的功能。它的功能越多，使用起来就越复杂，我不想增加不必要的复杂性。

![Jira Issues in Action](assets/jira-issue.gif)

[English](./README.md) | 简体中文

## Features

点击在侧边栏的 jira-issue，你可以看到 jira 的描述和状态。

行首的小三角标志表示该问题的受让人是你自己。

这些表情符号代表 Jira 问题的状态：

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

```
待办: "🆕",
处理中: "🕐",
已解决: "👍",
完成: "✅",
已关闭: "🚪",
重新打开: "🔙",
待验证: "✔️",
"需求池": "💼",
修复中: '🛠️',
待确认: '🕵️'
```

右键单击任何一个列表子项，将出现一个菜单：

- Change Issue Status
- Open Issue
- Commit By Issue
- Copy Issue Number
- Copy Issue Title
- Assign To Me

将鼠标悬停在任何 jira issue 上，您可以在行尾看到四个图标，单击它们将触发分配给我、按 issue 提交 git、复制 issue 编号、复制 issue 标题。

主侧边栏右上角的图标功能是刷新和按受让人是否为自己做列表过滤。

## Set up

1. 打开命令面板（Windows 和 Linux 上为 Ctrl+Shift+P，OS X 上为 Cmd+Shift+P）并搜索 jira
2. 设置你的 Jira base url 和 bearer（或 username 和 password）
3. 单击 vscode 侧栏中的 jira-issue 图标，开始使用吧！

### Tips

这里有一些可用的快捷键: 

- 使用 `Cmd+Shift+[` 设置 the bearer token
- 使用 `Cmd+Shift+]` 设置 the base url
- 使用 `Cmd+Shift+-` 设置 the username
- 使用 `Cmd+Shift+\` 设置 the password

## Extra

你可以在工作区中创建 jiraIssue.config.json 文件，并输入 project 作为默认过滤器内容。当然，如果你同时在 vscode 的全局配置中设置了相同的属性，如 base url，则会覆盖 vscode 中的全局配置。

这是一个例子:

```json
{
  "project": ["projectName"],
  "baseUrl": "xxx"
}
```

> 打开 vscode 设置（Open Settings），输入 jira-issue.replaceMethods，修改它的值来替换你的 git 提交信息，它是一个正则表达式字符串

## Changelog

[了解最新改进][changelog].

[changelog]: https://github.com/Dlouxgit/vscode-jira-plugin/blob/main/CHANGELOG.md

## Contributing

查看源代码 [GitHub Repository](https://github.com/Dlouxgit/vscode-jira-plugin).

## License
[MIT](./License.md)

**Enjoy!**
