export class ImageUrl {
  constructor(public readonly value: string) {
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!urlRegex.test(value)) {
      throw new Error('Invalid image URL');
    }
  }
}
