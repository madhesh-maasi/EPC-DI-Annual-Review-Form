import { DI_ReviewDetails } from "../../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../../interfaces/IBaseInterface";

export interface IRatingsDropdownState extends IBaseInterface{ 
    SelectedRatingKey : string;
}