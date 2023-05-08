import { User } from "../types/User";

export interface IBaseItem {
    Author: User;
    ContentType?: string;
    Created: Date;
    Editor: User;
    Id: number; // Document ID
    Modified: Date;
    Title: string;
}