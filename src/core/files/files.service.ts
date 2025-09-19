import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  originalName: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  mimetype: string;
  uploadedAt: Date;
}

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedMimetypes?: string[];
  preserveOriginalName?: boolean;
}

@Injectable()
export class FileService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimetypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.maxFileSize = this.configService.get<number>(
      'MAX_FILE_SIZE',
      10 * 1024 * 1024,
    ); // 10MB default
    this.allowedMimetypes = this.configService
      .get<string>('ALLOWED_MIMETYPES', '')
      .split(',')
      .filter(Boolean);

    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    options: FileUploadOptions = {},
  ): Promise<FileUploadResult> {
    if (!file) throw new BadRequestException('No file provided');

    const maxSize = options.maxSize || this.maxFileSize;
    if (file.size > maxSize)
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSize} bytes`,
      );

    const allowedTypes = options.allowedMimetypes || this.allowedMimetypes;
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype))
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );

    try {
      const filename = options.preserveOriginalName
        ? this.sanitizeFilename(file.originalname)
        : this.generateUniqueFilename(file.originalname);

      const filePath = path.join(this.uploadDir, filename);

      await fs.writeFile(filePath, file.buffer);

      return {
        originalName: file.originalname,
        filename,
        path: filePath,
        url: this.generateFileUrl(filename),
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
    options: FileUploadOptions = {},
  ): Promise<FileUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteFile(filename: string): Promise<void> {
    if (!filename) throw new BadRequestException('Filename is required');

    const filePath = path.join(filename);

    try {
      await fs.access(filePath);

      await fs.unlink(filePath);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFiles(filenames: string[]): Promise<void> {
    if (!filenames || filenames.length === 0) {
      throw new BadRequestException('Filenames array is required');
    }

    const deletePromises = filenames.map((filename) =>
      this.deleteFile(filename),
    );
    await Promise.all(deletePromises);
  }

  async getFileInfo(filename: string): Promise<{
    filename: string;
    path: string;
    size: number;
    stats: any;
  }> {
    if (!filename) {
      throw new BadRequestException('Filename is required');
    }

    const filePath = path.join(this.uploadDir, filename);

    try {
      const stats = await fs.stat(filePath);

      return {
        filename,
        path: filePath,
        size: stats.size,
        stats,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get file info: ${error}`,
      );
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.uploadDir);
      return files.filter((file) => {
        return !file.startsWith('.');
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to list files: ${error}`);
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, filename);

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileBuffer(filename: string): Promise<Buffer> {
    if (!filename) {
      throw new BadRequestException('Filename is required');
    }

    const filePath = path.join(this.uploadDir, filename);

    try {
      return await fs.readFile(filePath);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to read file: ${error}`);
    }
  }

  async cleanupOldFiles(daysOld: number = 30): Promise<number> {
    try {
      const files = await this.listFiles();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      let deletedCount = 0;

      for (const filename of files) {
        const filePath = path.join(this.uploadDir, filename);
        const stats = await fs.stat(filePath);

        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to cleanup old files: ${error}`,
      );
    }
  }

  private generateFileUrl(filename: string): string {
    return `${this.uploadDir}/${filename}`;
  }

  getFileUrl(filename: string): string {
    return this.generateFileUrl(filename);
  }

  private generateUniqueFilename(originalname: string): string {
    const ext = path.extname(originalname);
    const name = path.basename(originalname, ext);
    return `${name}-${uuidv4()}${ext}`;
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  }

  getUploadDir(): string {
    return this.uploadDir;
  }

  async getStorageUsage(): Promise<{
    totalFiles: number;
    totalSize: number;
  }> {
    try {
      const files = await this.listFiles();
      let totalSize = 0;

      for (const filename of files) {
        const fileInfo = await this.getFileInfo(filename);
        totalSize += fileInfo.size;
      }

      return {
        totalFiles: files.length,
        totalSize,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to calculate storage usage: ${error}`,
      );
    }
  }
}
