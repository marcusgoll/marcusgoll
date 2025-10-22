declare module '@tryghost/content-api' {
  export default class GhostContentAPI {
    constructor(options: { url: string; key: string; version: string });
    posts: {
      browse(options: { limit?: string | number; include?: string | string[]; filter?: string; formats?: string[] }): Promise<any[]>;
      read(data: { id?: string; slug?: string }, options?: { include?: string | string[]; formats?: string[] }): Promise<any>;
    };
    tags: {
      browse(options?: { limit?: string | number; include?: string | string[]; filter?: string }): Promise<any[]>;
    };
    pages: {
      browse(options: { limit?: string | number; include?: string | string[]; filter?: string }): Promise<any[]>;
      read(data: { id?: string; slug?: string }, options?: { include?: string | string[] }): Promise<any>;
    };
  }
}

declare module '@tryghost/admin-api' {
  export default class GhostAdminAPI {
    constructor(options: { url: string; key: string; version: string });
    posts: {
      browse(options: { limit?: string | number; include?: string | string[]; filter?: string; formats?: string[] }): Promise<any[]>;
    };
  }
}
