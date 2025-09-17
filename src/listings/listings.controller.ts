import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { CarListingQueryParams } from './dto/query-param.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JWTGuard } from '../common/guards';
import { UserId } from '../common/decorator';
import { UploadMediaDto } from './dto/uplaod-media.dto';

@UseGuards(JWTGuard)
@ApiBearerAuth()
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create car listing' })
  @ApiResponse({
    status: 201,
    description: 'Car listing created successfully',
  })
  @UseInterceptors(
    FileInterceptor('primary_image'),
    FilesInterceptor('gallery_images', 4),
  )
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createListingDto: CreateListingDto,
    @UploadedFile() primaryImage: Express.Multer.File,
    @UploadedFiles() galleryImages: Express.Multer.File[],
    @UserId() userId: string,
  ) {
    return this.listingsService.create(
      createListingDto,
      primaryImage,
      galleryImages,
      userId,
    );
  }
  @Get()
  @ApiOperation({
    summary: 'Get all car listings with pagination and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Car listings retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: CarListingQueryParams) {
    return this.listingsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get car listing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car listing found',
  })
  @ApiResponse({
    status: 404,
    description: 'Car listing not found',
  })
  @ApiParam({ name: 'id', description: 'Car listing ID' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update car listing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car listing updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Car listing not found',
  })
  @ApiParam({ name: 'id', description: 'Car listing ID' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @UserId() userId: string,
  ) {
    return this.listingsService.update(id, updateListingDto, userId);
  }

  @ApiOperation({ summary: 'Delete car listing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car listing deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Car listing not found',
  })
  @ApiParam({ name: 'id', description: 'Car listing ID' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.listingsService.remove(id, userId);
  }

  @UseInterceptors(FilesInterceptor('images', 4), FilesInterceptor('videos', 2))
  @ApiOperation({ summary: 'Add media to car listing by ID' })
  @ApiResponse({ status: 200, description: 'Car listing updated successfully' })
  @ApiResponse({ status: 404, description: 'Car listing not found' })
  @ApiParam({ name: 'id', description: 'Car listing ID' })
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @Post(':id/upload')
  addMedia(
    @Param('id') id: string,
    @Body() uploadMediaDto: UploadMediaDto,
    @UserId() userId: string,
  ) {
    return this.listingsService.addMedia(id, uploadMediaDto, userId);
  }
}
