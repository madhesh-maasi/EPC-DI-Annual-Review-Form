import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { DI_ProjectReviewDetail } from "../../../../domain/models/DI_ProjectReviewDetail";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionAProps extends IBaseInterface {
    ReviewDetails : DI_ReviewDetails;
    ProjectReviewRows: DI_ProjectReviewDetail[];
    DisableSection: boolean;
    onFormFieldValueChange: (DI_ReviewDetails) => any;   
}
