'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "auto-npm-install" is now active!');

  vscode.window.onDidChangeTextEditorSelection(e => {
    const { text } = activeEditor.document.lineAt(e.selections[0].start.line);

    if (isImportLine(text)) {
      console.log('import line');
    } else {
      console.log('not import line');
    }
  });

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    console.log(activeEditor.selection.active.line);
  }
}

const isImportLine = (text: string) => {
  return /^import (.*) from (.*);/.exec(text);
}

// this method is called when your extension is deactivated
export function deactivate() {}