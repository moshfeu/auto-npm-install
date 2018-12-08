import {
  workspace,
  TextDocument,
  Range,
  Command,
  CodeActionProvider
} from 'vscode';
import { existsSync } from 'fs';

export class ImportCheckerCodeAction implements CodeActionProvider {
  private getPackageIfImportAndNotInstalled(
    document: TextDocument,
    range: Range
  ) {
    const { text } = document.lineAt(range.start.line);
    if (!text.includes('from ')) {
      return;
    }
    const packageName = this.extractPackageFromImport(text);

    if (packageName && this.projectHasNodeModules()) {
      const isPackageInstalled = existsSync(
        `${workspace.rootPath}/node_modules/${packageName}`
      );

      if (!isPackageInstalled) {
        return packageName;
      }
    }
  }

  private projectHasNodeModules(): boolean {
    return existsSync(`${workspace.rootPath}/node_modules/`);
  }

  private extractPackageFromImport(line: string): string {
    const quoteChar = line.includes('from "') ? '"' : "'";
    const firstQuoteIndex = line.indexOf(quoteChar);
    const lastQuoteIndex = line.lastIndexOf(quoteChar);
    return line.substring(firstQuoteIndex + 1, lastQuoteIndex);
  }

  public provideCodeActions(document: TextDocument, range: Range): Command[] {
    const pack = this.getPackageIfImportAndNotInstalled(document, range);

    if (pack) {
      const command = `npm install ${pack}`;
      return [
        {
          title: command,
          command: 'extension.npmInstall',
          arguments: [pack, command]
        }
      ];
    }
  }
}
