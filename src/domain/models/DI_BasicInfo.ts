import { User } from "./types/User";

export class DI_BasicInfo{
    public Staff? : User;
    public StaffJobTitle : string;
    public SBU: string;
    public TimeAtLevel: string;
    public YTDUtilization?: number = null;
    public DaysOutOfTown?: number = null;
    public Reviewer?: User;
    public ReviewerJobTitle?: string;
    public IsStaffCommentsMandatory?: boolean = true;
}