import { IStorageProvider } from './interfaces/storage-provider.interface.ts'

export class StorageService {
  constructor(private provider: IStorageProvider) {
    console.log(this.provider)
  }

  uploadFile (a1: any, a2: any, a3: any): any {
    console.log(a1, a2, a3)
  }

  getFileByName (fileName: any): any {
    console.log(fileName)
  }

  getStream (data: any): any {
    console.log(data)
  }
}
