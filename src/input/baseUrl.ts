import * as vscode from "vscode";

export default function () {
  return vscode.commands.registerCommand("jira-issue.baseUrl", () => {
    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        password: false,
        prompt: "set your jira baseUrl",
      })
      .then((value) => {
        if (value === undefined || value.trim() === "") {
          vscode.window.showInformationMessage("Please type your base url.");
        } else {
          const val = value.trim();
          vscode.window.showInformationMessage(val);
          vscode.workspace.getConfiguration().update('jira-issue.baseUrl', val, true);
          return;
        }
      });
  });
};
