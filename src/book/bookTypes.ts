import { IUser } from "../user/UserTypes";

export interface IBook {
  _id: string;
  title: string;
  author: IUser;
  genre: string;
  coverImage: string;
  file: string;
  description?: string;
  createdAt: Date;
  modifiedAt: Date;
}
