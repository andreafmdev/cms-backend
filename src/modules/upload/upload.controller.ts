// src/upload/test-upload.controller.ts
import { Controller, Post, UseInterceptors } from '@nestjs/common';

import {
  FilesInterceptor,
  UploadedFiles,
  MemoryStorageFile,
} from '@x6tech/nest-file-fastify';

@Controller('upload')
export class UploadController {
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('photos', 3))
  multiple(@UploadedFiles() files: MemoryStorageFile[]) {
    // TODO: Save files to disk
    // TODO: Return the files
    return files;
  }
}
