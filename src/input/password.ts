import * as vscode from "vscode";

export default function () {
  return vscode.commands.registerCommand("jira-issue.password", () => {
    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        password: false,
        prompt: "set your jira password",
      })
      .then((value) => {
        if (value === undefined || value.trim() === "") {
          vscode.window.showInformationMessage("Please type your password.");
        } else {
          const val = value.trim();
          vscode.window.showInformationMessage(val);
          vscode.workspace.getConfiguration().update('jira-issue.password', val, true);
          return;
        }
      });
  });
};
