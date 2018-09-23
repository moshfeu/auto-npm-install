'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "auto-npm-install" is now active!');

  vscode.window.onDidChangeTextEditorSelection(e => {
    const activeEditor = vscode.window.activeTextEditor;
    const { text } = activeEditor.document.lineAt(e.selections[0].start.line);
    const pack = getPackageFromImport(text);

    if (pack) {
      const isPackageInstalled = fs.existsSync(`${vscode.workspace.rootPath}/node_modules/${pack}`);
      console.log('isPackageInstalled', isPackageInstalled);
    } else {
      console.log('not import line');
    }
  });
}

const getPackageFromImport = (text: string): string => {
  try {
    const [,,packageName] = /^import (.*) from ['|"]+([^./]{0,})+['|"];$/.  exec(text) || ['', '', ''];
    return packageName;
  } catch (error) {
    console.log(error);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}