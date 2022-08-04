import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductEntity, ProductEntityType } from "@app/shared/data-access/entities";

@Injectable()
class ProductMiddleware {
    readonly productModel = this._productModel;

    constructor(
        @InjectModel(ProductEntity.name) private _productModel: ProductEntityType,
    ) { }
}

/**
 * Load category append to locals
 */
class loadProduct extends ProductMiddleware implements NestMiddleware {
    async use(req, res, next) {
        const product = await this.productModel.get(req.params.sku);
        req.locals = req.locals ? req.locals : {};
        req.locals.product = product;
        next();
    }
}

/**
 * Load total category append to locals
 */
class getProductCount extends ProductMiddleware implements NestMiddleware {
    async use(req, res, next) {
        const productCount = await this.productModel.countDocuments(req.query);
        req.locals = req.locals ? req.locals : {};
        req.locals.productCount = productCount;
        next();
    }
}

/**
 * Load product update data
 */
class preparUpdateProduct extends ProductMiddleware implements NestMiddleware {
    async use(req, res, next) {
        const { product } = req.locals;
        const params = this.productModel.filterParams(
            req.body
        );
        if (params.categories) {
            // TODO: Load categories here
        }
        if (params.properties) {
            // TODO: Load categories here
        }
        if (product.models) {
            params.models = product.models.map(item => {
                if (item.sku === product.sku) {
                    item.sku = params.sku;
                    item.name = params.name;
                    item.price = params.price;
                    item.originalPrice = params.orignalPrice;
                }
                return item;
            });
        }
        req.body = params;
        next();
    }
}

/**
 * Load product save data
 */
class preparBulkSaveProduct extends ProductMiddleware implements NestMiddleware {
    async use(req, res, next) {
        const product = this.productModel.filterParams(
            req.body
        );
        if (product.categories) {
            // TODO: Load categories here
        }
        if (product.properties) {
            // TODO: Load categories here
        }
        const transformedProducts = product.models.map((item) => {
            return new this.productModel(
                Object.assign(
                    product,
                    item
                )
            );
        });
        const operations = transformedProducts.map((item, index) => {
            item.parentId = index !== 0
                ? transformedProducts[0]._id
                : null;
            if (item.parentId) {
                item.children = [
                    item.parentId
                ];
            }
            return item;
        });
        req.body = operations;
        next();
    }
}

export {
    loadProduct,
    getProductCount,
    preparUpdateProduct,
    preparBulkSaveProduct,
    ProductMiddleware
}
