import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseProvider } from "./mongoose.config";
import { RedisProvider } from "./redis.config";
import { ErrorHandlerProvider } from "./error-handler.config";

@Module({
    imports: [
        RedisProvider.register(),
        MongooseProvider.register(),
        ErrorHandlerProvider.register(),
        EventEmitterModule.forRoot({ maxListeners: 20 }),
    ],
    providers: [],
    exports: []
})
export class PersistentConfigModule { }