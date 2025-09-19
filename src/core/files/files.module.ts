import { Global, Module } from '@nestjs/common';
import { FileService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(
            process.cwd(),
            `${configService.get('UPLOAD_DIR')}` || '/uploads',
          ),
          serveRoot: '/uploads',
        },
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
