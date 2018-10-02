'use strict';

import { ExtensionContext, languages, commands } from 'vscode';
import { ImportCheckerCodeAction } from './import-checker-code-action';
import { CommandHandler as NpmInstallCommandHandler } from './commands/npm-install';

let ch: NpmInstallCommandHandler;

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "auto-npm-install" is now active!');
  ch = new NpmInstallCommandHandler();

  const importCheckerCodeAction = languages.registerCodeActionsProvider(['typescript', 'javascript'], new ImportCheckerCodeAction());
  const disposable = commands.registerCommand('extension.npmInstall', ch.handle);

  context.subscriptions.push(importCheckerCodeAction, disposable);
}

export function deactivate() {
  ch.dispose();
}