import { User } from "../types/User";
import { IBaseItem } from "./IBaseItem";

export interface IBaseListItem extends IBaseItem{
    ListName?: string; // Title of List
}