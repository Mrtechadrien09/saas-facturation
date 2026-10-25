declare module 'express-session' {
  import type { Request, Response, NextFunction } from 'express';

  interface SessionData {
    [key: string]: any;
  }

  interface Session {
    id: string;
    cookie: any;
    regenerate(callback: (err?: any) => void): void;
    destroy(callback: (err?: any) => void): void;
    reload(callback: (err?: any) => void): void;
    save(callback?: (err?: any) => void): void;
    touch(callback?: (err?: any) => void): void;
    [key: string]: any;
  }

  function session(options?: any): (req: Request, res: Response, next: NextFunction) => void;

  export = session;
}
