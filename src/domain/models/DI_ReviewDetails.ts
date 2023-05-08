import { DI_AcknowledgementSection } from "./DI_AcknowledgementSection";
import { DI_BasicInfo } from "./DI_BasicInfo";
import { DI_ReplaceMe } from "./DI_ReplaceMe";
import { DI_RevertCommentsSection } from "./DI_RevertCommentsSection";
import { DI_SectionA } from "./DI_SectionA";
import { DI_SectionB } from "./DI_SectionB";
import { DI_SectionC } from "./DI_SectionC";
import { DI_SectionD } from "./DI_SectionD";
import { DI_SectionE } from "./DI_SectionE";
import { DI_SectionF } from "./DI_SectionF";
import { DI_SectionG } from "./DI_SectionG";
import { User } from "./types/User";

export class DI_ReviewDetails{
    public ID : number;
    public Title : string;
    public BasicDetails : DI_BasicInfo;
    public ReplaceMeDetails: DI_ReplaceMe;
    public SectionADetails: DI_SectionA;
    public SectionBDetails: DI_SectionB;
    public SectionCDetails: DI_SectionC;
    public SectionDDetails: DI_SectionD;
    public SectionEDetails: DI_SectionE;
    public SectionFDetails: DI_SectionF;
    public SectionGDetails: DI_SectionG;
    public RevertCommentsDetails: DI_RevertCommentsSection;
    public AcknowledgementDetails: DI_AcknowledgementSection;
    public Status: string;
    public SubmittedStatus: number;
    public Admin?: User;
}