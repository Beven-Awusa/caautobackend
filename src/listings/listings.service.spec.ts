import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { ListingsRepository } from './listings.repository';
import { FileService } from '../core/files/files.service';
import { UserRepository } from '../core/users/user.repository';
import { DatabaseService } from '../core/database/database.service';
import { ConfigService } from '@nestjs/config';
import { CarsFeatureRepository } from '../filters/repositories';
import {
  CarCondition,
  DriveType,
  FuelType,
  ListingStatus,
  TransmissionType,
} from '@prisma/client';
import { Readable } from 'stream';

const userId = 'cmflbbumz0000uve7cplt5842';
const makeId = 'cmfntfcaf000006firmcl7bm9';
const modelId = 'cmfntgy7b000106fidls21y5z';
const listingId = 'cmfnu808t000406ficeulij7z';
const createListingDto = {
  title: 'Test Listing',
  description: 'Test Description',
  make_id: makeId,
  model_id: modelId,
  year: 2020,
  condition: CarCondition.NEW,
  price: 10000,
  mileage: 10000,
  fuel_type: FuelType.GASOLINE,
  transmission: TransmissionType.AUTOMATIC,
  drive_type: DriveType.FOURWD,
  engine_size: 2.0,
  cylinders: 4,
  doors: 4,
  seats: 5,
  color: 'red',
  interior_color: 'black',
  featured: false,
  status: ListingStatus.ACTIVE,
  location: 'Test Location',
  latitude: 10.0,
  longitude: 10.0,
  primary_image: 'test.jpg',
  gallery_images: ['test1.jpg', 'test2.jpg'],
  videos: ['test.mp4'],
  vin: '12345678901234567',
  feature_ids: [],
};
const primaryImage: Express.Multer.File = {
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test'),
  size: 1000,
  fieldname: '',
  stream: new Readable(),
  destination: '',
  filename: '',
  path: '',
};
const galleryImages: Express.Multer.File[] = [
  {
    originalname: 'test1.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 1000,
    fieldname: '',
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  },
  {
    originalname: 'test2.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 1000,
    fieldname: '',
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  },
];

const uploadMediaDto = {
  images: [primaryImage],
  videos: [primaryImage],
  set_primary: true,
};
describe('ListingsService', () => {
  let service: ListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsRepository,
        ListingsService,
        ConfigService,
        DatabaseService,
        FileService,
        UserRepository,
        CarsFeatureRepository,
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a listing', async () => {
    const result = await service.create(
      createListingDto,
      primaryImage,
      galleryImages,
      userId,
    );
    expect(result).toBeDefined();
  });

  it('should find all listings', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
    });
    expect(result).toBeDefined();
  });

  it('should find one listing', async () => {
    const result = await service.findOne(listingId);
    expect(result).toBeDefined();
  });

  it('should update a listing', async () => {
    const result = await service.update(listingId, createListingDto, userId);
    expect(result).toBeDefined();
  });
  it('should add media to a listing', async () => {
    const result = await service.addMedia(listingId, uploadMediaDto, userId);
    expect(result).toBeDefined();
  });
  it('should remove a listing', async () => {
    const result = await service.remove(listingId, userId);
    expect(result).toBeDefined();
  });
});
