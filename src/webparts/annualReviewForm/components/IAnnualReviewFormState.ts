import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DI_BasicInfo } from "../../../domain/models/DI_BasicInfo";
import { DI_ReviewDetails } from "../../../domain/models/DI_ReviewDetails";
import { Enums } from "../../../globals/Enums";
import { IBaseInterface } from "../../../interfaces/IBaseInterface";

export interface IAnnualReviewFormState extends IBaseInterface{
  ReviewStatus: string;
  ReviewDetails: DI_ReviewDetails;
  IsCreateMode: boolean;
  CurrentUserRoles: Enums.UserRoles[];
  
  DisableReviewerComments : boolean;
  DisableStaffComments: boolean;
  DisableRatings: boolean;
  DisableOverrideOverallPerformanceComments: boolean;
  DisableOverrideTechnicalSkillsComments: boolean;
  DisableReviewDiscussionDate: boolean;
  DisableProjectReviewDetails: boolean;

  DisableSaveButton: boolean;
  DisableSubmitButton: boolean;
  DisableStartRivewButton: boolean;
  DisableRevertButton: boolean;
  
  HideSaveButton: boolean;
  HideSubmitButton: boolean;
  HideRevertButton: boolean;

  HideReplaceMeSection: boolean;
  HideRevertCommentsSection: boolean;
}
