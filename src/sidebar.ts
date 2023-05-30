import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { copy } from "copy-paste";
import service, { IBaseConfig } from "./service";

let instance: JiraIssueProvider | null = null;
let config = vscode.workspace.getConfiguration("jira-issue");
let workspaceConfig: IBaseConfig = {};
if (vscode.workspace.workspaceFolders) {
  const configFilePath = `${vscode.workspace.workspaceFolders[0].uri.path}/jiraIssue.config.json`;
  try {
    workspaceConfig = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  } catch {
    workspaceConfig = {};
  }
  const watcher = vscode.workspace.createFileSystemWatcher(configFilePath);
  watcher.onDidChange((e) => {
    // file changed
    const res = fs.readFileSync(e.path, "utf-8");
    try {
      workspaceConfig = JSON.parse(res);
      mergeConfig = { ...config, ...workspaceConfig };
      instance && instance.refresh(mergeConfig);
    } catch {
      workspaceConfig = {};
    }
  });
}

let mergeConfig = { ...config, ...workspaceConfig };

service.setConfiguration(mergeConfig);

const emojiMap = {
  Open: "🆕",
  "In Progress": "🕐",
  Resolved: "👍",
  Done: "✅",
  Closed: "🚪",
  Reopened: "🔙",
  "To Do": "📝",
  Verity: "✔️",
};
export class JiraIssue extends vscode.TreeItem {
  constructor(
    readonly label: string,
    readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public item: any[]
  ) {
    super(label, collapsibleState);
  }
}

export class JiraIssueProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData =
    new vscode.EventEmitter<vscode.TreeItem | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private fetching: boolean = false;
  private isFilterByCurrentUser: boolean = false;
  private lastFetch: number = 0;
  private children: vscode.TreeItem[] | undefined;

  constructor(private context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.commands.registerCommand("jira-issue.filter", this.filter, this)
    );
    context.subscriptions.push(
      vscode.commands.registerCommand("jira-issue.refresh", this.refresh, this)
    );
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "jira-issue.assignToMe",
        this.assignToMe,
        this
      )
    );
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "jira-issue.copyJiraIssue",
        this.copyJiraIssue,
        this
      )
    );
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "jira-issue.openIssue",
        this.openIssue,
        this
      )
    );
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(this.pull, this)
    );
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(() => {
        const newconfig = vscode.workspace.getConfiguration("jira-issue");
        this.refresh(newconfig);
      })
    );
  }
  getTreeItem(element: JiraIssue): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: JiraIssue): Promise<vscode.TreeItem[]> {
    if (!element) {
      return [
        new JiraIssue(
          "All List",
          vscode.TreeItemCollapsibleState.Collapsed,
          []
        ),
        new JiraIssue(
          "Unresolved List",
          vscode.TreeItemCollapsibleState.Collapsed,
          []
        ),
      ];
    }
    let jqlList = [];
    if (mergeConfig.project) {
      jqlList.push(`project = "${mergeConfig.project}"`);
    }
    if (this.isFilterByCurrentUser) {
      jqlList.push("assignee = currentUser()");
    }
    if (element.label === "Unresolved List") {
      jqlList.push("resolution is EMPTY");
    }
    const issues = await this.getJiraIssues(jqlList);
    if (issues) {
      return issues;
    }
    return [];
  }

  async getJiraIssues(jqlList: string[]): Promise<vscode.TreeItem[]> {
    if (service.isInFaultedState) {
      return [new vscode.TreeItem(service.errorMessage)];
    }
    try {
      return await service
        .searchWithQueryFromConfig(jqlList.join(" AND "))
        .then((data: any) => {
          const children = data.issues.map((issue: any) => {
            const isBug = issue.fields.issuetype.name === "Bug";
            // @ts-ignore
            const statusIcon = emojiMap[issue.fields.status.name];

            const description = `(${
              statusIcon ? statusIcon : issue.fields.status.name
            }${isBug ? "🐛" : ""})${issue.key}: ${issue.fields.summary}`;
            const jiraIssue = new JiraIssue(
              description,
              vscode.TreeItemCollapsibleState.None,
              issue
            );

            if (issue.fields.assignee) {
              jiraIssue.iconPath = {
                light: this.context.asAbsolutePath(
                  path.join("assets", "light", "sign.svg")
                ),
                dark: this.context.asAbsolutePath(
                  path.join("assets", "dark", "sign.svg")
                ),
              };
            }

            jiraIssue.contextValue = "issue";
            return jiraIssue;
          });

          this.children = children;
          if (!children.length) {
            return [
              new vscode.TreeItem(
                "No issues found - try updating jqlExpression"
              ),
            ];
          }
          return children;
        });
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("Unauthorized (401)")) {
          return [new vscode.TreeItem("Username or api token is incorrect")];
        }
        return [new vscode.TreeItem(`Error retrieving issues: ${e.message}`)];
      }
      return [];
    }
  }

  private async pull() {
    const thirtyMinutes = 30 * 60 * 1000;
    if (!this.lastFetch || this.lastFetch + thirtyMinutes < Date.now()) {
      return this.refresh();
    }
  }

  private openIssue(issue: JiraIssue) {
    // @ts-ignore
    const base = issue.item.self.split("/rest")[0];
    // @ts-ignore
    const url = vscode.Uri.parse(`${base}/browse/${issue.item.key}`);
    vscode.commands.executeCommand("vscode.open", url);
  }

  private async copyJiraIssue(issue: JiraIssue) {
    // @ts-ignore
    copy(issue.item.key);
  }

  private async filter() {
    this.isFilterByCurrentUser = !this.isFilterByCurrentUser;
    this.refresh();
  }

  private async assignToMe(issue: JiraIssue) {
    // @ts-ignore
    await service.updateAssignee(issue.item.key);
    this.refresh();
  }

  public async refresh(
    newConfig?: IBaseConfig & vscode.WorkspaceConfiguration
  ) {
    if (!this.fetching) {
      if (newConfig) {
        config = newConfig;
        mergeConfig = { ...config, ...workspaceConfig };
        await service.setConfiguration(mergeConfig);
      }
      this.children = await this.getChildren();
      this._onDidChangeTreeData.fire(null);
    }
  }
}

export default function (context: vscode.ExtensionContext) {
  instance = new JiraIssueProvider(context);
  vscode.window.registerTreeDataProvider("jira-issue", instance);
}
