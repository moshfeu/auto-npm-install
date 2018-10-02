'use strict';

import * as cp from 'child_process';
import { window, workspace } from 'vscode';

export class CommandHandler {
  private cp: cp.ChildProcess;
  private done: boolean;

  public handle = (pack: string, command: string): void => {
    this.cp = cp.exec(command, {cwd: workspace.rootPath, env: process.env}, (e, stdout) => {
      if (e) {
        window.showErrorMessage(e.message);
      } else if (stdout) {
        window.showInformationMessage(`The package ${pack} installed successfully :)`);
      }
      this.done = true;
    });
  }

  public dispose(): void {
    if (!this.done && this.cp && !this.cp.killed && this.cp.connected) {
      this.cp.kill();
    }
  }
}