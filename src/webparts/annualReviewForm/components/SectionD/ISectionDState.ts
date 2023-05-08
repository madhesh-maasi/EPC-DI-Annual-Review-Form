import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { DI_TechnicalSkillRating } from "../../../../domain/models/DI_TechnicalSkillRating";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface ISectionDState extends IBaseInterface{
    ReviewDetails : DI_ReviewDetails;
    TechnicalSkillRows: DI_TechnicalSkillRating[];
    ModifiedTechnicalSkillRows: DI_TechnicalSkillRating[];
    NewTechnicalSkillDetails: DI_TechnicalSkillRating;
    DisableTechnicalSkillRatingsSelection: boolean;
    HideAddEditTechnicalSkillSection: boolean;
    IsEditMode: boolean;
    AddedSkillNames: string[];
}