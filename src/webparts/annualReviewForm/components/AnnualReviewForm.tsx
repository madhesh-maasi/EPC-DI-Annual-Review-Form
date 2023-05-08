import "@pnp/polyfill-ie11"
import * as React from 'react';
import styles from './AnnualReviewForm.module.scss';
import { IAnnualReviewFormProps } from './IAnnualReviewFormProps';
import ListItemService from '../../../services/ListItemService';
import { Enums } from '../../../globals/Enums';
import { IAnnualReviewFormState } from './IAnnualReviewFormState';
import BasicInfo from './BasicInfo/BasicInfo';
import SectionA from './SectionA/SectionA';
import SectionB from './SectionB/SectionB';
import SectionC from './SectionC/SectionC';
import SectionD from './SectionD/SectionD';
import SectionE from './SectionE/SectionE';
import SectionF from './SectionF/SectionF';
import SectionG from './SectionG/SectionG';
import { Config } from '../../../globals/Config';
import AcknowledgementSection from './AcknowledgementSection/AcknowledgementSection';
import { DI_ReviewDetails } from '../../../domain/models/DI_ReviewDetails';
import { DefaultButton, IDropdownOption, IStackTokens, PrimaryButton, Stack, TooltipHost } from '@fluentui/react';
import ReplaceMeSection from './ReplaceMeSection/ReplaceMeSection';
import RevertCommentsSection from './RevertCommentsSection/RevertCommentsSection';
import { DI_BasicInfo } from '../../../domain/models/DI_BasicInfo';
import { User } from '../../../domain/models/types/User';
import UserService from '../../../services/UserService';
import WebService from '../../../services/WebService';
import { isChrome, isFirefox, isEdge } from 'react-device-detect';
require("./AnnualReviewForm-Fabric.css");

export default class AnnualReviewForm extends React.Component<IAnnualReviewFormProps, IAnnualReviewFormState> {

    private listItemService: ListItemService;
    private userService: UserService;
    private webService: WebService;
    private hasEditItemPermission: boolean = true;
    private sbuOptions: IDropdownOption[] = [];
    private technicalSkillOptions: IDropdownOption[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            IsCreateMode: this.props.ReviewItemID == undefined ? true : false,
            CurrentUserRoles: [],
            IsLoading: true,
            AppContext: this.props.AppContext,
            ReviewStatus: "",
            ReviewDetails: new DI_ReviewDetails(),
            DisableReviewerComments: false,
            DisableStaffComments: false,
            DisableRatings: false,
            DisableReviewDiscussionDate: false,
            DisableOverrideOverallPerformanceComments: false,
            DisableOverrideTechnicalSkillsComments: false,
            DisableProjectReviewDetails: false,
            DisableStartRivewButton: true,
            DisableSubmitButton: false,
            DisableSaveButton: false,
            DisableRevertButton: false,
            HideRevertButton: false,
            HideSaveButton: false,
            HideSubmitButton: false,
            HideReplaceMeSection: false,
            HideRevertCommentsSection: false
        };
        this.onStartReview = this.onStartReview.bind(this);
        this.onFormSave = this.onFormSave.bind(this);
        this.onSaveReview = this.onSaveReview.bind(this);
        this.onSubmitReview = this.onSubmitReview.bind(this);
        this.onRevertReview = this.onRevertReview.bind(this);
        this.onReplaceMe = this.onReplaceMe.bind(this);
        this.onCancelReview = this.onCancelReview.bind(this);
        this.onFormFieldValueChange = this.onFormFieldValueChange.bind(this);
    }

    // Things to be performed when the component is being mounted
    public async componentDidMount() {

        // If Chrome, Edge or Firefox, then only we are allowing
        if (!(isChrome || isEdge || isFirefox)) {
            window.location.href = this.props.AppContext.pageContext.web.absoluteUrl + "/SitePages/DisplayError.aspx";
            return false;
        }

        this.userService = new UserService(this.props.AppContext);
        this.webService = new WebService(this.props.AppContext);

        this.FillSBUOptions();
        this.FillTechnicalSkillsOptions();

        // CASE: CREATE ITEM
        if (this.state.IsCreateMode) {
            const reviewStatus = Config.ReviewStatus.NotStarted;
            const reviewDetails = await this.generateEmptyReviewDetails();
            this.setState({
                IsLoading: false,
                ReviewStatus: reviewStatus,
                ReviewDetails: reviewDetails
            });
        }
        // CASE: EDIT ITEM
        else {
            this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.Reviews);
            const reviewStatus = await this.listItemService.getReviewStatus(this.props.ReviewItemID);
            const reviewDetails: DI_ReviewDetails = await this.listItemService.getItemUsingCAML(this.props.ReviewItemID, [], undefined, Enums.ItemResultType.DI_ReviewDetails);
            this.hasEditItemPermission = await this.listItemService.CheckCurrentUserCanEditItem(this.props.ReviewItemID);
            const allowSubmit = this.validateSubmit(reviewDetails);
            const allowRevert = this.validateRevert(reviewDetails);
            const allowSave = this.validateSave(reviewDetails);
            const userRoles: Enums.UserRoles[] = await this.GetCurrentUserRoles(reviewDetails.BasicDetails);

            // Redirecting all users except owner & admin to error page, if status of form is "Reviewer Completed"
            if (reviewStatus == Config.ReviewStatus.ReviewerCompleted && userRoles.some(x => (x == Enums.UserRoles.SuperAdmin)) == false) {
                window.location.href = this.props.AppContext.pageContext.web.absoluteUrl + "/SitePages/TemporaryUnavailable.aspx";
                return false;
            }

            const disableOverallPerformanceComments = this.CheckDisableOverrideOverallPerformanceComments(reviewDetails, userRoles);
            const disableTechnicalSkillsComments = this.CheckDisableOverrideTechnicalSkillsComments(reviewDetails, userRoles);

            this.setState({
                IsLoading: false,
                CurrentUserRoles: userRoles,
                ReviewStatus: reviewStatus,
                ReviewDetails: reviewDetails,
                DisableReviewerComments: reviewStatus == Config.ReviewStatus.AwaitingReviewer ? false : true,
                DisableStaffComments: reviewStatus == Config.ReviewStatus.AwaitingReviewee ? false : true,
                DisableRatings: reviewStatus == Config.ReviewStatus.AwaitingReviewer ? false : true,
                DisableReviewDiscussionDate: reviewStatus == Config.ReviewStatus.AwaitingReviewer ? false : true,
                DisableProjectReviewDetails: reviewStatus == Config.ReviewStatus.AwaitingReviewee ? false : true,
                DisableOverrideOverallPerformanceComments: disableOverallPerformanceComments,
                DisableOverrideTechnicalSkillsComments: disableTechnicalSkillsComments,

                HideReplaceMeSection: (
                    reviewStatus == Config.ReviewStatus.Acknowledged ||
                    reviewStatus == Config.ReviewStatus.AwaitingAcknowledgement ||
                    reviewStatus == Config.ReviewStatus.AwaitingReviewee ||
                    reviewStatus == Config.ReviewStatus.ReviewerCompleted
                ) ? true : false,

                HideRevertCommentsSection: (
                    reviewStatus == Config.ReviewStatus.Acknowledged ||
                    reviewStatus == Config.ReviewStatus.AwaitingAcknowledgement ||
                    reviewStatus == Config.ReviewStatus.AwaitingReviewee ||
                    reviewStatus == Config.ReviewStatus.ReviewerCompleted
                ) ? true : false,

                // Button's Hide/Show
                HideRevertButton: (
                    reviewStatus == Config.ReviewStatus.Acknowledged ||
                    reviewStatus == Config.ReviewStatus.AwaitingAcknowledgement ||
                    reviewStatus == Config.ReviewStatus.AwaitingReviewee ||
                    reviewStatus == Config.ReviewStatus.ReviewerCompleted
                ) ? true : false,

                // Save Button
                HideSaveButton: (
                    reviewStatus == Config.ReviewStatus.AwaitingAcknowledgement ||
                    reviewStatus == Config.ReviewStatus.Acknowledged
                ) ? true : false,

                HideSubmitButton: (reviewStatus == Config.ReviewStatus.Acknowledged) ? true : false,
                DisableSaveButton: !allowSave,
                DisableSubmitButton: !allowSubmit,
                DisableRevertButton: !allowRevert
            });
        }

    }

    // Getting values of SBUs available in 'DI Categories's list
    private async FillSBUOptions(): Promise<any> {
        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.DICategories);
        const options: String[] = await this.listItemService.getDICategoryValues(Config.DICategories.SBU);
        options.forEach(x => {
            let option: IDropdownOption = {
                key: x.toString(),
                text: x.toString()
            };
            this.sbuOptions.push(option);
        });
    }

    // Getting values of Technicall Skills available in 'DI Categories's list
    private async FillTechnicalSkillsOptions(): Promise<any> {
        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.DICategories);
        const options: String[] = await this.listItemService.getDICategoryValues(Config.DICategories.TechnicalSkill);
        options.forEach(x => {
            let option: IDropdownOption = {
                key: x.toString(),
                text: x.toString()
            };
            this.technicalSkillOptions.push(option);
        });
    }

    // Deciding the roles associated with current user
    private async GetCurrentUserRoles(basicDetails: DI_BasicInfo): Promise<Enums.UserRoles[]> {
        let result: Enums.UserRoles[] = [];
        const currentUserDetails: User = await this.userService.GetCurrentUser();
        if (basicDetails.Staff.Email == currentUserDetails.Email) {
            result.push(Enums.UserRoles.Reviewee);
        }
        if (basicDetails.Reviewer.Email == currentUserDetails.Email) {
            result.push(Enums.UserRoles.Reviewer);
        }
        // Checking user is site collection admin  or member of 'DI Admin Group'
        const isSiteCollectionAdmin: boolean = await this.userService.CheckCurrentUserIsAdmin();
        const ownerGroupName: string = await this.webService.GetAssociatedOwnerGroupName();
        const isMemberOfOwnersGroup: boolean = await this.userService.CheckCurrentUserInSPGroup(ownerGroupName);
        if (isSiteCollectionAdmin || isMemberOfOwnersGroup) {
            result.push(Enums.UserRoles.SuperAdmin);
        }
        return result;
    }

    // Generating empty object for Review Details
    private async generateEmptyReviewDetails(): Promise<DI_ReviewDetails> {
        let reviewDetails: DI_ReviewDetails = new DI_ReviewDetails();
        let basicInfo: DI_BasicInfo = {
            Staff: new User(),
            StaffJobTitle: "",
            SBU: "",
            TimeAtLevel: "",
            YTDUtilization: null,
            DaysOutOfTown: null,
            Reviewer: new User(),
            ReviewerJobTitle: "",
            IsStaffCommentsMandatory: true
        };
        reviewDetails.BasicDetails = basicInfo;
        reviewDetails.Status = Config.ReviewStatus.NotStarted;
        reviewDetails.SubmittedStatus = 0;
        const currentUserDetails = await this.userService.GetCurrentUserProfile();
        reviewDetails.Title = currentUserDetails.LastName + ", " + currentUserDetails.FirstName + " Review";
        return reviewDetails;
    }

    // On click event of "Start Review" button
    private async onStartReview() {
        const reviewStatus = this.state.ReviewStatus;
        let requiredReviewDetails = this.state.ReviewDetails;
        requiredReviewDetails.Status = Config.ReviewStatus.AwaitingReviewee;
        requiredReviewDetails.SubmittedStatus = this.getSubmitStatus(reviewStatus, Enums.ButtonTypes.Submit);

        this.setState({
            ReviewDetails: requiredReviewDetails
        }, async () => {
            await this.onFormSave(Enums.SaveType.StartReview);
        });
    }

    // Updating review details updated in child components
    private onFormFieldValueChange(updatedReviewDetails: DI_ReviewDetails) {
        let allowStartReview: boolean = false;
        let allowSubmit: boolean = false;
        let allowRevert: boolean = false;
        let allowSave: boolean = true;
        let disableOverallPerformanceComments: boolean = true;
        let disableTechnicalSkillsComments: boolean = true;
        if (this.state.ReviewStatus == Config.ReviewStatus.NotStarted) {
            allowStartReview = this.validateStartReview(updatedReviewDetails);
        }
        allowSubmit = this.validateSubmit(updatedReviewDetails);
        allowRevert = this.validateRevert(updatedReviewDetails);
        allowSave = this.validateSave(updatedReviewDetails);
        disableOverallPerformanceComments = this.CheckDisableOverrideOverallPerformanceComments(updatedReviewDetails, this.state.CurrentUserRoles);
        disableTechnicalSkillsComments = this.CheckDisableOverrideTechnicalSkillsComments(updatedReviewDetails, this.state.CurrentUserRoles);

        this.setState({
            ReviewDetails: updatedReviewDetails,
            DisableStartRivewButton: !allowStartReview,
            DisableSubmitButton: !allowSubmit,
            DisableRevertButton: !allowRevert,
            DisableSaveButton: !allowSave,
            DisableOverrideOverallPerformanceComments: disableOverallPerformanceComments,
            DisableOverrideTechnicalSkillsComments: disableTechnicalSkillsComments
        });
    }

    // Updating Field values in Reviews List
    private async onFormSave(saveType: Enums.SaveType) {
        const reviewDetails = this.state.ReviewDetails;
        let data = {};
        const columns = Config.ReviewsColumns;

        data[Config.BaseColumns.Title] = reviewDetails.Title;

        // Basic Info Details
        const basicDetails = reviewDetails.BasicDetails;
        data[columns.BasicInfo['Staff Id']] = basicDetails.Staff.Id;
        data[columns.BasicInfo['Staff Job Title']] = basicDetails.StaffJobTitle;
        data[columns.BasicInfo.SBU] = basicDetails.SBU;
        data[columns.BasicInfo['Time at Level (Years, Months)']] = basicDetails.TimeAtLevel;
        data[columns.BasicInfo['YTD Utilization (%)']] = basicDetails.YTDUtilization;
        data[columns.BasicInfo['Days Out of Town']] = basicDetails.DaysOutOfTown;

        // Reviewer
        if (!this.state.IsCreateMode && reviewDetails.ReplaceMeDetails.NewReviewer.Id) {
            data[columns.BasicInfo['Reviewer Id']] = reviewDetails.ReplaceMeDetails.NewReviewer.Id;
        }
        else {
            data[columns.BasicInfo['Reviewer Id']] = basicDetails.Reviewer.Id;
        }

        data[columns.BasicInfo['Reviewer Job Title']] = basicDetails.ReviewerJobTitle;

        //data[columns.BasicInfo['Is Staff Comments Mandatory?']] = basicDetails.IsStaffCommentsMandatory;
        // if (this.state.IsCreateMode) {
        //     // In case when staff comments are not mandatory, we will populate all staff comments with NA
        //     if (!basicDetails.IsStaffCommentsMandatory) {
        //         data[columns.SectionB['Chargable Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionC['Non Chargable Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionD['Steward Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionD['Grows Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionD['Leads Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionD['Quality Work Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionD['Personal Impact Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionD['Technical Skills Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionE['Overall Skills Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionF['Other Staff Comments']] = Config.Strings.NotApplicable;
        //         data[columns.SectionG['Goals Staff Comment']] = Config.Strings.NotApplicable;
        //     }
        // }

        // Below sections will only have data at time of update
        if (!this.state.IsCreateMode) {
            // Section A Details
            const sectionADetails = reviewDetails.SectionADetails;
            if (sectionADetails.ProjectReviews == null || sectionADetails.ProjectReviews.length <= 0) {
                data[columns.SectionA['Project Details']] = "";
            }
            else {
                data[columns.SectionA['Project Details']] = JSON.stringify(sectionADetails.ProjectReviews);
            }

            // Section B Details
            const sectionBDetails = reviewDetails.SectionBDetails;
            data[columns.SectionB['Chargable Reviewer Comments']] = sectionBDetails.ReviewerComments;
            data[columns.SectionB['Chargable Staff Comments']] = sectionBDetails.StaffComments;

            // Section C Details
            const sectionCDetails = reviewDetails.SectionCDetails;
            data[columns.SectionC['Non Chargable Reviewer Comments']] = sectionCDetails.ReviewerComments;
            data[columns.SectionC['Non Chargable Staff Comments']] = sectionCDetails.StaffComments;

            // Section D Details
            const sectionDDetails = reviewDetails.SectionDDetails;
            data[columns.SectionD['Calculated Technical Skills']] = sectionDDetails.TSCalculatedOverallSkillRating;
            data[columns.SectionD['Grows Rating']] = sectionDDetails.GBRating;
            data[columns.SectionD['Grows Reviewer Comments']] = sectionDDetails.GBReviewerComments;
            data[columns.SectionD['Grows Staff Comments']] = sectionDDetails.GBStaffComments;
            data[columns.SectionD['Leads Rating']] = sectionDDetails.LDORating;
            data[columns.SectionD['Leads Reviewer Comments']] = sectionDDetails.LDOReviewerComments;
            data[columns.SectionD['Leads Staff Comments']] = sectionDDetails.LDOStaffComments;
            data[columns.SectionD['Overall Technical Skills Rating']] = sectionDDetails.TSOverallSkillRating;
            data[columns.SectionD['Personal Impact Rating']] = sectionDDetails.MPIRating;
            data[columns.SectionD['Personal Impact Reviewer Comments']] = sectionDDetails.MPIReviewerComments;
            data[columns.SectionD['Personal Impact Staff Comments']] = sectionDDetails.MPIStaffComments;
            data[columns.SectionD['Quality Work Rating']] = sectionDDetails.DQWRating;
            data[columns.SectionD['Quality Work Reviewer Comments']] = sectionDDetails.DQWReviewerComments;
            data[columns.SectionD['Quality Work Staff Comments']] = sectionDDetails.DQWStaffComments;
            data[columns.SectionD['Steward Rating']] = sectionDDetails.SAMRating;
            data[columns.SectionD['Steward Reviewer Comments']] = sectionDDetails.SAMReviewerComments;
            data[columns.SectionD['Steward Staff Comments']] = sectionDDetails.SAMStaffComments;
            if (sectionDDetails.TSTechnicalSkills == null || sectionDDetails.TSTechnicalSkills.length <= 0) {
                data[columns.SectionD['Technical Skills']] = "";
            }
            else {
                data[columns.SectionD['Technical Skills']] = JSON.stringify(sectionDDetails.TSTechnicalSkills);
            }
            data[columns.SectionD['Technical Skills Rating Override Comment']] = sectionDDetails.TSReasonOverride;
            data[columns.SectionD['Technical Skills Reviewer Comments']] = sectionDDetails.TSReviewerComments;
            data[columns.SectionD['Technical Skills Staff Comments']] = sectionDDetails.TSStaffComments;

            // Section E Details
            const sectionEDetails = reviewDetails.SectionEDetails;
            data[columns.SectionE['Calculated Overall Performance Rating']] = sectionEDetails.CalculatedOverallRating;
            data[columns.SectionE['Overall Performance Rating']] = sectionEDetails.OverallRating;
            data[columns.SectionE['Overall Performance Rating by Admin']] = sectionEDetails.OverallRatingByAdmin;
            data[columns.SectionE['Overall Skills Rating Override Comment']] = sectionEDetails.OverrideReason;
            data[columns.SectionE['Overall Skills Reviewer Comments']] = sectionEDetails.ReviewerComments;
            data[columns.SectionE['Overall Skills Staff Comments']] = sectionEDetails.StaffComments;

            // Section F Details
            const sectionFDetails = reviewDetails.SectionFDetails;
            data[columns.SectionF['Other Reviewer Comments']] = sectionFDetails.ReviewerComments;
            data[columns.SectionF['Other Staff Comments']] = sectionFDetails.StaffComments;

            // Section G Details
            const sectionGDetails = reviewDetails.SectionGDetails;
            data[columns.SectionG['Goals Reviewer Comment']] = sectionGDetails.ReviewerComments;
            data[columns.SectionG['Goals Staff Comment']] = sectionGDetails.StaffComments;

            // Revert Comments section details
            const revertCommentDetails = reviewDetails.RevertCommentsDetails;
            data[columns.RevertCommentsSection['Revert Review Comments']] = revertCommentDetails.ReviewerRevertComments;

            // Acknowledgement section details
            const acknowledgementSectionDetails = reviewDetails.AcknowledgementDetails;
            if (saveType != Enums.SaveType.Revert) {
                // NOTE: Converting to date string, to avoid the time/date differece. Because time zones can be different for end user and regional settings
                if (acknowledgementSectionDetails.ReviewDiscussionDate != null && acknowledgementSectionDetails.ReviewDiscussionDate != undefined) {
                    data[columns.AcknowledgementSection['Date of Review Discussion']] = acknowledgementSectionDetails.ReviewDiscussionDate.toDateString();
                }
            }
            else {
                // In case of Revert, we will be deleting Review Discussion date, if already stored
                data[columns.AcknowledgementSection['Date of Review Discussion']] = null;
            }
        }

        // Review Status
        data[columns.Status] = reviewDetails.Status;
        data[columns.Submitted] = reviewDetails.SubmittedStatus;

        // Admin details - in case of submit when next status will be 'Awaiting Acknolwedge' and current status is 'Reviewer Complete'
        if (this.state.CurrentUserRoles.some(x => (x == Enums.UserRoles.SuperAdmin)) == true) {
            if (saveType == Enums.SaveType.Submit && reviewDetails.Status == Config.ReviewStatus.AwaitingAcknowledgement) {
                data[columns['Admin Id']] = (await this.userService.GetCurrentUser()).Id;
            }
            else if (saveType == Enums.SaveType.Save && reviewDetails.Status == Config.ReviewStatus.ReviewerCompleted) {
                // Admin details - in case of submit when next status will be 'Awaiting Acknolwedge' and current status is 'Reviewer Complete'
                data[columns['Admin Id']] = (await this.userService.GetCurrentUser()).Id;
            }
        }

        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.Reviews);
        if (this.state.IsCreateMode) {
            // Creating item
            await this.listItemService.createItem(data);
        }
        else {
            // Updating item
            await this.listItemService.updateItem(this.props.ReviewItemID, data);
        }
        // Redirecting user to Reviews listing page once saving is done
        if (saveType != Enums.SaveType.Save) {
            this.gotoListPage();
        }
        else {
            alert("Review Form changes saved successfully.");
        }
    }

    // On click event of 'Save' button
    private async onSaveReview() {
        const reviewStatus = this.state.ReviewStatus;
        let requiredReviewDetails = this.state.ReviewDetails;
        requiredReviewDetails.SubmittedStatus = this.getSubmitStatus(reviewStatus, Enums.ButtonTypes.Save);
        this.setState({
            ReviewDetails: requiredReviewDetails
        }, async () => {
            await this.onFormSave(Enums.SaveType.Save);
        });
    }

    // On click event of 'Submit' button
    private async onSubmitReview() {
        const reviewStatus = this.state.ReviewStatus;
        let requiredReviewDetails = this.state.ReviewDetails;
        requiredReviewDetails.Status = this.getNextStatus(reviewStatus);
        requiredReviewDetails.SubmittedStatus = this.getSubmitStatus(reviewStatus, Enums.ButtonTypes.Submit);
        this.setState({
            ReviewDetails: requiredReviewDetails
        }, async () => {
            await this.onFormSave(Enums.SaveType.Submit);
        });

    }

    // On click event of 'Revert' button
    private async onRevertReview() {
        const reviewStatus = this.state.ReviewStatus;
        const requiredReviewDetails = this.state.ReviewDetails;
        requiredReviewDetails.Status = this.getPrevStatus(reviewStatus);
        requiredReviewDetails.SubmittedStatus = this.getSubmitStatus(reviewStatus, Enums.ButtonTypes.Revert);
        this.setState({
            ReviewDetails: requiredReviewDetails
        }, async () => {
            await this.onFormSave(Enums.SaveType.Revert);
        });
    }

    // On click event of 'Replace Me' button
    private async onReplaceMe() {

        const requiredSubmitStatus = this.getSubmitStatus(this.state.ReviewStatus, Enums.ButtonTypes.ReplaceMe);

        const reviewDetails = this.state.ReviewDetails;
        let data = {};
        const columns = Config.ReviewsColumns;

        // Reviewer
        if (reviewDetails.ReplaceMeDetails.NewReviewer.Id) {
            data[columns.BasicInfo['Reviewer Id']] = reviewDetails.ReplaceMeDetails.NewReviewer.Id;
        }

        // Review Status
        data[columns.Submitted] = requiredSubmitStatus;

        // Updating item
        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.Reviews);
        await this.listItemService.updateItem(this.props.ReviewItemID, data);

        // Redirecting user to Reviews listing page once saving is done
        this.gotoListPage();
    }

    // On click event of 'Cancel' button
    private async onCancelReview() {
        // Deciding prev review status
        this.gotoListPage();
    }

    // Redirect user to 'Reviews' Listing page
    private gotoListPage() {
        let returnURL = this.props.AppContext.pageContext.web.absoluteUrl + Config.Links.ReviewsListAllItems;
        window.location.href = returnURL;
        return false;
    }

    // Identifying next status, based on current status value
    private getNextStatus(currentStatus: string) {
        let result: string | number;
        result = currentStatus; // By default setting it to current status
        switch (currentStatus) {
            case Config.ReviewStatus.NotStarted:
                result = Config.ReviewStatus.AwaitingReviewee;
                break;
            case Config.ReviewStatus.AwaitingReviewee:
                result = Config.ReviewStatus.AwaitingReviewer;
                break;
            case Config.ReviewStatus.AwaitingReviewer:
                result = Config.ReviewStatus.ReviewerCompleted;
                break;
            case Config.ReviewStatus.ReviewerCompleted:
                result = Config.ReviewStatus.AwaitingAcknowledgement;
                break;
            case Config.ReviewStatus.AwaitingAcknowledgement:
                result = Config.ReviewStatus.Acknowledged;
                break;
            case Config.ReviewStatus.Acknowledged:
                result = Config.ReviewStatus.Acknowledged;
                break;
        }
        return result;
    }

    // Identifying previous status, based on current status value
    private getPrevStatus(currentStatus: string) {
        let result: string | number;
        result = currentStatus; // By default setting it to current status
        switch (currentStatus) {
            case Config.ReviewStatus.NotStarted:
                result = Config.ReviewStatus.NotStarted;
                break;
            case Config.ReviewStatus.AwaitingReviewee:
                result = Config.ReviewStatus.NotStarted;
                break;
            case Config.ReviewStatus.AwaitingReviewer:
                result = Config.ReviewStatus.AwaitingReviewee;
                break;
            case Config.ReviewStatus.ReviewerCompleted:
                result = Config.ReviewStatus.AwaitingReviewer;
                break;
            case Config.ReviewStatus.AwaitingAcknowledgement:
                result = Config.ReviewStatus.ReviewerCompleted;
                break;
            case Config.ReviewStatus.Acknowledged:
                result = Config.ReviewStatus.AwaitingAcknowledgement;
                break;
        }
        return result;
    }

    // Deciding Submitted field value
    private getSubmitStatus(currentStatus: string, buttonType: Enums.ButtonTypes): number {
        let result: number;

        //Case: Replace Me
        if (buttonType == Enums.ButtonTypes.ReplaceMe) {
            result = 8;
        }

        //Case: Save
        if (buttonType == Enums.ButtonTypes.Save) {
            switch (currentStatus) {
                case Config.ReviewStatus.AwaitingReviewee:
                    result = 1;
                    break;
                case Config.ReviewStatus.AwaitingReviewer:
                    result = 1;
                    break;
                case Config.ReviewStatus.ReviewerCompleted:
                    result = 1;
                    break;
                default:
                    result = 1;
                    break;
            }
        }

        //Case: Submit
        if (buttonType == Enums.ButtonTypes.Submit) {
            switch (currentStatus) {
                case Config.ReviewStatus.NotStarted:
                    result = 99;
                    break;
                case Config.ReviewStatus.AwaitingReviewee:
                    result = 2;
                    break;
                case Config.ReviewStatus.AwaitingReviewer:
                    result = 4;
                    break;
                case Config.ReviewStatus.ReviewerCompleted:
                    result = 6;
                    break;
                case Config.ReviewStatus.AwaitingAcknowledgement:
                    result = 7;
                    break;
            }
        }

        //Case: Revert
        if (buttonType == Enums.ButtonTypes.Revert) {
            switch (currentStatus) {
                case Config.ReviewStatus.AwaitingReviewer:
                    result = 3;
                    break;
                case Config.ReviewStatus.ReviewerCompleted:
                    result = 5;
                    break;
            }
        }
        return result;
    }



    // Validations required for 'Start Review' button
    private validateStartReview(updatedReviewDetails: DI_ReviewDetails): boolean {
        let valid = true;
        const basicInfoDetails = { ...updatedReviewDetails.BasicDetails };
        if (basicInfoDetails.DaysOutOfTown == null) {
            valid = false;
        }
        if (basicInfoDetails.Reviewer.Id == null) {
            valid = false;
        }
        if (basicInfoDetails.ReviewerJobTitle == "" || basicInfoDetails.ReviewerJobTitle.trim() == "" || basicInfoDetails.ReviewerJobTitle == null) {
            valid = false;
        }
        if (basicInfoDetails.SBU == "" || basicInfoDetails.SBU.trim() == "" || basicInfoDetails.SBU == null) {
            valid = false;
        }
        if (basicInfoDetails.Staff.Id == null) {
            valid = false;
        }
        if (basicInfoDetails.StaffJobTitle == "" || basicInfoDetails.StaffJobTitle.trim() == "" || basicInfoDetails.StaffJobTitle == null) {
            valid = false;
        }
        if (basicInfoDetails.TimeAtLevel == "" || basicInfoDetails.TimeAtLevel.trim() == "" || basicInfoDetails.TimeAtLevel == null) {
            valid = false;
        }
        if (basicInfoDetails.YTDUtilization == null) {
            valid = false;
        }
        return valid;
    }

    // Validations reqired for 'Submit' button
    private validateSubmit(updatedReviewDetails: DI_ReviewDetails): boolean {
        let valid: boolean = true;
        const details = updatedReviewDetails;

        // If use has no edit rights
        if (!this.hasEditItemPermission) {
            valid = false;
        }

        // Validations required when Status is 'Awaiting Reviewer'
        if (details.Status == Config.ReviewStatus.AwaitingReviewer) {

            // Case: Validating all ratings dropdown values are selected in Section D and E
            if (
                details.SectionDDetails.DQWRating == "" ||
                details.SectionDDetails.GBRating == "" ||
                details.SectionDDetails.LDORating == "" ||
                details.SectionDDetails.MPIRating == "" ||
                details.SectionDDetails.SAMRating == "" ||
                details.SectionDDetails.TSOverallSkillRating == "" ||
                details.SectionDDetails.TSCalculatedOverallSkillRating == null ||
                details.SectionEDetails.OverallRating == "" ||
                details.SectionEDetails.CalculatedOverallRating == null
            ) {
                valid = false;
            }

            // Case: Overall Perforamnce Ratings are different then calculated ones, then comments are mandatory
            if (details.SectionEDetails.OverrideReason.trim() == ""
                && details.SectionEDetails.OverallRating != ""
                && details.SectionEDetails.CalculatedOverallRating != null
            ) {
                let OverallRating: number = parseFloat(details.SectionEDetails.OverallRating);
                let CalculatedRating: number = details.SectionEDetails.CalculatedOverallRating;
                let differece1: number = OverallRating - CalculatedRating;
                let differece2: number = CalculatedRating - OverallRating;
                if (differece1 > 0.5 || differece2 > 0.5) {
                    valid = false;
                }
            }

            // Case: Overall Technical Ratings are different then calculated ones, then comments are mandatory
            if (details.SectionDDetails.TSReasonOverride.trim() == ""
                && details.SectionDDetails.TSOverallSkillRating != ""
                && details.SectionDDetails.TSCalculatedOverallSkillRating != null
            ) {
                let OverallRating: number = parseFloat(details.SectionDDetails.TSOverallSkillRating);
                let CalculatedRating: number = details.SectionDDetails.TSCalculatedOverallSkillRating;
                let differece1: number = OverallRating - CalculatedRating;
                let differece2: number = CalculatedRating - OverallRating;
                if (differece1 > 0.5 || differece2 > 0.5) {
                    valid = false;
                }
            }

            //Case: Validating all Reviewer Comments are provided
            if (
                details.SectionBDetails.ReviewerComments.trim() == "" ||
                details.SectionCDetails.ReviewerComments.trim() == "" ||
                details.SectionDDetails.TSReviewerComments.trim() == "" ||
                details.SectionDDetails.GBReviewerComments.trim() == "" ||
                details.SectionDDetails.SAMReviewerComments.trim() == "" ||
                details.SectionDDetails.DQWReviewerComments.trim() == "" ||
                details.SectionDDetails.LDOReviewerComments.trim() == "" ||
                details.SectionDDetails.MPIReviewerComments.trim() == "" ||
                details.SectionEDetails.ReviewerComments.trim() == "" ||
                details.SectionFDetails.ReviewerComments.trim() == "" ||
                details.SectionGDetails.ReviewerComments.trim() == ""
            ) {
                valid = false;
            }

            // Case: At least one Technical Skill rating is added
            if (!(details.SectionDDetails.TSTechnicalSkills != null && details.SectionDDetails.TSTechnicalSkills.length >= 1)) {
                valid = false;
            }
            else {
                // Case: Validating all selected technical skills have ratings added
                details.SectionDDetails.TSTechnicalSkills.forEach((skillDetails, index) => {
                    if (skillDetails.Rating == undefined || skillDetails.Rating == null || skillDetails.Rating == '' || skillDetails.Rating == 'N/A') {
                        valid = false;
                    }
                });
            }

            // Case: Review Discussion Date related validation
            if (details.AcknowledgementDetails.ReviewDiscussionDate == null || details.AcknowledgementDetails.ReviewDiscussionDate == undefined) {
                valid = false;
            }
        }

        // Validations required when Status is 'Awaiting Reviewee'
        if (details.Status == Config.ReviewStatus.AwaitingReviewee) {

            // Case: Validating all Staff Comments fields
            if (
                details.SectionBDetails.StaffComments.trim() == "" ||
                details.SectionCDetails.StaffComments.trim() == "" ||
                details.SectionDDetails.TSStaffComments.trim() == "" ||
                details.SectionDDetails.GBStaffComments.trim() == "" ||
                details.SectionDDetails.SAMStaffComments.trim() == "" ||
                details.SectionDDetails.DQWStaffComments.trim() == "" ||
                details.SectionDDetails.LDOStaffComments.trim() == "" ||
                details.SectionDDetails.MPIStaffComments.trim() == "" ||
                details.SectionEDetails.StaffComments.trim() == "" ||
                details.SectionFDetails.StaffComments.trim() == "" ||
                details.SectionGDetails.StaffComments.trim() == ""
            ) {
                valid = false;
            }
        }

        // Validations required when Status is 'Reviewer Completed'
        if (details.Status == Config.ReviewStatus.ReviewerCompleted) {
            // No Validations as of now
        }

        return valid;
    }

    // Validations reqired for 'Revert' button
    private validateRevert(updatedReviewDetails: DI_ReviewDetails): boolean {
        let valid: boolean = true;
        const details = updatedReviewDetails;

        // If use has no edit rights
        if (!this.hasEditItemPermission) {
            valid = false;
        }

        // Validations required when Status is 'Awaiting Reviewer'
        if (details.Status == Config.ReviewStatus.AwaitingReviewer) {
            // Case: Revert Comments are not added
            if (details.RevertCommentsDetails.ReviewerRevertComments.trim() == "") {
                valid = false;
            }
        }

        // Validations required when Status is 'Reviewer Completed'
        if (details.Status == Config.ReviewStatus.ReviewerCompleted) {
            // No Validations as of now
        }
        return valid;
    }

    // Validations reqired for 'Save' button
    private validateSave(updatedReviewDetails: DI_ReviewDetails): boolean {
        let valid: boolean = true;
        const details = updatedReviewDetails;
        // If use has no edit rights
        if (!this.hasEditItemPermission) {
            valid = false;
        }
        return valid;
    }

    // This function will check whether to disable override comments textbox or not
    private CheckDisableOverrideOverallPerformanceComments(updatedReviewDetails: DI_ReviewDetails, currentUserRoles: Enums.UserRoles[]): boolean {
        let disable: boolean = true;
        // In case of 'Reviwer Completed', it will remain enabled for Admin users only
        // if (updatedReviewDetails.Status == Config.ReviewStatus.ReviewerCompleted && currentUserRoles.some(x => (x == Enums.UserRoles.SuperAdmin)) == true) {
        //     disable = false;
        // }
        // In case of 'Awaiting Reviewer', it will remain disable based on calculation
        if (updatedReviewDetails.Status == Config.ReviewStatus.AwaitingReviewer) {

            if (updatedReviewDetails.SectionEDetails.OverallRating != ""
                && updatedReviewDetails.SectionEDetails.CalculatedOverallRating != null
            ) {
                let OverallRating: number = parseFloat(updatedReviewDetails.SectionEDetails.OverallRating);
                let CalculatedRating: number = updatedReviewDetails.SectionEDetails.CalculatedOverallRating;
                let differece1: number = OverallRating - CalculatedRating;
                let differece2: number = CalculatedRating - OverallRating;
                if (differece1 > 0.5 || differece2 > 0.5) {
                    disable = false;
                }
            }
        }
        return disable;
    }

    // This function will check whether to disable override comments textbox or not
    private CheckDisableOverrideTechnicalSkillsComments(updatedReviewDetails: DI_ReviewDetails, currentUserRoles: Enums.UserRoles[]): boolean {
        let disable: boolean = true;
        // In case of 'Awaiting Reviewer', it will remain disable based on calculation
        if (updatedReviewDetails.Status == Config.ReviewStatus.AwaitingReviewer) {

            if (updatedReviewDetails.SectionDDetails.TSOverallSkillRating != ""
                && updatedReviewDetails.SectionDDetails.TSCalculatedOverallSkillRating != null
            ) {
                let OverallRating: number = parseFloat(updatedReviewDetails.SectionDDetails.TSOverallSkillRating);
                let CalculatedRating: number = updatedReviewDetails.SectionDDetails.TSCalculatedOverallSkillRating;
                let differece1: number = OverallRating - CalculatedRating;
                let differece2: number = CalculatedRating - OverallRating;
                if (differece1 > 0.5 || differece2 > 0.5) {
                    disable = false;
                }
            }
        }
        return disable;
    }

    public render(): React.ReactElement<IAnnualReviewFormProps> {

        const stackTokens: IStackTokens = { childrenGap: 20 };

        return (
            <React.Fragment>
                <div className={styles.AnnualReviewForm}>
                    <div className={styles.container}>
                        <div className={styles.logoImg} title="logo"></div>

                        {/* Basic Project/Staff Info */}
                        {this.state.IsLoading == false &&
                            <BasicInfo
                                AppContext={this.props.AppContext}
                                IsLoading={this.state.IsLoading}
                                ReviewDetails={this.state.ReviewDetails}
                                ReviewItemID={this.props.ReviewItemID}
                                ReviewStatus={this.state.ReviewStatus}
                                IsCreateMode={this.state.IsCreateMode}
                                onFormFieldValueChange={this.onFormFieldValueChange}
                                SBUOptions={this.sbuOptions}
                            ></BasicInfo>
                        }

                        {/* Displaying Review Start Button */}
                        {(this.state.IsLoading == false && this.state.ReviewStatus == Config.ReviewStatus.NotStarted) &&
                            <div className={styles.row}>
                                <div className={styles.col100}>
                                    <div className={styles.row}>
                                        <div className={styles.col100right}>
                                            <PrimaryButton
                                                text="Start Review"
                                                onClick={this.onStartReview}
                                                disabled={this.state.DisableStartRivewButton}
                                            ></PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* Displaying other sections only if Review Process is started (i.e. Status is not empty) */}
                        {this.state.ReviewStatus != Config.ReviewStatus.NotStarted &&
                            <React.Fragment>

                                {
                                    !this.state.HideReplaceMeSection &&
                                    /* Replace Me Section */
                                    < ReplaceMeSection
                                        AppContext={this.props.AppContext}
                                        IsLoading={this.state.IsLoading}
                                        ReviewDetails={this.state.ReviewDetails}
                                        onFormFieldValueChange={this.onFormFieldValueChange}
                                        onReplaceMeClick={this.onReplaceMe}
                                    ></ReplaceMeSection>
                                }

                                {/* A. Summary of Project Reviews for Year */}
                                <SectionA
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    ProjectReviewRows={this.state.ReviewDetails.SectionADetails.ProjectReviews}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableSection={this.state.DisableProjectReviewDetails}
                                ></SectionA>

                                {/* B.  Summary of Chargeable Activity and Contributions */}
                                <div className={styles.AddPageBreak}></div>
                                <SectionB
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewerComments={this.state.DisableReviewerComments}
                                    DisableStaffComments={this.state.DisableStaffComments}
                                ></SectionB>

                                {/* C.  Summary of Non-Chargeable Activity and Contributions*/}
                                <div className={styles.AddPageBreak}></div>
                                <SectionC
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewerComments={this.state.DisableReviewerComments}
                                    DisableStaffComments={this.state.DisableStaffComments}
                                ></SectionC>

                                {/* D. Annual Review Performance Rating */}
                                <div className={styles.AddPageBreak}></div>
                                <SectionD
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    TechnicalSkillRows={this.state.ReviewDetails.SectionDDetails.TSTechnicalSkills}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewerComments={this.state.DisableReviewerComments}
                                    DisableStaffComments={this.state.DisableStaffComments}
                                    DisableRatings={this.state.DisableRatings}
                                    DisableOverrideRatingsComments={this.state.DisableOverrideTechnicalSkillsComments}
                                    TechnicalSkillOptions={this.technicalSkillOptions}
                                    CurrentUserRoles={this.state.CurrentUserRoles}
                                ></SectionD>

                                {/* E. Overall Annual Review Performance Rating */}
                                <div className={styles.AddPageBreak}></div>
                                <SectionE
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewerComments={this.state.DisableReviewerComments}
                                    DisableOverrideRatingsComments={this.state.DisableOverrideOverallPerformanceComments}
                                    DisableStaffComments={this.state.DisableStaffComments}
                                    DisableRatings={this.state.DisableRatings}
                                    CurrentUserRoles={this.state.CurrentUserRoles}
                                ></SectionE>

                                {/* F.  Other Comments */}
                                <div className={styles.AddPageBreak}></div>
                                <SectionF
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewerComments={this.state.DisableReviewerComments}
                                    DisableStaffComments={this.state.DisableStaffComments}
                                ></SectionF>

                                {/* G.  Goals, Training and Development */}
                                <div className={styles.AddPageBreak}></div>
                                <SectionG
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewerComments={this.state.DisableReviewerComments}
                                    DisableStaffComments={this.state.DisableStaffComments}
                                ></SectionG>


                                {
                                    !this.state.HideRevertCommentsSection &&
                                    /* Revert Comments Section */
                                    <RevertCommentsSection
                                        AppContext={this.props.AppContext}
                                        IsLoading={this.state.IsLoading}
                                        ReviewDetails={this.state.ReviewDetails}
                                        onFormFieldValueChange={this.onFormFieldValueChange}
                                    ></RevertCommentsSection>
                                }


                                {/* Acknoledgement Section */}
                                <div className={styles.AddPageBreak}></div>
                                <AcknowledgementSection
                                    AppContext={this.props.AppContext}
                                    IsLoading={this.state.IsLoading}
                                    ReviewDetails={this.state.ReviewDetails}
                                    onFormFieldValueChange={this.onFormFieldValueChange}
                                    DisableReviewDiscussionDate={this.state.DisableReviewDiscussionDate}
                                ></AcknowledgementSection>

                                {/* Save/Submit/Revert Buttons */}
                                <React.Fragment>
                                    <div className={styles.row}>
                                        <div className={styles.col100}>
                                            <Stack horizontal tokens={stackTokens} className={styles.stackCenter}>
                                                {!this.state.HideSaveButton &&
                                                    <PrimaryButton
                                                        text="Save"
                                                        onClick={this.onSaveReview}
                                                        disabled={this.state.DisableSaveButton}
                                                    ></PrimaryButton>
                                                }
                                                <PrimaryButton
                                                    text="Cancel"
                                                    onClick={this.onCancelReview}
                                                ></PrimaryButton>
                                                {!this.state.HideRevertButton &&
                                                    <PrimaryButton
                                                        text="Revert"
                                                        onClick={this.onRevertReview}
                                                        disabled={this.state.DisableRevertButton}
                                                    ></PrimaryButton>
                                                }
                                                {!this.state.HideSubmitButton &&
                                                    <PrimaryButton
                                                        text={this.state.ReviewStatus == Config.ReviewStatus.AwaitingAcknowledgement ? "Acknowledge" : "Submit"}
                                                        onClick={this.onSubmitReview}
                                                        disabled={this.state.DisableSubmitButton}
                                                    ></PrimaryButton>
                                                }
                                            </Stack>
                                        </div>
                                    </div>
                                </React.Fragment>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </React.Fragment >
        );
    }
}
