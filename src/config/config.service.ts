import * as dotenv from 'dotenv';
dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string | undefined {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode != 'development';
  }

  //   public getJWTSecret() {
  //     return this.getValue('JWT_SECRET', true);
  //   }

  public getAllowedDomains() {
    return this.getValue('WHITELIST_DOMAINS', true)?.split(' ');
  }
}

const configService = new ConfigService(process.env);
export { configService };
