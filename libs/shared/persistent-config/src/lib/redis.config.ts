import Redis from "ioredis";
import { DynamicModule, Inject, Logger, Module } from "@nestjs/common";
import { environment } from "@app/shared/environments";

const defaultErrorHandler = (err) => {
    console.log(`Connection to Redis error: ${err}`);
};

export const REDIS_CONFIG = Inject('redis.config');

export class RedisConfig {
    static uri: string;
    static client: Redis;
    static subscriber: Redis;
    static allClients = [] as Redis[];

    static forRoot(uri: string) {
        this.uri = uri;
        const client = this.connect();
        const getJobOptions = this.getJobOptions;
        return { client, getJobOptions }
    };

    static connect(errorHandler = defaultErrorHandler, overrideClient = true) {
        const client = new Redis(
            this.uri,
            {
                maxRetriesPerRequest: 3
            }
        );

        client.on('ready', () => {
            Logger.log('[RedisConfig] Redis connection established!');
        });

        client.on('end', () => {
            Logger.log('[RedisConfig] Redis connection closed!');
        });

        client.on('error', errorHandler);

        if (overrideClient) {
            this.client = client;
        }

        this.allClients.push(
            client
        );

        return client;
    };

    static disconnect() {
        this.allClients.forEach((client) => {
            if (client) {
                Logger.log('Closing redis connection!');
                client.quit().catch(Logger.log);
            }
        });
        return null;
    };

    static getJobOptions() {
        if (!this.subscriber) {
            this.subscriber = RedisConfig.connect(undefined, false);
        }
        return {
            prefix: `jobs:${'article_service'}`,
            defaultJobOptions: {
                removeOnComplete: 100,
                removeOnFail: 100
            },
            createClient: (type) => {
                switch (type) {
                    case 'client':
                        return this.client;
                    case 'subscriber':
                        return this.subscriber;
                    default:
                        return RedisConfig.connect(undefined, false);
                }
            }
        };
    };
};

@Module({})
export class RedisProvider {
    static register(): DynamicModule {
        return {
            module: RedisProvider,
            providers: [
                {
                    provide: REDIS_CONFIG,
                    useFactory: () => RedisConfig.forRoot(
                        environment.REDIS_URI
                    ),
                },
            ],
            exports: [
                REDIS_CONFIG
            ],
        };
    }
}