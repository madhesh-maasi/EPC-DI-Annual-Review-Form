import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface IAcknowledgementSectionProps extends IBaseInterface {
    ReviewDetails : DI_ReviewDetails;
    DisableReviewDiscussionDate: boolean;
    onFormFieldValueChange: (DI_ReviewDetails) => any; 
}
