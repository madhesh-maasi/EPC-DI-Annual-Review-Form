import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionGProps extends IBaseInterface {
    ReviewDetails : DI_ReviewDetails;
    DisableStaffComments : boolean;
    DisableReviewerComments: boolean;
    onFormFieldValueChange: (DI_ReviewDetails) => any;    
}
