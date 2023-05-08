import { User } from "../types/User";
import { IBaseItem } from "./IBaseItem";

// Contains all the fields which are by default there in each document library
export interface IBaseDocument extends IBaseItem{
    LibraryName?: string; // Title of Document Library
    Name: string; // Document Name
    SiteRelativeURL?: string; //Site Relative File Path
    URL?: string; // Document Absolute URL
    UniqueID?: string; // Unique Document ID
}