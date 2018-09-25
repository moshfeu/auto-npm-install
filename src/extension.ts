'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands } from 'vscode';
import { ImportCheckerCodeAction } from './import-checker-code-action';
import * as cp from 'child_process';
import { handleCommand } from './commands/npm-install';

let p: cp.ChildProcess;

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "auto-npm-install" is now active!');
  let importCheckerCodeAction = languages.registerCodeActionsProvider(['typescript', 'javascript'], new ImportCheckerCodeAction())
  let disposable = commands.registerCommand('extension.npmInstall', handleCommand);
  context.subscriptions.push(importCheckerCodeAction, disposable);
}

export function deactivate() {
  p.kill();
}