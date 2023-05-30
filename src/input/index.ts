import * as vscode from "vscode";
import bearer from "./bearer";
import baseUrl from "./baseUrl";
import password from "./password";
import username from "./username";

export default function (context: vscode.ExtensionContext) {

  context.subscriptions.push(bearer());
  context.subscriptions.push(baseUrl());
  context.subscriptions.push(password());
  context.subscriptions.push(username());
};
