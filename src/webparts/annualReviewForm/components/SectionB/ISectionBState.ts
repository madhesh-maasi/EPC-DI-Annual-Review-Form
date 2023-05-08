import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionBState extends IBaseInterface{
    ReviewDetails : DI_ReviewDetails; 
}