import * as vscode from "vscode";

export default function () {
  return vscode.commands.registerCommand("jira-issue.bearer", () => {
    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        password: false,
        prompt: "set your jira bearer",
      })
      .then((value) => {
        if (value === undefined || value.trim() === "") {
          vscode.window.showInformationMessage("Please type your bearer token.");
        } else {
          const val = value.trim();
          vscode.window.showInformationMessage(val);
          vscode.workspace.getConfiguration().update('jira-issue.bearer', val, true);
          return;
        }
      });
  });
};
