'use strict';

import { ExtensionContext, Memento } from 'vscode';

const mementoMock: Memento = {
  get: (key: string) => '' as any,
  update: (key: string, value: any) => ({} as any)
};

export const context: ExtensionContext = {
  asAbsolutePath: () => '',
  extensionPath: '',
  globalState: mementoMock,
  workspaceState: mementoMock,
  subscriptions: [],
  storagePath: ''
};
