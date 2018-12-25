'use strict';

import { ExtensionContext, languages, commands } from 'vscode';
import { ImportCheckerCodeAction } from './import-checker-code-action';
import { CommandHandler as NpmInstallCommandHandler } from './commands/npm-install';

let ch: NpmInstallCommandHandler;

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "auto-npm-install" is now active!');
  ch = new NpmInstallCommandHandler();

  const documents = ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'];
  const importCheckerCodeAction = languages.registerCodeActionsProvider(documents, new ImportCheckerCodeAction());
  const npmInstallDisposable = commands.registerCommand('extension.npmInstall', ch.handle);
  const npmInstallDevDisposable = commands.registerCommand('extension.npmInstallDev', ch.handle);

  context.subscriptions.push(importCheckerCodeAction, npmInstallDisposable, npmInstallDevDisposable);
}

export function deactivate() {
  ch.dispose();
}