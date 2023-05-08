import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { Enums } from "../../../../globals/Enums";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionEProps extends IBaseInterface {
    ReviewDetails : DI_ReviewDetails;
    DisableStaffComments : boolean;
    DisableReviewerComments: boolean;
    DisableRatings: boolean;
    DisableOverrideRatingsComments: boolean;
    CurrentUserRoles: Enums.UserRoles[];
    onFormFieldValueChange: (DI_ReviewDetails) => any;   
}
