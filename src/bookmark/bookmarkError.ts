import * as models from '../models';

export class BookmarkError implements models.IBookmarkError {
  public message: string;
  constructor(message: string) {
    this.message = message;
  }
}
