import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { DI_ProjectReviewDetail } from "../../../../domain/models/DI_ProjectReviewDetail";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionAState extends IBaseInterface{
    ReviewDetails : DI_ReviewDetails;
    NewProjectReviewDetails: DI_ProjectReviewDetail;
    ProjectReviewRows : DI_ProjectReviewDetail[];
    EditMode: boolean;
}