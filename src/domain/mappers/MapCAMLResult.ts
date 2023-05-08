import { ContextService } from "../../services/ContextService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from 'moment';
import { User } from "../models/types/User";
import { Enums } from "../../globals/Enums";
import { DI_BasicInfo } from "../models/DI_BasicInfo";
import { Config } from "../../globals/Config";
import { DI_SectionG } from "../models/DI_SectionG";
import { DI_ReviewDetails } from "../models/DI_ReviewDetails";
import { DI_SectionA } from "../models/DI_SectionA";
import { DI_SectionB } from "../models/DI_SectionB";
import { DI_SectionC } from "../models/DI_SectionC";
import { DI_SectionD } from "../models/DI_SectionD";
import { DI_SectionE } from "../models/DI_SectionE";
import { DI_SectionF } from "../models/DI_SectionF";
import { DI_AcknowledgementSection } from "../models/DI_AcknowledgementSection";
import { DI_ProjectReviewDetail } from "../models/DI_ProjectReviewDetail";
import { DI_TechnicalSkillRating } from "../models/DI_TechnicalSkillRating";
import { DI_ReplaceMe } from "../models/DI_ReplaceMe";
import { DI_RevertCommentsSection } from "../models/DI_RevertCommentsSection";

export default class MapCAMLResult extends ContextService {

    constructor(AppContext: WebPartContext, Lcid: number) {
        super(AppContext);

    }

    // Mapping results based on provided type
    public static map(items: any, type: Enums.ItemResultType): any[] {
        let allResults: any[] = [];
        items.forEach(item => {
            let result: any;
            switch (type) {
                case Enums.ItemResultType.DI_ReviewStatus: result = this.mapReviewStatus(item);
                    break;
                case Enums.ItemResultType.DI_ReviewDetails: result = this.mapReviewDetails(item);
                    break;
                case Enums.ItemResultType.DI_Categories: result = this.mapDICategory(item);
                    break;
            }
            allResults.push(result);
        });
        return allResults;
    }

    //#region "Solution Related Mappers"

    // Mapping Year value
    private static mapDICategory(masterItem: any): String {
        let result: string = "";
        result = masterItem[Config.BaseColumns.Title];
        return result;
    }

    private static mapReviewDetails(item: any) {
        let result = new DI_ReviewDetails();
        result.Title = item[Config.BaseColumns.Title];
        result.BasicDetails = this.mapBasicInfo(item);
        result.ReplaceMeDetails = this.mapReplaceMeDetails(item);
        result.SectionADetails = this.mapSectionADetails(item);
        result.SectionBDetails = this.mapSectionBDetails(item);
        result.SectionCDetails = this.mapSectionCDetails(item);
        result.SectionDDetails = this.mapSectionDDetails(item);
        result.SectionEDetails = this.mapSectionEDetails(item);
        result.SectionFDetails = this.mapSectionFDetails(item);
        result.SectionGDetails = this.mapSectionGDetails(item);
        result.RevertCommentsDetails = this.mapRevertCommentsDetails(item);
        result.AcknowledgementDetails = this.mapAcknoledgementDetails(item);
        result.Status = this.mapReviewStatus(item);
        result.SubmittedStatus = item[Config.ReviewsColumns.Submitted];
        result.Admin = this.mapUser(item[Config.ReviewsColumns["Admin Name"]]);
        return result;
    }

    // Mapping of first Basic section
    private static mapBasicInfo(item: any) {
        const Fields = Config.ReviewsColumns.BasicInfo;
        let result: DI_BasicInfo = {
            Staff: this.mapUser(item[Fields["Staff Name"]]),
            StaffJobTitle: item[Fields["Staff Job Title"]],
            SBU: item[Fields.SBU],
            TimeAtLevel: item[Fields["Time at Level (Years, Months)"]],
            YTDUtilization: item[Fields["YTD Utilization (%)"]],
            DaysOutOfTown: item[Fields["Days Out of Town"]],
            Reviewer: this.mapUser(item[Fields["Reviewer Name"]]),
            ReviewerJobTitle: item[Fields["Reviewer Job Title"]],
            //IsStaffCommentsMandatory: this.mapBoolean(item[Fields["Is Staff Comments Mandatory?"]])
        };
        return result;
    }


    // Mapping for 'Replace Me' section
    private static mapReplaceMeDetails(item: any) {
        let result: DI_ReplaceMe = {
            NewReviewer: new User()
        };
        return result;
    }

    // Mapping 'Section A' field values
    private static mapSectionADetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionA;
        let projectReviewDetails: DI_ProjectReviewDetail[] = [];
        let unformattedProjectDetails = item[Fields["Project Details"]];
        if (unformattedProjectDetails == null || unformattedProjectDetails == "") {
            projectReviewDetails = [];
        }
        else {
            projectReviewDetails = JSON.parse(unformattedProjectDetails);
        }
        let result: DI_SectionA = {
            ProjectReviews: projectReviewDetails
        };
        return result;
    }

    // Mapping 'Section B' field values
    private static mapSectionBDetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionB;
        let result: DI_SectionB = {
            StaffComments: item[Fields["Chargable Staff Comments"]],
            ReviewerComments: item[Fields["Chargable Reviewer Comments"]]
        };
        return result;
    }

    // Mapping 'Section C' field values
    private static mapSectionCDetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionC;
        let result: DI_SectionC = {
            StaffComments: item[Fields["Non Chargable Staff Comments"]],
            ReviewerComments: item[Fields["Non Chargable Reviewer Comments"]]
        };
        return result;
    }

    // Mapping 'Section D' field values
    private static mapSectionDDetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionD;
        let technicalSkillRatings: DI_TechnicalSkillRating[] = [];
        let unformattedRatings = item[Fields["Technical Skills"]];
        if (unformattedRatings == null || unformattedRatings == "") {
            technicalSkillRatings = [];
        }
        else {
            technicalSkillRatings = JSON.parse(unformattedRatings);
        }

        let tsCalculatedOverallSkillRating = item[Fields["Calculated Technical Skills"]];
        if (tsCalculatedOverallSkillRating == "") {
            tsCalculatedOverallSkillRating = null; // As we can't store "" in number field, but null can be stored
        }

        let result: DI_SectionD = {
            TSReasonOverride: item[Fields["Technical Skills Rating Override Comment"]],
            DQWRating: item[Fields["Quality Work Rating"]],
            DQWReviewerComments: item[Fields["Quality Work Reviewer Comments"]],
            DQWStaffComments: item[Fields["Quality Work Staff Comments"]],
            GBRating: item[Fields["Grows Rating"]],
            GBReviewerComments: item[Fields["Grows Reviewer Comments"]],
            GBStaffComments: item[Fields["Grows Staff Comments"]],
            LDORating: item[Fields["Leads Rating"]],
            LDOReviewerComments: item[Fields["Leads Reviewer Comments"]],
            LDOStaffComments: item[Fields["Leads Staff Comments"]],
            MPIRating: item[Fields["Personal Impact Rating"]],
            MPIReviewerComments: item[Fields["Personal Impact Reviewer Comments"]],
            MPIStaffComments: item[Fields["Personal Impact Staff Comments"]],
            SAMRating: item[Fields["Steward Rating"]],
            SAMReviewerComments: item[Fields["Steward Reviewer Comments"]],
            SAMStaffComments: item[Fields["Steward Staff Comments"]],
            TSCalculatedOverallSkillRating: tsCalculatedOverallSkillRating,
            TSOverallSkillRating: item[Fields["Overall Technical Skills Rating"]],
            TSReviewerComments: item[Fields["Technical Skills Reviewer Comments"]],
            TSStaffComments: item[Fields["Technical Skills Staff Comments"]],
            TSTechnicalSkills: technicalSkillRatings
        };
        return result;
    }

    // Mapping 'Section E' field values
    private static mapSectionEDetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionE;
        let calculatedOverallRating = item[Fields["Calculated Overall Performance Rating"]];
        if (calculatedOverallRating == "") {
            calculatedOverallRating = null; // As we can't store "" in number field, but null can be stored
        }
        let result: DI_SectionE = {
            CalculatedOverallRating: calculatedOverallRating,
            OverallRating: item[Fields["Overall Performance Rating"]],
            OverallRatingByAdmin: item[Fields["Overall Performance Rating by Admin"]],
            OverrideReason: item[Fields["Overall Skills Rating Override Comment"]],
            ReviewerComments: item[Fields["Overall Skills Reviewer Comments"]],
            StaffComments: item[Fields["Overall Skills Staff Comments"]]
        };
        return result;
    }


    // Mapping 'Section F' field values
    private static mapSectionFDetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionF;
        let result: DI_SectionF = {
            ReviewerComments: item[Fields["Other Reviewer Comments"]],
            StaffComments: item[Fields["Other Staff Comments"]]
        };
        return result;
    }

    // Mapping 'Section G' field values
    private static mapSectionGDetails(item: any) {
        const Fields = Config.ReviewsColumns.SectionG;
        let result: DI_SectionG = {
            StaffComments: item[Fields["Goals Staff Comment"]],
            ReviewerComments: item[Fields["Goals Reviewer Comment"]]
        };
        return result;
    }

    private static mapRevertCommentsDetails(item: any) {
        const Fields = Config.ReviewsColumns.RevertCommentsSection;
        let result: DI_RevertCommentsSection = {
            ReviewerRevertComments: item[Fields["Revert Review Comments"]]
        };
        return result;
    }

    // Mapping 'Acknoledgement Section' field values
    private static mapAcknoledgementDetails(item: any) {
        const Fields = Config.ReviewsColumns.AcknowledgementSection;
        let result: DI_AcknowledgementSection = {
            ReviewDiscussionDate: this.mapDate(item[Fields["Date of Review Discussion"]]),
            AcknowledgementHistory: item[Fields["Acknowledgement History"]]
        };
        return result;
    }

    // When we are only fetching status
    private static mapReviewStatus(item: any) {
        let status: string = item[Config.ReviewsColumns.Status];
        return status;
    }

    ////#endregion

    //#region "Common Mappers"

    // Mapping multiple user
    private static mapUsers(userEntries: any): User[] {
        let result: User[] = [];
        if (userEntries instanceof Array) {
            userEntries.forEach(user => {
                result.push(this.mapUser(user));
            });
        }
        else {
            result.push(this.mapUser(userEntries));
        }

        return result;
    }

    // Mapping single user
    private static mapUser(user: any): User {
        // This in required, as in CAML it returns array even if it is single user
        if (user instanceof Array && user.length > 0) {
            user = user[0];
        }
        // Case : when it is null
        if (!user) {
            return new User();
        }
        let result: User = new User();
        result.Email = user["email"];
        result.Id = user["id"];
        result.LoginName = user["sip"];
        result.Title = user["title"];
        return result;
    }

    // Mapping boolean value
    private static mapBoolean(itemValue: any): boolean {
        if (itemValue) {
            let result: boolean;
            result = (itemValue == "Yes" || itemValue.value == "1") ? true : false;
            return result;
        }
        return undefined;
    }

    // Mapping date field
    private static mapDate(dateField: any): Date {
        if (dateField) {
            return (new Date(dateField));
        }
        return undefined;
    }

    // Mapping date field and return formatted date string
    private static mapDateWithFormat(dateField: any): string {
        if (dateField) {
            return (moment(dateField).format('D MMMM YYYY'));
        }
        return "";
    }

    //#endregion
}



