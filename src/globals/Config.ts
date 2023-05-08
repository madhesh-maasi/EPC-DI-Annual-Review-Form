import { DI_AcknowledgementSection } from "../domain/models/DI_AcknowledgementSection";

// This namespace contains solution specific Configuration items
export namespace Config {

    export const Search_RowLimit = 250;
    export const List_ThresholdLimit = 5000;

    // Date Formats
    export const DateFormatMoment = "";

    export const ListNames = {
        Reviews: "Reviews",
        DICategories: "DI Categories"
    };

    export const ListCAMLFields = {

    };

    // List sharepoint generated columns with internal name
    export const BaseColumns = {
        Id: "Id",
        Title: "Title"
    };

    // Key Value pair of Reviews list column title and internal names
    export const ReviewsColumns = {

        "Status": "Status",
        "Submitted" : "Submitted",
        "Admin Name" : "Admin_x0020_Name",
        "Admin Id": "Admin_x0020_NameId",
       
        // Basic Info
        BasicInfo: {
            "Staff Name": "Staff_x0020_Name",
            "Staff Id" : "Staff_x0020_NameId",
            "Staff Job Title": "Staff_x0020_Job_x0020_Title",
            "SBU": "SBU",
            "Time at Level (Years, Months)": "Time_x0020_at_x0020_Level_x0020_",
            "YTD Utilization (%)": "YTD_x0020_Utilization_x0020__x00",
            "Days Out of Town": "Days_x0020_Out_x0020_of_x0020_To",
            "Reviewer Name": "Reviewer_x0020_Name",
            "Reviewer Id": "Reviewer_x0020_NameId",
            "Reviewer Job Title": "Reviewer_x0020_Job_x0020_Title",
            "Is Staff Comments Mandatory?" : "Is_x0020_Staff_x0020_Comments_x0"
        },

        SectionA: {
            "Project Details" : "Project_x0020_Details"
        },

        SectionB: {
            "Chargable Staff Comments" : "Chargable_x0020_Staff_x0020_Comm",
            "Chargable Reviewer Comments" : "Chargable_x0020_Reviewer_x0020_C"
        },

        SectionC: {
            "Non Chargable Staff Comments": "Non_x0020_Chargable_x0020_Staff_",
            "Non Chargable Reviewer Comments" : "Non_x0020_Chargable_x0020_Review"
        },

        SectionD: {
            "Steward Rating": "Steward_x0020_Rating",
            "Steward Staff Comments" : "Steward_x0020_Staff_x0020_Commen",
            "Steward Reviewer Comments" : "Steward_x0020_Reviewer_x0020_Com",
            "Quality Work Rating" : "Quality_x0020_Work_x0020_Rating",
            "Quality Work Staff Comments" : "Quality_x0020_Work_x0020_Staff_x",
            "Quality Work Reviewer Comments": "Quality_x0020_Work_x0020_Reviewe",
            "Personal Impact Rating" : "Personal_x0020_Impact_x0020_Rati",
            "Personal Impact Staff Comments": "Personal_x0020_Impact_x0020_Staf",
            "Personal Impact Reviewer Comments" : "Personal_x0020_Impact_x0020_Revi",
            "Leads Rating" : "Leads_x0020_Rating",
            "Leads Staff Comments" : "Leads_x0020_Staff_x0020_Comments",
            "Leads Reviewer Comments" : "Leads_x0020_Reviewer_x0020_Comme",
            "Grows Rating" : "Grows_x0020_Rating",
            "Grows Staff Comments" : "Grows_x0020_Staff_x0020_Comments",
            "Grows Reviewer Comments" : "Grows_x0020_Reviewer_x0020_Comme",
            "Technical Skills" : "Technical_x0020_Skills",
            "Calculated Technical Skills" : "Calculated_x0020_Technical_x0020",
            "Overall Technical Skills Rating" : "Overall_x0020_Technical_x0020_Sk",
            "Technical Skills Rating Override Comment" : "Technical_x0020_Skills_x0020_Rat",
            "Technical Skills Staff Comments" : "Technical_x0020_Skills_x0020_Sta",
            "Technical Skills Reviewer Comments" : "Technical_x0020_Skills_x0020_Rev"
        },

        SectionE: {
            "Calculated Overall Performance Rating" : "Calculated_x0020_Overall_x0020_P",
            "Overall Performance Rating" : "Overall_x0020_Performance_x0020_",
            "Overall Performance Rating by Admin" : "Overall_x0020_Performance_x0020_0",
            "Overall Skills Rating Override Comment" : "Overall_x0020_Skills_x0020_Ratin",
            "Overall Skills Staff Comments" : "Overall_x0020_Skills_x0020_Staff",
            "Overall Skills Reviewer Comments" : "Overall_x0020_Skills_x0020_Revie"
        },
        
        SectionF: {
            "Other Staff Comments" : "Other_x0020_Staff_x0020_Comments",
            "Other Reviewer Comments" : "Other_x0020_Reviewer_x0020_Comme",
        },

        SectionG: {
            "Goals Reviewer Comment": "Goals_x0020_Reviewer_x0020_Comme",
            "Goals Staff Comment": "Goals_x0020_Staff_x0020_Comment"
        },

        RevertCommentsSection: {
            "Revert Review Comments" : "Revert_x0020_Review_x0020_Commen"
        },
        AcknowledgementSection: {
            "Date of Review Discussion" : "Date_x0020_of_x0020_Review_x0020",
            "Reviwee Acknowledged Date" : "Reviwee_x0020_Acknowledged_x0020",
            "Acknowledged Reviewer Name" : "Acknowledged_x0020_Reviewer_x002",
            "Reviewer Review Date" : "Reviewer_x0020_Review_x0020_Date",
            "Acknowledgement History" : "Acknowledgement_x0020_History"
        }
    };

    // Possible Review Status values
    export const ReviewStatus = {
        NotStarted: "",
        AwaitingReviewee: "Awaiting Reviewee",
        AwaitingReviewer: "Awaiting Reviewer",
        ReviewerCompleted: "Reviewer Completed",
        AwaitingAcknowledgement: "Awaiting Acknowledgement",
        Acknowledged: "Acknowledged"
    };

    export const Links = {
        ReviewsListAllItems: "/Lists/Reviews/AllItems.aspx",
        HomePageLink: "/"
    };

    export const SPGroups = {
        DIAdminGroup : "DI Admin Group"
    };

    export const DICategories = {
        SBU : "SBU",
        DocumentType : "Document Type",
        TechnicalSkill : "Technical Skill",
        Year : "Year"
    };

    export const Strings = {
        NotApplicable: "NA"
    };

}