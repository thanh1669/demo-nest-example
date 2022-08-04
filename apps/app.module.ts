import { ApiProductProductFeatureModule } from '@app/product/product/feature';
import { SharedEntitiesModule } from '@app/shared/data-access/entities';
import { PersistentConfigModule } from '@app/shared/persistent-config';
import { Module } from '@nestjs/common';

// App components
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

@Module({
    imports: [
        PersistentConfigModule,
        SharedEntitiesModule,

        ApiProductProductFeatureModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
