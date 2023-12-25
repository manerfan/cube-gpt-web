export * as authService from './auth';
export * as userService from './user';
export * as setupService from './system/setup';

export enum ErrorShowType {
    SILENT = 'SILENT',
    WARN_MESSAGE = 'WARN_MESSAGE',
    ERROR_MESSAGE = 'ERROR_MESSAGE',
    NOTIFICATION = 'NOTIFICATION',
    REDIRECT = 'REDIRECT',
  }
  