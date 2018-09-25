import { workspace, TextDocument, Range, CodeActionContext, CancellationToken, Command, CodeActionProvider } from 'vscode';
import { existsSync } from 'fs';

export class CodeAction implements CodeActionProvider {
  private getPackageIfImportAndNotInstalled(document: TextDocument, range: Range) {
    const { text } = document.lineAt(range.start.line);
    const pack = this.extractPackageFromImport(text);

    if (pack) {
      const isPackageInstalled = existsSync(`${workspace.rootPath}/node_modules/${pack}`);

      if (!isPackageInstalled) {
        return pack;
      }
    }
  }

  private extractPackageFromImport(text: string): string {
    try {
      const [,,packageName] = /^import (.*) from ['|"]+([^./]{0,})+['|"];$/.  exec(text) || ['', '', ''];
      return packageName;
    } catch (error) {
      console.log(error);
    }
  }

  public provideCodeActions(document: TextDocument, range: Range,
    context: CodeActionContext, token: CancellationToken): Command[] {

    const pack = this.getPackageIfImportAndNotInstalled(document, range)

    if (pack) {
      const command = `npm install ${pack}`;
      return [
        {
          title: command,
          command: 'extension.npmInstall',
          arguments: [pack, command]
        }
      ]
    }
  }
}