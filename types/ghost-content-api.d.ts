declare module '@tryghost/content-api' {
  interface GhostContentAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  class GhostContentAPI {
    constructor(options: GhostContentAPIOptions);
    posts: {
      browse(options?: any): Promise<any>;
      read(idOrFilter?: any, options?: any): Promise<any>;
    };
    pages: {
      browse(options?: any): Promise<any>;
      read(idOrFilter?: any, options?: any): Promise<any>;
    };
    tags: {
      browse(options?: any): Promise<any>;
    };
    authors: {
      browse(options?: any): Promise<any>;
    };
  }

  export = GhostContentAPI;
}
