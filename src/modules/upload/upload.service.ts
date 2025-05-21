import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary) {}

  async uploadImageBuffer(
    buffer: Buffer,
    filename: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          use_filename: true,
          unique_filename: false,
          public_id: filename,
        },
        (error, result) => {
          if (error) {
            console.log(error);
            return reject(error as Error);
          }
          if (!result) {
            return reject(new Error('Upload failed'));
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      stream.end(buffer);
    });
  }
}
