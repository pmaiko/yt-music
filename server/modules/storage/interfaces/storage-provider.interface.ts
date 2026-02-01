export interface IStorageProvider {
  writeFile: (buffer: Buffer, filename: string) => Promise<any>
  readFile: () => Promise<Buffer>
}