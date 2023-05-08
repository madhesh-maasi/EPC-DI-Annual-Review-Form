import { IDropdownOption } from "@fluentui/react";
import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { DI_TechnicalSkillRating } from "../../../../domain/models/DI_TechnicalSkillRating";
import { Enums } from "../../../../globals/Enums";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionDProps extends IBaseInterface {
    ReviewDetails : DI_ReviewDetails;
    TechnicalSkillRows: DI_TechnicalSkillRating[];
    DisableStaffComments : boolean;
    DisableReviewerComments: boolean;
    DisableRatings: boolean;
    DisableOverrideRatingsComments: boolean;
    TechnicalSkillOptions: IDropdownOption[];
    CurrentUserRoles: Enums.UserRoles[];
    onFormFieldValueChange: (DI_ReviewDetails) => any;   
}
