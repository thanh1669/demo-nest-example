import '@nestjs/common';

export const environment = {
    PORT: 3000,
    NODE_ENV: 'development',
    MONGO_URI: 'mongodb://127.0.0.1:27017/shopee-clone?authSource=admin',
    REDIS_URI: 'redis://127.0.0.1:6379',
    SERVICE_NAME: 'service'
};
