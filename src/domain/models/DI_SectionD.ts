import { DI_TechnicalSkillRating } from "./DI_TechnicalSkillRating";

export class DI_SectionD{
    
    //For "Steward of A&M"
    public SAMRating?: string;
    public SAMStaffComments? : string;
    public SAMReviewerComments? : string;

    //For "Delivers Quality Work"
    public DQWRating?: string;
    public DQWStaffComments? : string;
    public DQWReviewerComments? : string;

    //For "Manages Personal Impact"
    public MPIRating?: string;
    public MPIStaffComments? : string;
    public MPIReviewerComments? : string;

    //For "Leads and Develops Others"
    public LDORating?: string;
    public LDOStaffComments? : string;
    public LDOReviewerComments? : string;

    //For "Grows Business"
    public GBRating?: string;
    public GBStaffComments? : string;
    public GBReviewerComments? : string;

    //For "Technical Skills"
    public TSTechnicalSkills?: DI_TechnicalSkillRating[];
    public TSCalculatedOverallSkillRating?: number = null;
    public TSOverallSkillRating?: string;
    public TSReasonOverride: string;
    public TSStaffComments? : string;
    public TSReviewerComments? : string;
}