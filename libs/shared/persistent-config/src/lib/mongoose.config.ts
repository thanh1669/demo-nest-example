import { DynamicModule, Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose, { Connection } from "mongoose";
import { environment } from "@app/shared/environments";

if (environment.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

@Module({})
export class MongooseProvider {
    static register(): DynamicModule {
        return {
            module: MongooseProvider,
            exports: [
                MongooseProvider
            ],
            imports: [
                MongooseModule.forRoot(
                    environment.MONGO_URI,
                    {
                        connectionFactory: (connection: Connection) => {
                            Logger.log('[MongooseConfig] Mongodb connection established!');
                            return connection;
                        }
                    }
                )
            ]
        };
    }
}