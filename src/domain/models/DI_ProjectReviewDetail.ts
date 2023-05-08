import { Guid } from "@microsoft/sp-core-library";
import { User } from "./types/User";

export class DI_ProjectReviewDetail {
    public ProjectName: string;
    public ProjectDescription: string;
    public ReviewerName: string;
    public ReviewerEmail: string;
    public ReviewerEvaluation: string;
    public UniqueNumber?: Guid;
}