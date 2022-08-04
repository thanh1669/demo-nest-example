import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { omit } from "lodash";
import { ProductEntity, ProductEntityType } from '@app/shared/data-access/entities';
import { ProductCreateParamsDto, ProductListParamsDto } from '@app/shared/data-access/models';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(ProductEntity.name) private productModel: ProductEntityType
    ) { }

    /**
     * Save product
     * @param {ProductCreateParamsDto} body - Request body
     * @returns
     */
    saveProduct(body: ProductCreateParamsDto): Promise<ProductEntity> {
        const product = new this.productModel(body);
        return product.save();
    }

    /**
     * Bulk save product
     * @param {ProductCreateParamsDto[]} body - Request body
     * @returns
     */
    bulkSaveProduct(body: ProductCreateParamsDto[]) {
        return this.productModel.bulkSave(
            body
        );
    }

    /**
     * Get All Products
     * @param {ProductListParamsDto} params - Request query
     * @returns
     */
    async getAllProduct(params: ProductListParamsDto): Promise<ProductEntity[]> {
        let products = await this.productModel.list(
            params
        );
        // transform nested product
        const { nested } = params;
        let transformedProducts = products.map((product) =>
            product.transform()
        );
        if (nested) {
            products = await this.productModel.list({
                ids: products.map(i => i.id),
                limit: 1000,
                nested,
            });
            transformedProducts = this.productModel.convertToNestedProduct(
                products.map((product) => product.transform()),
                null
            );
        }
        return transformedProducts;
    }

    /**
     * Get product by id
     * @param {String} productSku - Product sku
     * @returns
     */
    async getProductBySku({ sku, query }): Promise<ProductEntity> {
        const product = await this.productModel.get(
            sku
        );
        const { nested } = query;
        let transformedProducts = [
            product.transform()
        ];
        if (nested) {
            const products = await this.productModel.list({
                ids: [product.id],
                limit: 1000,
                nested,
            });
            transformedProducts = this.productModel.convertToNestedProduct(
                products.map((product) => product.transform()),
                null
            );
        }
        return transformedProducts[0];
    }

    /**
     * Update product by id
     * @param {ProductEntity} product - List product public field
     * @returns
     */
    updateProductBySku(product: ProductEntity): Promise<ProductEntity> {
        return product.save();
    }

    /**
     * Replace product by id
     * @param {Request} req - Http request
     * @returns 
     */
    replaceProductBySku(req) {
        const { product } = req.locals;
        const newProduct = new this.productModel(req.body);
        const newProductObject = omit(newProduct.toObject(), '_id');
        return this.productModel.findOneAndUpdate(
            { _id: product._id },
            newProductObject,
            { new: true }
        );
    }
}