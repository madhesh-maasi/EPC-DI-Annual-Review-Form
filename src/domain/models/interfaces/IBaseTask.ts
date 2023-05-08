import { User } from "../types/User";
import { IBaseItem } from "./IBaseItem";

export interface IBaseTask extends IBaseItem {
    AssignedTo: User;
    Body? : string; // Task Description
    DueDate? : Date;
    ListName?: string; // Title of List
    Status: string;
}