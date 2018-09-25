import * as cp from 'child_process';
import { window, workspace } from 'vscode';

export const handleCommand = (pack: string, command: string) => {
  // const terminal = window.createTerminal(`Ext Terminal #${1}`);
  // terminal.sendText(command);
  // terminal.dispose();
  return cp.exec(command, {cwd: workspace.rootPath, env: process.env}, (e, stdout) => {
    if (e) {
      window.showErrorMessage(e.message);
    } else if (stdout) {
      window.showInformationMessage(`The package ${pack} installed successfully :)`);
    }
  });
}