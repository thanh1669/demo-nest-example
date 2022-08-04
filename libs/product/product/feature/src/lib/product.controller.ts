import { Body, Controller, Get, Param, Patch, Post, Query, Request, UsePipes } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ProductCreateParamsDto, ProductDto, ProductListParamsDto } from "@app/shared/data-access/models";
import { ListValidator, ProductService } from "@app/product/product/data-access";
import { AuthValidationPipe } from "@app/shared/auth-config";

@ApiBearerAuth()
@ApiTags('Products')
@ApiSecurity('X-XSRF-TOKEN')
@Controller('v1/products')
export class ProductController {
    constructor(
        private service: ProductService
    ) { }


    @Get()
    @ApiOkResponse({ type: ProductDto })
    @UsePipes(new AuthValidationPipe(ListValidator))
    list(@Query() query: ProductListParamsDto) {
        return this.service.getAllProduct(query);
    }

    @Post()
    @ApiOkResponse({ type: ProductDto })
    create(@Body() body: ProductCreateParamsDto) {
        return { message: 'ProductController Works', body }
    }

    @Get(':sku')
    @ApiOkResponse({ type: ProductDto })
    @ApiParam({ name: 'sku', type: String })
    @UsePipes(new AuthValidationPipe(ListValidator))
    get(@Param() param, @Query() query: ProductListParamsDto) {
        return this.service.getProductBySku({
            sku: param.sku,
            query
        });
    }

    @Patch(':sku')
    @ApiParam({ name: 'sku', type: String })
    @ApiResponse({ type: ProductDto })
    async update(@Request() req, @Body() body: ProductCreateParamsDto) {
        const product = Object.assign(req.locals.product, body);
        return this.service.updateProductBySku(product);
    }

    @Post('bulkSave')
    @ApiOkResponse({ type: [ProductDto] })
    bulkSave(@Body() body: ProductCreateParamsDto[]) {
        return this.service.bulkSaveProduct(
            body
        );
    }
}
