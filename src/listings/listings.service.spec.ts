import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { ListingsRepository } from './listings.repository';
import { FileService } from '../core/files/files.service';
import { UserRepository } from '../core/users/user.repository';
import { DatabaseService } from '../core/database/database.service';
import { ConfigService } from '@nestjs/config';
import {
  CarCondition,
  DriveType,
  FuelType,
  ListingStatus,
  TransmissionType,
} from '@prisma/client';
import { Readable } from 'stream';
const createListingDto = {
  title: 'Test Listing',
  description: 'Test Description',
  make_id: '1',
  model_id: '1',
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
  vin: '1234567890',
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
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a listing', async () => {
    const userId = '1';
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
    const result = await service.findOne('1');
    expect(result).toBeDefined();
  });

  it('should update a listing', async () => {
    const userId = '1';
    const result = await service.update('1', createListingDto, userId);
    expect(result).toBeDefined();
  });

  it('should remove a listing', async () => {
    const userId = '1';
    const result = await service.remove('1', userId);
    expect(result).toBeDefined();
  });
  it('should add media to a listing', async () => {
    const userId = '1';
    const result = await service.addMedia('1', uploadMediaDto, userId);
    expect(result).toBeDefined();
  });
});
