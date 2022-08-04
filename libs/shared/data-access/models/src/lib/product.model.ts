import { Document, Schema } from "mongoose";
import { ApiProperty, OmitType } from '@nestjs/swagger'

export class ProductDto extends Document {
    @ApiProperty({ required: true })
    sku: string;

    @ApiProperty({ required: true })
    slug: string;

    @ApiProperty({ required: true })
    name: string;

    @ApiProperty({ required: true })
    price: number;

    @ApiProperty({ required: false })
    orignalPrice: number;

    @ApiProperty({ required: false })
    imageUrl: string;

    @ApiProperty({ required: false })
    videoUrl: string;

    @ApiProperty({ required: false })
    images: string[];

    @ApiProperty({ required: false })
    status: string;

    @ApiProperty({ required: false })
    statusName: string;

    @ApiProperty({ type: String, required: false })
    parentId: Schema.Types.ObjectId;

    @ApiProperty({ type: [String], required: false })
    children: Schema.Types.ObjectId[];

    @ApiProperty({ required: false })
    models: [];

    @ApiProperty({ required: false })
    variations: [];

    @ApiProperty({ required: false })
    categories: [];

    @ApiProperty({ required: false })
    properties: [];

    @ApiProperty({ required: false })
    warehouses: [];

    @ApiProperty({ required: false })
    dimension: object;

    @ApiProperty({ required: false })
    reactCount: object;

    @ApiProperty({ required: false })
    isActive: boolean;

    @ApiProperty({ required: false })
    createdBy: object;

    @ApiProperty({ required: false })
    updatedBy: object;
};

export class ProductCreateParamsDto extends OmitType(
    ProductDto,
    [
        "status",
        "statusName",
        "children",
        "isActive",
        "reactCount",
        "warehouses",
    ]
) { };


export class ProductListParamsDto {
    @ApiProperty({ default: 0, required: true })
    skip: number;

    @ApiProperty({ default: 20, required: true })
    limit: number;

    @ApiProperty({ required: false })
    nested: boolean;

    @ApiProperty({ required: false })
    slug: string;
}