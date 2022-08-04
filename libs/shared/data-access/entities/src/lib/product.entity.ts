import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Schema } from 'mongoose';
import { defaults, isNil, omitBy, pick, values } from 'lodash';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import { environment } from '@app/shared/environments';
import { ProductDto } from '@app/shared/data-access/models';

const Sources = {
    COLLECTION: 'Product',
    EVENT_SOURCE: `${environment.SERVICE_NAME}.product`
};

const Events = {
    PRODUCT_CREATED: `${environment.SERVICE_NAME}.product.created`,
    PRODUCT_UPDATED: `${environment.SERVICE_NAME}.product.updated`,
    PRODUCT_DELETED: `${environment.SERVICE_NAME}.product.deleted`
};

const Statuses = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const StatusNames = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Ngừng hoạt động'
};

const PublicFields = [
    'sku',
    'slug',
    'name',
    'price',
    'orignalPrice',
    'imageUrl',
    'videoUrl',
    'images',
    'status',
    'statusName',
    'parentId',
    'children',
    'models',
    'variations',
    'categories',
    'properties',
    'warehouses',
    'dimension',
    'reactCount'
];

class ProductEntity extends ProductDto {
    static Events = Events;
    static Sources = Sources;
    static Statuses = Statuses;
    static StatusNames = StatusNames;
    static PublicFields = PublicFields;

    eventBus: () => EventEmitter2;
    transform: () => ProductEntity;
};

interface IProductStatic extends Model<ProductEntity> {
    get(sku): Promise<ProductEntity>;
    list(params): Promise<ProductEntity[]>;
    filterParams(params): ProductEntity;
    getParentPath: (parentId) => Promise<[Schema.Types.ObjectId]>;
    convertToNestedProduct: (list, root) => ProductEntity[];
};

type ProductEntityType =
    Model<ProductEntity> &
    IProductStatic;

/**
 * Schema
 * @private
 */
const ProductSchema = new Schema<ProductEntity, IProductStatic>(
    {
        sku: {
            type: String,
            unique: true,
            minlength: 6,
            maxlength: 255,
            uppercase: true,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            minlength: 6,
            maxlength: 255,
            required: true
        },
        name: {
            type: String,
            minlength: 6,
            maxlength: 255,
            required: true
        },
        price: {
            type: Number,
            min: 1,
            required: true
        },
        orignalPrice: {
            type: Number,
            deafult: 0
        },
        imageUrl: {
            type: String,
            default: ''
        },
        videoUrl: {
            type: String,
            default: ''
        },
        images: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: values(Statuses),
            default: Statuses.ACTIVE
        },
        statusName: {
            type: String,
            enum: values(StatusNames),
            default: StatusNames.ACTIVE
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        children: {
            type: [Schema.Types.ObjectId],
            default: []
        },
        models: {
            type: [
                {
                    _id: false,
                    sku: {
                        type: String,
                        minlength: 6,
                        maxlength: 255,
                        uppercase: true,
                        required: true
                    },
                    name: String,
                    price: Number,
                    orignalPrice: Number,
                    optionIndex: [Number],
                    optionName: String
                }
            ],
            default: []
        },
        variations: {
            type: [
                {
                    _id: false,
                    name: String,
                    options: [String]
                }
            ],
            default: []
        },
        categories: {
            type: [
                {
                    _id: false,
                    id: String,
                    name: String,
                    slug: String
                }
            ],
            default: []
        },
        properties: {
            type: [
                {
                    _id: false,
                    id: String,
                    name: String,
                    value_id: String,
                    value_name: String
                }
            ],
            default: []
        },
        warehouses: {
            type: [
                {
                    _id: false,
                    id: String,
                    name: String,
                    quantity: Number
                }
            ],
            default: []
        },
        dimension: {
            type: {
                width: Number,
                height: Number,
                weight: Number
            },
            default: null
        },
        reactCount: {
            type: {
                view: Number,
                click: Number,
                order: Number,
                cancel: Number,
                return: Number
            },
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: {
                _id: false,
                id: String,
                name: String
            },
            default: null
        },
        updatedBy: {
            type: {
                _id: false,
                id: String,
                name: String
            },
            default: null
        },
    },
    {
        timestamps: true,
        collection: Sources.COLLECTION
    }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
ProductSchema.pre('init', function afterInit() {
    // next();
});


function filterConditions(params) {
    const options = omitBy(params, isNil);

    const { search, ids, nested } = options;

    if (!ids && nested) {
        options.parentId = null;
    }

    if (ids && nested) {
        options.$or = [
            {
                _id: { $in: ids }
            },
            {
                children: { $in: ids }
            }
        ];
    }
    delete options.ids;
    delete options.nested;

    if (search) {
        // set search option
        options.$text = {
            $search: search
        };
    }
    delete options.search;

    return options;
}

function sortConditions({ sortBy, orderBy }, Model) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    if (Object.keys(Model.schema.paths).indexOf(sortBy) !== -1) {
        if (orderBy === 'true') {
            sort[sortBy] = -1;
        } else {
            sort[sortBy] = 1;
        }
    }
    return sort;
}


/**
 * Methods
 */
ProductSchema.method({
    /**
     * Transform category field
     */
    transform() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformed: any = {};
        const fields = [
            'sku',
            'slug',
            'name',
            'price',
            'orignalPrice',
            'imageUrl',
            'videoUrl',
            'images',
            'status',
            'statusName',
            'parentId',
            'children',
            'models',
            'variations',
            'categories',
            'properties',
            'warehouses',
            'dimension',
            'reactCount',
            'createdBy',
            'updatedBy'
        ];

        transformed.id = this.id.toString();
        transformed.parentId = this.parentId === null
            ? this.parentId
            : this.parentId.toString();

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        // add additional field
        transformed.children = [];

        // add date field
        transformed.createdAt = moment(this.createdAt).unix();

        return transformed;
    },
});

/**
 * Statics
 */
ProductSchema.statics = {
    /**
     * Get list product
     * @param {Object} params - List filter params
     * @returns 
     */
    list({
        skip = 0,
        limit = 20,
        sortBy,
        orderBy,
        isActive,
        slug,
        nested,
        search,
        ids,
    }) {
        const options = filterConditions({
            isActive,
            slug,
            nested,
            search,
            ids
        });
        const sort = sortConditions(
            { sortBy, orderBy },
            this
        );
        return this.find(options)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec()
    },

    /**
     * Get product by sku
     * @param {String} sku - Product sku in request params
     * @returns
     */
    async get(sku) {
        const product = await this.findOne({ sku })
            .exec();
        if (product) {
            return product;
        }
        throw new NotFoundException({
            message: 'Product does not exist',
            status: HttpStatus.NOT_FOUND
        });
    },

    /**
     * Get Current Path
     * @param parentId
     * @returns 
     */
    async getParentPath(parentId) {
        if (!parentId) {
            return [];
        }
        const parentCategory = await this.findById(parentId).exec();
        const children = parentCategory.children.slice(0);
        children.push(parentCategory.id);
        return children;
    },

    /**
     * Convert to nested product
     * @param {ProductCategoryEntity[]} arr - List products
     * @param {ProductCategoryEntity} rootParent - Parent product
     * @returns 
     */
    convertToNestedProduct(arr, rootParent = null) {
        const nodes = {};
        return arr.filter((obj) => {
            const currentId = obj.id;
            let { parentId } = obj;
            const isRootParent = currentId === rootParent;

            nodes[currentId] = defaults(obj, nodes[currentId], {
                products: []
            });
            parentId =
                parentId &&
                (nodes[parentId] = nodes[parentId] || {
                    products: []
                }).products.push(obj);

            return !parentId || isRootParent;
        });
    },

    /**
     * Filter params
     * @param {*} params
     */
    filterParams(params) {
        return pick(params, PublicFields)
    }
};

export {
    ProductSchema,
    ProductEntity,
    ProductEntityType
};

