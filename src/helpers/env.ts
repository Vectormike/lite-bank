import * as dotenv from 'dotenv';

dotenv.config();

class Env {
    nodeEnv = this.get('NODE_ENV');

    get(variable: string): string {
        return process.env[variable];
    }

    getFrontendBaseUrl(): string {
        if (this.nodeEnv === 'development') {
            return this.get('LOCAL_UI_BASEURL');
        }
        return this.get('REMOTE_UI_BASEURL');
    }

    getBackendUrl(): string {
        if (this.nodeEnv === 'development') {
            return this.get('BASE_URL_DEV');
        }
        return this.get('BASE_URL_URL_PROD');
    }

}


export default new Env();