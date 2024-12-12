interface Config {
    apiUrl: string;
    apiTimeout: number;
    retryAttempts: number;
    retryDelay: number;
}

const getEnvironmentConfig = (): Config => {
    const env = process.env.NEXT_PUBLIC_ENV || 'development';
    console.log(env);
    const configs: Record<string, Config> = {
        development: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1',
            apiTimeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000
        },
        production: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://sapatofacilback-production.up.railway.app/v1',
            apiTimeout: 30000,
            retryAttempts: 2,
            retryDelay: 2000
        }
    };

    return configs[env] || configs.development;
};

const config: Config = getEnvironmentConfig();

export default config;