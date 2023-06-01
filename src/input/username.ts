import * as vscode from "vscode";

export default function () {
  return vscode.commands.registerCommand("jira-issue.username", () => {
    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        password: false,
        prompt: "set your jira username",
      })
      .then((value) => {
        if (value === undefined || value.trim() === "") {
          vscode.window.showInformationMessage("Please type your username.");
        } else {
          const val = value.trim();
          vscode.window.showInformationMessage(val);
          vscode.workspace.getConfiguration().update('jira-issue.username', val, true);
          return;
        }
      });
  });
};
