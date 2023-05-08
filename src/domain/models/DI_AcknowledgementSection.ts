import { User } from "./types/User";

export class DI_AcknowledgementSection{
    public ReviewDiscussionDate? : Date;
    public RevieweeDetails? : User;
    public RevieweeDate?: Date;
    public ReviewerDetails? : User;
    public ReviewerDate?: Date;
    public AcknowledgementHistory? : string;
}