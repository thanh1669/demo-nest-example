import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { loadProduct, preparBulkSaveProduct, preparUpdateProduct, ProductMiddleware, ProductService } from '@app/product/product/data-access';
import { ProductController } from './product.controller';

@Module({
    controllers: [
        ProductController
    ],
    providers: [
        ProductMiddleware,
        ProductService
    ],
    exports: [],
})
export class ApiProductProductFeatureModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(loadProduct)
            .forRoutes({ path: '/v1/products/:sku', method: RequestMethod.GET });

        consumer
            .apply(loadProduct, preparUpdateProduct)
            .forRoutes({ path: '/v1/products/:sku', method: RequestMethod.PATCH })

        consumer
            .apply(preparBulkSaveProduct)
            .forRoutes({ path: '/v1/products/bulkSave', method: RequestMethod.POST })

    }
}
