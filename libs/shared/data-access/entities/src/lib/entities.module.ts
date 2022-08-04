import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductEntity, ProductSchema } from './product.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

const EntityProviders = [
    {
        schema: ProductSchema,
        name: ProductEntity.name
    }
];

const MongooseModules = MongooseModule.forFeatureAsync(
    EntityProviders.map(
        entity => ({
            name: entity.name,
            useFactory: (emitter) => {
                const schema = entity.schema;
                schema.methods.eventBus = () => emitter;
                return schema;
            },
            inject: [EventEmitter2]
        })
    )
);

@Global()
@Module({
    imports: [
        MongooseModules
    ],
    exports: [
        MongooseModules
    ],
    providers: [],
})
export class SharedEntitiesModule { }
