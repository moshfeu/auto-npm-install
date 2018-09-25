'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExtensionContext, languages, commands, window } from 'vscode';
import { CodeAction } from './code-action';
import * as cp from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let p: cp.ChildProcess;

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "auto-npm-install" is now active!');
  let codeActionFixer = languages.registerCodeActionsProvider(['typescript', 'javascript'], new CodeAction())
  let disposable = commands.registerCommand('extension.npmInstall', (pack: string, command: string) => {
    p = cp.exec(command, {cwd: vscode.workspace.rootPath, env: process.env}, (e, stdout) => {
      if (e) {
        window.showErrorMessage(e.message);
      } else if (stdout) {
        window.showInformationMessage(`The package ${pack} installed successfully :)`);
      }
    });
    // const terminal = window.createTerminal(`Ext Terminal #${1}`);
    // terminal.sendText(command);
    // terminal.dispose();
  });
  context.subscriptions.push(codeActionFixer, disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  p.kill();
}