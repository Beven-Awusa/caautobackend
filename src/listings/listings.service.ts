import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsRepository } from './listings.repository';
import { CarListingQueryParams } from './dto/query-param.dto';
import { FileService } from '../core/files/files.service';
import { UserRepository } from '../core/users/user.repository';
import { UploadMediaDto } from './dto/uplaod-media.dto';

@Injectable()
export class ListingsService {
  constructor(
    private listingsRepository: ListingsRepository,
    private fileService: FileService,
    private readonly usersRepository: UserRepository,
  ) {}
  async create(
    createListingDto: CreateListingDto,
    primaryImage: Express.Multer.File,
    galleryImages: Express.Multer.File[],
    userId: string,
  ) {
    try {
      const user = await this.usersRepository.findUserById(userId);
      if (!user) throw new NotFoundException(`User with ${userId} not found`);
      if (primaryImage) {
        const uploadedPrimaryImage =
          await this.fileService.uploadFile(primaryImage);
        createListingDto.primary_image = uploadedPrimaryImage.url;
      }
      if (galleryImages.length > 0) {
        const uploadedGalleryImages =
          await this.fileService.uploadFiles(galleryImages);
        createListingDto.gallery_images = uploadedGalleryImages.map(
          (image) => image.url,
        );
      }
      return this.listingsRepository.create({
        make: { connect: { id: createListingDto.make_id } },
        model: { connect: { id: createListingDto.model_id } },
        condition: createListingDto.condition,
        description: createListingDto.description,
        doors: createListingDto.doors,
        driveType: createListingDto.drive_type,
        engineSize: createListingDto.engine_size,
        featured: createListingDto.featured,
        fuelType: createListingDto.fuel_type,
        galleryImages: createListingDto.gallery_images,
        interiorColor: createListingDto.interior_color,
        location: createListingDto.location,
        mileage: createListingDto.mileage,
        price: createListingDto.price,
        primaryImage: createListingDto.primary_image,
        seats: createListingDto.seats,
        status: createListingDto.status,
        transmission: createListingDto.transmission,
        title: createListingDto.title,
        user: { connect: { id: userId } },
        year: createListingDto.year,
        videos: createListingDto.videos,
        vin: createListingDto.vin,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(params: CarListingQueryParams) {
    try {
      console.log(params);
      const listings = await this.listingsRepository.findAll(params);
      return listings;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const listing = await this.listingsRepository.find(id);
      if (!listing) throw new NotFoundException(`Listing with ${id} not found`);
      return listing;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateListingDto: UpdateListingDto, userId: string) {
    try {
      const listing = await this.listingsRepository.find(id);
      if (!listing) throw new NotFoundException(`Listing with ${id} not found`);

      const user = await this.usersRepository.findUserById(userId);
      if (!user) throw new NotFoundException(`User with ${userId} not found`);

      const updatedListing = await this.listingsRepository.update(id, {
        color: updateListingDto.color,
        description: updateListingDto.description,
        doors: updateListingDto.doors,
        engineSize: updateListingDto.engine_size,
        featured: updateListingDto.featured,
        interiorColor: updateListingDto.interior_color,
        location: updateListingDto.location,
        mileage: updateListingDto.mileage,
        price: updateListingDto.price,
        seats: updateListingDto.seats,
        status: updateListingDto.status,
        title: updateListingDto.title,
        year: updateListingDto.year,
        cylinders: updateListingDto.cylinders,
      });
      return updatedListing;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const listing = await this.listingsRepository.find(id);
      if (!listing) throw new NotFoundException(`Listing with ${id} not found`);

      if (listing.userId !== userId)
        throw new NotFoundException(`Unauthorized to delete listing`);

      if (listing.primaryImage) {
        await this.fileService.deleteFile(listing.primaryImage);
      }
      // if (listing.galleryImages) {
      //   await this.fileService.deleteFiles(
      //     listing.galleryImages.toString().split(','),
      //   );
      // }

      return this.listingsRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addMedia(id: string, uploadMediaDto: UploadMediaDto, userId: string) {
    try {
      const listing = await this.listingsRepository.find(id);
      if (!listing) throw new NotFoundException(`Listing with ${id} not found`);

      if (listing.userId !== userId)
        throw new NotFoundException(`Unauthorized to update listing`);

      if (uploadMediaDto.images) {
        const uploadedImages = await this.fileService.uploadFiles(
          uploadMediaDto.images,
        );
        if (uploadMediaDto.set_primary) {
          await this.listingsRepository.update(id, {
            primaryImage: uploadedImages[0].url,
          });
        }
        if (uploadMediaDto.videos) {
          const uploadedVideos = await this.fileService.uploadFiles(
            uploadMediaDto.videos,
          );
          await this.listingsRepository.update(id, {
            videos: uploadedVideos.map((video) => video.url),
          });
        }
        return this.listingsRepository.update(id, {
          galleryImages: uploadedImages.map((image) => image.url),
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
