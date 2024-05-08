export * as authService from './auth';
export * as systemService from './system';
export * as userService from './user';
export * as llmService from './llm';
export * as workspaceService from './workspace';

export enum ErrorShowType {
  SILENT = 'SILENT',
  WARN_MESSAGE = 'WARN_MESSAGE',
  ERROR_MESSAGE = 'ERROR_MESSAGE',
  NOTIFICATION = 'NOTIFICATION',
  REDIRECT = 'REDIRECT',
}

export enum FormFieldValueStatusEnum {
  Success = 'Success',
  Error = 'Error',
  Processing = 'Processing',
  Warning = 'Warning',
  Default = 'Default',
}

