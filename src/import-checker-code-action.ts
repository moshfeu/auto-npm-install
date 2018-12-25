'use strict';

import { workspace, TextDocument, Range, Command, CodeActionProvider, CodeActionContext } from 'vscode';
import { existsSync } from 'fs';

export class ImportCheckerCodeAction implements CodeActionProvider {
  private getPackageIfImportAndNotInstalled(document: TextDocument, range: Range) {
    const { text } = document.lineAt(range.start.line);
    const pack = this.extractPackageFromImport(text);

    if (pack && this.projectHasNodeModules()) {
      const isPackageInstalled = existsSync(`${workspace.rootPath}/node_modules/${pack}`);

      if (!isPackageInstalled) {
        return pack;
      }
    }
  }

  private getPackageFromDiagnostic(context: CodeActionContext): string {
    let pack = '';
    context.diagnostics.forEach(diagnostic => {
      const result = /cannot find module '(.*)'/im.exec(diagnostic.message);
      if (result && result.length > 1) {
        pack = result[1];
      }
    });
    return pack;
  }

  private projectHasNodeModules(): boolean {
    return existsSync(`${workspace.rootPath}/node_modules/`);
  }

  private extractPackageFromImport(text: string): string {
    try {
      const [,,packageName] = /^import (.*) from ['|"]+([^./]{0,})+['|"];$/.  exec(text) || ['', '', ''];
      return packageName;
    } catch (error) {
      console.log(error);
    }
  }

  public provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext): Command[] {
    let pack: string;
    const isTsFile = document.languageId === 'typescriptreact' || document.languageId === 'typescript';
    if (isTsFile) {
      pack = this.getPackageFromDiagnostic(context);
    }

    // if didn't succeed to fetch from diagnostic
    if (!isTsFile || !pack) {
      pack = this.getPackageIfImportAndNotInstalled(document, range);
    }

    if (pack) {
      return ['--save', '--save-dev'].map(flag => {
        const command = `npm install ${pack} ${flag}`;
        return {
          title: command,
          command: 'extension.npmInstall',
          arguments: [pack, command]
        };
      });
    }
  }
}