import { ref, uploadString, deleteObject, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { signInAnonymously, getAuth } from 'firebase/auth';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  error?: Error;
}

class Logger {
  private static logs: LogEntry[] = [];
  private static enableStorageConnectionLog = false;

  static info(message: string, data?: any) {
    this.log('info', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  static error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error);
    console.error('[Error]', message, error, data);
  }

  private static log(level: LogLevel, message: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      error
    };

    this.logs.push(entry);
    
    if (level === 'error') {
      this.reportError(entry);
    }
  }

  private static reportError(entry: LogEntry) {
    console.error('Error Report:', entry);
  }

  static getLogs() {
    return [...this.logs];
  }

  static clear() {
    this.logs = [];
  }

  static setStorageConnectionLogEnabled(enabled: boolean) {
    this.enableStorageConnectionLog = enabled;
  }

  static async testStorageConnection(): Promise<boolean> {
    try {
      const auth = getAuth();
      await signInAnonymously(auth);
      
      if (this.enableStorageConnectionLog) {
        Logger.info('Storage connection authenticated successfully');
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Storage connection test failed', error as Error, { errorMessage });
      return false;
    }
  }
}

export default Logger;