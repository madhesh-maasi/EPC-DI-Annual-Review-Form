import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { ISectionDProps } from './ISectionDProps';
import { ISectionDState } from './ISectionDState';
import RatingsDropdown from '../Controls/RatingsDropdown/RatingsDropdown';
import { DefaultButton, Dropdown, IconButton, IDropdownOption, IIconProps, initializeIcons, IStackTokens, Label, optionProperties, PrimaryButton, Stack, TeachingBubbleContent, TextField } from '@fluentui/react';
import { DI_TechnicalSkillRating } from '../../../../domain/models/DI_TechnicalSkillRating';
import { Guid } from '@microsoft/sp-core-library';
import { DI_SectionD } from '../../../../domain/models/DI_SectionD';
import { Config } from '../../../../globals/Config';
import PerformanceRatingScale from '../PerformanceRatingScale/PerformanceRatingScale';
import { Enums } from '../../../../globals/Enums';

export default class SectionD extends React.Component<ISectionDProps, ISectionDState>
{
    constructor(props: any) {
        super(props);

        let selectedSkills: string[] = [];
        this.props.TechnicalSkillRows.forEach(element => {
            selectedSkills.push(element.SkillName);
        });


        let modifiedRows: DI_TechnicalSkillRating[] = [];
        props.TechnicalSkillRows.forEach(item => {
            modifiedRows.push({ ...item });
        });

        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails,
            NewTechnicalSkillDetails: new DI_TechnicalSkillRating(),
            TechnicalSkillRows: props.TechnicalSkillRows,
            ModifiedTechnicalSkillRows: modifiedRows,
            AddedSkillNames: selectedSkills,
            DisableTechnicalSkillRatingsSelection: (
                this.props.ReviewDetails.Status != Config.ReviewStatus.AwaitingReviewer
            ) ? true : false,
            HideAddEditTechnicalSkillSection:
                (
                    this.props.ReviewDetails.Status == Config.ReviewStatus.NotStarted ||
                    this.props.ReviewDetails.Status == Config.ReviewStatus.Acknowledged ||
                    this.props.ReviewDetails.Status == Config.ReviewStatus.AwaitingAcknowledgement ||
                    this.props.ReviewDetails.Status == Config.ReviewStatus.ReviewerCompleted
                ) ? true : false,
            IsEditMode: false
        };

        initializeIcons();

        this.onChangeSAMStaffComments = this.onChangeSAMStaffComments.bind(this);
        this.onChangeSAMReviewerComments = this.onChangeSAMReviewerComments.bind(this);
        this.onChangeDQWStaffComments = this.onChangeDQWStaffComments.bind(this);
        this.onChangeDQWReviewerComments = this.onChangeDQWReviewerComments.bind(this);
        this.onChangeMPIStaffComments = this.onChangeMPIStaffComments.bind(this);
        this.onChangeMPIReviewerComments = this.onChangeMPIReviewerComments.bind(this);
        this.onChangeLDOStaffComments = this.onChangeLDOStaffComments.bind(this);
        this.onChangeLDOReviewerComments = this.onChangeLDOReviewerComments.bind(this);
        this.onChangeGBStaffComments = this.onChangeGBStaffComments.bind(this);
        this.onChangeGBReviewerComments = this.onChangeGBReviewerComments.bind(this);
        this.onChangeTSReasonOverride = this.onChangeTSReasonOverride.bind(this);
        this.onChangeTSStaffComments = this.onChangeTSStaffComments.bind(this);
        this.onChangeTSReviewerComments = this.onChangeTSReviewerComments.bind(this);

        this.onChangeSAMRating = this.onChangeSAMRating.bind(this);
        this.onChangeDQWRating = this.onChangeDQWRating.bind(this);
        this.onChangeMPIRating = this.onChangeMPIRating.bind(this);
        this.onChangeLDORating = this.onChangeLDORating.bind(this);
        this.onChangeGBRating = this.onChangeGBRating.bind(this);
        this.onChangeTSOverallSkillRating = this.onChangeTSOverallSkillRating.bind(this);

        this.onChangeAddTechnicalSkillName = this.onChangeAddTechnicalSkillName.bind(this);
        this.onChangeAddRatings = this.onChangeAddRatings.bind(this);
        this.onClickAddTechnicalSkillRatings = this.onClickAddTechnicalSkillRatings.bind(this);
        this.onClickDeleteTechnicalSkillRatings = this.onClickDeleteTechnicalSkillRatings.bind(this);
        this.onClickSaveChangesTechnicalSkills = this.onClickSaveChangesTechnicalSkills.bind(this);
        this.onClickCancelChangesTechnicalSkills = this.onClickCancelChangesTechnicalSkills.bind(this);

        this.onChangeEditTechnicalSkillName = this.onChangeEditTechnicalSkillName.bind(this);
        this.onChangeEditRatings = this.onChangeEditRatings.bind(this);
    }

    //#region "On Change Events of Comments"

    // On change of "SAM Staff Comments"
    private onChangeSAMStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.SAMStaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "SAM Reviewer Comments"
    private onChangeSAMReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.SAMReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "DQW Staff Comments"
    private onChangeDQWStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.DQWStaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "DQW Reviewer Comments"
    private onChangeDQWReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.DQWReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "MPI Staff Comments"
    private onChangeMPIStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.MPIStaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "MPI Reviewer Comments"
    private onChangeMPIReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.MPIReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "LDO Staff Comments"
    private onChangeLDOStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.LDOStaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "LDO Reviewer Comments"
    private onChangeLDOReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.LDOReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "GB Staff Comments"
    private onChangeGBStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.GBStaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "GB Reviewer Comments"
    private onChangeGBReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.GBReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "TS Reason Override"
    private onChangeTSReasonOverride(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.TSReasonOverride = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "TS Staff Comments"
    private onChangeTSStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.TSStaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "TS Reviewer Comments"
    private onChangeTSReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.TSReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    //#endregion

    //#region Rating Changes event

    private onChangeSAMRating(value: string) {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.SAMRating = value;
        curretState.SectionEDetails.CalculatedOverallRating = this.calculateOverallPerformanceRating(curretState.SectionDDetails);
        this.props.onFormFieldValueChange(curretState);
    }

    private onChangeDQWRating(value: string) {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.DQWRating = value;
        curretState.SectionEDetails.CalculatedOverallRating = this.calculateOverallPerformanceRating(curretState.SectionDDetails);
        this.props.onFormFieldValueChange(curretState);
    }

    private onChangeMPIRating(value: string) {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.MPIRating = value;
        curretState.SectionEDetails.CalculatedOverallRating = this.calculateOverallPerformanceRating(curretState.SectionDDetails);
        this.props.onFormFieldValueChange(curretState);
    }

    private onChangeLDORating(value: string) {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.LDORating = value;
        curretState.SectionEDetails.CalculatedOverallRating = this.calculateOverallPerformanceRating(curretState.SectionDDetails);
        this.props.onFormFieldValueChange(curretState);
    }

    private onChangeGBRating(value: string) {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.GBRating = value;
        curretState.SectionEDetails.CalculatedOverallRating = this.calculateOverallPerformanceRating(curretState.SectionDDetails);
        this.props.onFormFieldValueChange(curretState);
    }

    private onChangeTSOverallSkillRating(value: string) {
        let curretState = this.state.ReviewDetails;
        curretState.SectionDDetails.TSOverallSkillRating = value;
        curretState.SectionEDetails.CalculatedOverallRating = this.calculateOverallPerformanceRating(curretState.SectionDDetails);
        this.props.onFormFieldValueChange(curretState);
    }

    // Calculation of Overall Performance Rating 
    private calculateOverallPerformanceRating(sectionDDetails: DI_SectionD): number | null {
        let result: number | null;
        let total: number = 0;
        let count: number = 0;

        let ratings: string[] = [];
        ratings.push(sectionDDetails.GBRating);
        ratings.push(sectionDDetails.DQWRating);
        ratings.push(sectionDDetails.LDORating);
        ratings.push(sectionDDetails.MPIRating);
        ratings.push(sectionDDetails.SAMRating);
        ratings.push(sectionDDetails.TSOverallSkillRating);

        ratings.map((rating, index) => {
            if (rating != "" && rating != "N/A") {
                total += parseFloat(rating);
                count++;
            }
        });
        if (count != 0) {
            result = parseFloat((total / count).toFixed(2));
        }
        else {
            result = null;
        }
        return result;
    }

    //#endregion

    //#region "Technical Skill Ratings"

    // On change of "Add Technical Skill Name"
    private onChangeAddTechnicalSkillName(newValue: string): void {
        let technicalSkillDetails = this.state.NewTechnicalSkillDetails;
        technicalSkillDetails.SkillName = newValue;
        this.setState({
            NewTechnicalSkillDetails: technicalSkillDetails
        });
    }

    // On change of "Add Ratings"
    private onChangeAddRatings(newValue: string): void {
        let technicalSkillDetails = this.state.NewTechnicalSkillDetails;
        technicalSkillDetails.Rating = newValue;
        this.setState({
            NewTechnicalSkillDetails: technicalSkillDetails
        });
    }

    // On click of "ADD" button in Technical Skills section
    private onClickAddTechnicalSkillRatings() {

        let reviewDetails = this.state.ReviewDetails;
        let newTechnicalSkillDetails = this.state.NewTechnicalSkillDetails;

        //Assigning GUID to uniquely identify entry - while deleting/editing
        newTechnicalSkillDetails.UniqueNumber = Guid.newGuid();

        let allSkillRows: DI_TechnicalSkillRating[] = this.state.TechnicalSkillRows;
        allSkillRows.push(newTechnicalSkillDetails);

        let modifiedRows: DI_TechnicalSkillRating[] = [];
        allSkillRows.forEach(item => {
            modifiedRows.push({ ...item });
        });

        let selectedSkills: string[] = this.state.AddedSkillNames;
        selectedSkills.push(newTechnicalSkillDetails.SkillName);

        //Reseting new entry details
        let emptySkillDetails: DI_TechnicalSkillRating = new DI_TechnicalSkillRating();
        emptySkillDetails.Rating = null;
        emptySkillDetails.SkillName = "";

        this.setState({
            NewTechnicalSkillDetails: emptySkillDetails,
            TechnicalSkillRows: allSkillRows,
            AddedSkillNames: selectedSkills,
            ModifiedTechnicalSkillRows: modifiedRows
        }, () => {
            reviewDetails.SectionDDetails.TSTechnicalSkills = allSkillRows;
            reviewDetails.SectionDDetails.TSCalculatedOverallSkillRating = this.calculateOverallTechnicalSkillsRating();
            this.props.onFormFieldValueChange(reviewDetails);
        });
    }

    // On click of "DELETE" button in Technical Skill Rarings section
    private onClickDeleteTechnicalSkillRatings(uniqueNumber: Guid) {
        const skillRows = this.state.TechnicalSkillRows.filter(item => item.UniqueNumber !== uniqueNumber);
        let selectedSkills: string[] = [];
        skillRows.forEach(element => {
            selectedSkills.push(element.SkillName);
        });
        let modifiedRows: DI_TechnicalSkillRating[] = [];
        skillRows.forEach(item => {
            modifiedRows.push({ ...item });
        });
        this.setState({
            TechnicalSkillRows: skillRows,
            AddedSkillNames: selectedSkills,
            ModifiedTechnicalSkillRows: modifiedRows
        }, () => {
            let reviewDetails = this.state.ReviewDetails;
            reviewDetails.SectionDDetails.TSTechnicalSkills = skillRows;
            reviewDetails.SectionDDetails.TSCalculatedOverallSkillRating = this.calculateOverallTechnicalSkillsRating();
            this.props.onFormFieldValueChange(reviewDetails);
        });
    }

    // Calculating the average of all technical skill ratings
    private calculateOverallTechnicalSkillsRating(): number | null {
        let result: number | null;
        let total: number = 0;
        let count: number = 0;
        this.state.TechnicalSkillRows.map((skillDetails, index) => {
            if (skillDetails.Rating != null && skillDetails.Rating != undefined && skillDetails.Rating != "" && skillDetails.Rating != "N/A") {
                total += parseFloat(skillDetails.Rating);
                count++;
            }
        });
        if (count != 0) {
            result = parseFloat((total / count).toFixed(2));
        }
        else {
            result = null;
        }
        return result;
    }


    // On click of "SAVE CHANGES" button in Technical Skills section
    private onClickSaveChangesTechnicalSkills() {

        let selectedSkills: string[] = [];
        let modifiedRows: DI_TechnicalSkillRating[] = [];
        this.state.ModifiedTechnicalSkillRows.forEach(element => {
            selectedSkills.push(element.SkillName);
            modifiedRows.push({ ...element });
        });

        this.setState({
            TechnicalSkillRows: modifiedRows,
            IsEditMode: false,
            AddedSkillNames: selectedSkills
        }, () => {
            let reviewDetails = this.state.ReviewDetails;
            reviewDetails.SectionDDetails.TSTechnicalSkills = modifiedRows;
            reviewDetails.SectionDDetails.TSCalculatedOverallSkillRating = this.calculateOverallTechnicalSkillsRating();
            this.props.onFormFieldValueChange(reviewDetails);
        });
    }

    // On click of "Cancel Editing" button in Technical Skills section
    private onClickCancelChangesTechnicalSkills() {
        let modifiedRows: DI_TechnicalSkillRating[] = [];
        this.state.TechnicalSkillRows.forEach(item => {
            modifiedRows.push({ ...item });
        });
        this.setState({
            IsEditMode: false,
            ModifiedTechnicalSkillRows: modifiedRows
        });
    }

    // On change of "Edit Technical Skill Name"
    private onChangeEditTechnicalSkillName(index: number, newValue: string): void {
        let modifiedRows: DI_TechnicalSkillRating[] = this.state.ModifiedTechnicalSkillRows;
        modifiedRows[index].SkillName = newValue;
        this.setState({
            ModifiedTechnicalSkillRows: modifiedRows
        });
    }

    // On change of "Edit Ratings"
    private onChangeEditRatings(index: number, newValue: string): void {
        let modifiedRows: DI_TechnicalSkillRating[] = this.state.ModifiedTechnicalSkillRows;
        modifiedRows[index].Rating = newValue;
        this.setState({
            ModifiedTechnicalSkillRows: modifiedRows
        });
    }

    // Deciding values of technical skills
    private getTechnicalSkillOptions(): IDropdownOption[] {
        let result: IDropdownOption[] = [];
        this.props.TechnicalSkillOptions.forEach(element => {
            let option = element;
            option.disabled = this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf(element.text) >= 0 ? true : false;
            result.push(option);
        });
        return result;
    }
    //#endregion

    public render(): React.ReactElement<ISectionDProps> {

        const stackHorizontalTokens: IStackTokens = { childrenGap: 20 };
        const technicalSkillOptions: IDropdownOption[] = this.getTechnicalSkillOptions();

        // const technicalSkillOptions: IDropdownOption[] = [
        //     {
        //         key: 'Accounting', text: 'Accounting',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Accounting") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Financial Analysis', text: 'Financial Analysis',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Financial Analysis") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Statistics', text: 'Statistics',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Statistics") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Financial / Economic Modeling & Forecasting', text: 'Financial / Economic Modeling & Forecasting',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Financial / Economic Modeling & Forecasting") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Damages & Lost Profits Calculation', text: 'Damages & Lost Profits Calculation',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Damages & Lost Profits Calculation") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Valuation and Appraisal', text: 'Valuation and Appraisal',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Valuation and Appraisal") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Internal Control Assessment', text: 'Internal Control Assessment',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Internal Control Assessment") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Research', text: 'Research',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Research") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Expert Report Writing', text: 'Expert Report Writing',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Expert Report Writing") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Workpaper Documentation & QC Procedures', text: 'Workpaper Documentation & QC Procedures',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Workpaper Documentation & QC Procedures") >= 0 ? true : false
        //     },
        //     {
        //         key: 'MS Office (Word, Excel, Access, PowerPoint)', text: 'MS Office (Word, Excel, Access, PowerPoint)',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("MS Office (Word, Excel, Access, PowerPoint)") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Presentations', text: 'Presentations',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Presentations") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Computer Forensics', text: 'Computer Forensics',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Computer Forensics") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Discovery Management', text: 'Discovery Management',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Discovery Management") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Data Analytics', text: 'Data Analytics',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Data Analytics") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Machine Learning and Predictive Analysis', text: 'Machine Learning and Predictive Analysis',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Machine Learning and Predictive Analysis") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Legal and Regulatory Compliance', text: 'Legal and Regulatory Compliance',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Legal and Regulatory Compliance") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Cyber Assessments', text: 'Cyber Assessments',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Cyber Assessments") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Incident Response', text: 'Incident Response',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Incident Response") >= 0 ? true : false
        //     },
        //     {
        //         key: 'Data Privacy, Risk, and Governance', text: 'Data Privacy, Risk, and Governance',
        //         disabled: this.state.IsEditMode ? false : this.state.AddedSkillNames.indexOf("Data Privacy, Risk, and Governance") >= 0 ? true : false
        //     },
        // ];

        const ratingOptions: IDropdownOption[] = [
            { key: '', text: '' },
            { key: '5', text: '5' },
            { key: '4.5', text: '4.5' },
            { key: '4', text: '4' },
            { key: '3.5', text: '3.5' },
            { key: '3', text: '3' },
            { key: '2.5', text: '2.5' },
            { key: '2', text: '2' },
            { key: '1.5', text: '1.5' },
            { key: '1', text: '1' }
        ];

        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :

                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>D. Annual Review Performance Rating</span>
                        </div>
                    </div>
                    <div className={styles.sectionNotes}>
                        <p>
                            In each of the five competency areas, the reviewee should provide comments to address the behaviours listed in the DI Competency Matrix for the applicable job title. Reviewee will not provide a rating. Reviewer will provide rating and additional comments.
                        </p>
                    </div>
                    <div className={styles.sectionContent}>

                        {/* Performance Rating Scale */}
                        <PerformanceRatingScale AppContext={this.props.AppContext} IsLoading={this.state.IsLoading}></PerformanceRatingScale>

                        {/* Section: Steward of A&M */}
                        <div className={styles.AddPageBreak}></div>
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.colHeader100}>
                                    <span className={styles.subTitle}>Steward of A&M</span>
                                </div>
                            </div>
                            <div className={styles.sectionContent}>
                                <ul className={styles.ULSectionD}>
                                    <li>Lives A&M Values</li>
                                    <li>Acts in the best interest of the firm</li>
                                    <li>Supports development of A&M community and morale</li>
                                    <li>Demonstrates spirit of service</li>
                                </ul>
                                <div className={styles.row}>
                                    <div className={styles.tablewraper}>
                                        <table className={styles.technicalskilltable}>
                                            <tr>
                                                <td className={styles.colskill}>
                                                    <Label>Rating:</Label>
                                                </td>
                                                <td className={styles.colrating}>
                                                    <RatingsDropdown
                                                        AppContext={this.props.AppContext}
                                                        IsLoading={false}
                                                        Disabled={this.props.DisableRatings}
                                                        Value={this.state.ReviewDetails.SectionDDetails.SAMRating}
                                                        onRatingsValueChange={this.onChangeSAMRating}
                                                    ></RatingsDropdown>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Staff Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableStaffComments}
                                            value={this.state.ReviewDetails.SectionDDetails.SAMStaffComments}
                                            onChange={this.onChangeSAMStaffComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Reviewer Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableReviewerComments}
                                            value={this.state.ReviewDetails.SectionDDetails.SAMReviewerComments}
                                            onChange={this.onChangeSAMReviewerComments}
                                        ></TextField>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Section: Delivers Quality Work */}
                        <div className={styles.AddPageBreak}></div>
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.colHeader100}>
                                    <span className={styles.subTitle}>Delivers Quality Work</span>
                                </div>
                            </div>
                            <div className={styles.sectionContent}>

                                <ul className={styles.ULSectionD}>
                                    <li>Solves complex problems and drives results</li>
                                    <li>Acts in best interest of client</li>
                                    <li>Manages risk and profitability</li>
                                </ul>


                                <div className={styles.row}>
                                    <div className={styles.tablewraper}>
                                        <table className={styles.technicalskilltable}>
                                            <tr>
                                                <td className={styles.colskill}>
                                                    <Label>Rating:</Label>
                                                </td>
                                                <td className={styles.colrating}>
                                                    <RatingsDropdown
                                                        AppContext={this.props.AppContext}
                                                        IsLoading={false}
                                                        Disabled={this.props.DisableRatings}
                                                        Value={this.state.ReviewDetails.SectionDDetails.DQWRating}
                                                        onRatingsValueChange={this.onChangeDQWRating}
                                                    ></RatingsDropdown>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Staff Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableStaffComments}
                                            value={this.state.ReviewDetails.SectionDDetails.DQWStaffComments}
                                            onChange={this.onChangeDQWStaffComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Reviewer Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableReviewerComments}
                                            value={this.state.ReviewDetails.SectionDDetails.DQWReviewerComments}
                                            onChange={this.onChangeDQWReviewerComments}
                                        ></TextField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Manages Personal Impact */}
                        <div className={styles.AddPageBreak}></div>
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.colHeader100}>
                                    <span className={styles.subTitle}>Manages Personal Impact</span>
                                </div>
                            </div>
                            <div className={styles.sectionContent}>

                                <ul className={styles.ULSectionD}>
                                    <li>Communicates effectively</li>
                                    <li>Collaborates with others</li>
                                    <li>Demonstrates emotional intelligence</li>
                                    <li>Participates in learning and development process</li>
                                </ul>

                                <div className={styles.row}>
                                    <div className={styles.tablewraper}>
                                        <table className={styles.technicalskilltable}>
                                            <tr>
                                                <td className={styles.colskill}>
                                                    <Label>Rating:</Label>
                                                </td>
                                                <td className={styles.colrating}>
                                                    <RatingsDropdown
                                                        AppContext={this.props.AppContext}
                                                        IsLoading={false}
                                                        Disabled={this.props.DisableRatings}
                                                        Value={this.state.ReviewDetails.SectionDDetails.MPIRating}
                                                        onRatingsValueChange={this.onChangeMPIRating}
                                                    ></RatingsDropdown>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Staff Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableStaffComments}
                                            value={this.state.ReviewDetails.SectionDDetails.MPIStaffComments}
                                            onChange={this.onChangeMPIStaffComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Reviewer Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableReviewerComments}
                                            value={this.state.ReviewDetails.SectionDDetails.MPIReviewerComments}
                                            onChange={this.onChangeMPIReviewerComments}
                                        ></TextField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Leads and Develops Others */}
                        <div className={styles.AddPageBreak}></div>
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.colHeader100}>
                                    <span className={styles.subTitle}>Leads and Develops Others</span>
                                </div>
                            </div>
                            <div className={styles.sectionContent}>

                                <ul className={styles.ULSectionD}>
                                    <li>Coaches and mentors others</li>
                                    <li>Delivers timely and effective feedback</li>
                                    <li>Engages in performance management</li>
                                </ul>

                                <div className={styles.row}>
                                    <div className={styles.tablewraper}>
                                        <table className={styles.technicalskilltable}>
                                            <tr>
                                                <td className={styles.colskill}>
                                                    <Label>Rating:</Label>
                                                </td>
                                                <td className={styles.colrating}>
                                                    <RatingsDropdown
                                                        AppContext={this.props.AppContext}
                                                        IsLoading={false}
                                                        Disabled={this.props.DisableRatings}
                                                        Value={this.state.ReviewDetails.SectionDDetails.LDORating}
                                                        onRatingsValueChange={this.onChangeLDORating}
                                                    ></RatingsDropdown>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Staff Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableStaffComments}
                                            value={this.state.ReviewDetails.SectionDDetails.LDOStaffComments}
                                            onChange={this.onChangeLDOStaffComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Reviewer Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableReviewerComments}
                                            value={this.state.ReviewDetails.SectionDDetails.LDOReviewerComments}
                                            onChange={this.onChangeLDOReviewerComments}
                                        ></TextField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Grows Business */}
                        <div className={styles.AddPageBreak}></div>
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.colHeader100}>
                                    <span className={styles.subTitle}>Grows Business</span>
                                </div>
                            </div>
                            <div className={styles.sectionContent}>

                                <ul className={styles.ULSectionD}>
                                    <li>Identifies and recruits talent</li>
                                    <li>Builds quality relationships and networks</li>
                                    <li>Originates new work and expands work with existing client base</li>
                                </ul>

                                <div className={styles.row}>
                                    <div className={styles.tablewraper}>
                                        <table className={styles.technicalskilltable}>
                                            <tr>
                                                <td className={styles.colskill}>
                                                    <Label>Rating:</Label>
                                                </td>
                                                <td className={styles.colrating}>
                                                    <RatingsDropdown
                                                        AppContext={this.props.AppContext}
                                                        IsLoading={false}
                                                        Disabled={this.props.DisableRatings}
                                                        Value={this.state.ReviewDetails.SectionDDetails.GBRating}
                                                        onRatingsValueChange={this.onChangeGBRating}
                                                    ></RatingsDropdown>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Staff Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableStaffComments}
                                            value={this.state.ReviewDetails.SectionDDetails.GBStaffComments}
                                            onChange={this.onChangeGBStaffComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Reviewer Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableReviewerComments}
                                            value={this.state.ReviewDetails.SectionDDetails.GBReviewerComments}
                                            onChange={this.onChangeGBReviewerComments}
                                        ></TextField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Technical Skills */}
                        <div className={styles.AddPageBreak}></div>
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.colHeader100}>
                                    <span className={styles.subTitle}>Technical Skills</span>
                                </div>
                            </div>
                            <div className={styles.sectionNotes}>
                                <p>
                                    Reviewee should select the technical skills they expect to be evaluated on in the drop down menu below.  Three to five skills are optimal, but you can select up to seven.  It’s preferable that you discuss your selections with your reviewer in advance.  The final selection of technical skills is at the discretion of the Reviewer who may change, remove, or add to the selections and rate them individually. An overall rating is calculated by the form but can be overridden by the Reviewer.
                                </p>
                            </div>
                            <div className={styles.sectionContent}>
                                {(this.state.IsEditMode == false && this.state.HideAddEditTechnicalSkillSection == false) &&
                                    <div className={styles.addTechnicalSkill}>
                                        <div className={styles.col100}>
                                            <div className={styles.row}>
                                                <div className={styles.col100}>
                                                    <label className={styles.boldlabel}>Add Technical Skill Rating:</label>
                                                </div>
                                            </div>
                                            <div className={styles.row}>
                                                <div className={styles.col50left}>
                                                    <Dropdown
                                                        placeholder="Select Technical Skill"
                                                        options={technicalSkillOptions}
                                                        selectedKey={this.state.NewTechnicalSkillDetails.SkillName}
                                                        onChange={(e, selectedOption) => {
                                                            this.onChangeAddTechnicalSkillName(selectedOption.text);
                                                        }}
                                                    />
                                                </div>

                                                <div className={styles.col15left}>
                                                    <Dropdown
                                                        placeholder="Select Rating"
                                                        options={ratingOptions}
                                                        selectedKey={this.state.NewTechnicalSkillDetails.Rating}
                                                        disabled={this.state.DisableTechnicalSkillRatingsSelection}
                                                        onChange={(e, selectedOption) => {
                                                            this.onChangeAddRatings(selectedOption.text);
                                                        }}
                                                    />
                                                </div>
                                                <div className={styles.col35left}>
                                                    <Stack horizontal={true} tokens={stackHorizontalTokens}>
                                                        <PrimaryButton
                                                            text="Add"
                                                            onClick={this.onClickAddTechnicalSkillRatings}
                                                            disabled={
                                                                this.state.TechnicalSkillRows.length >= 7 ? true :
                                                                    this.state.DisableTechnicalSkillRatingsSelection ?
                                                                        (
                                                                            this.state.NewTechnicalSkillDetails.SkillName == null ||
                                                                            this.state.NewTechnicalSkillDetails.SkillName == ""
                                                                        ) ? true : false
                                                                        :
                                                                        (
                                                                            this.state.NewTechnicalSkillDetails.Rating == null ||
                                                                            this.state.NewTechnicalSkillDetails.Rating == "" ||
                                                                            this.state.NewTechnicalSkillDetails.SkillName == null ||
                                                                            this.state.NewTechnicalSkillDetails.SkillName == ""
                                                                        ) ? true : false
                                                            }
                                                        />
                                                        {this.state.TechnicalSkillRows.length > 0 &&
                                                            <PrimaryButton
                                                                text="Edit Technical Skills"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        IsEditMode: true
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                    </Stack>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {this.state.IsEditMode == true &&
                                    <div className={styles.addTechnicalSkill}>
                                        <div className={styles.row}>
                                            <div className={styles.col50left}></div>
                                            <div className={styles.col50right}>
                                                <PrimaryButton
                                                    text="Save Changes"
                                                    onClick={this.onClickSaveChangesTechnicalSkills.bind(this)}
                                                />
                                                &nbsp;
                                                <DefaultButton
                                                    text="Cancel Editing"
                                                    onClick={this.onClickCancelChangesTechnicalSkills}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }


                                <table className={styles.technicalskilltable}>
                                    <thead>
                                        <tr>
                                            <th className={styles.colskill}>
                                                <Label className={styles.boldlabel} >Technical Skill Evaluated</Label>
                                            </th>
                                            <th className={styles.colrating}>
                                                <Label className={styles.boldlabel}>Reviewer Rating</Label>
                                            </th>
                                            {this.state.IsEditMode == false && this.state.HideAddEditTechnicalSkillSection == false &&
                                                <th className={styles.colOperations}>
                                                    &nbsp;
                                                </th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            //Case: When there is no data
                                            this.state.TechnicalSkillRows.length == 0 &&
                                            <tr>
                                                <td className={styles.colskill}>
                                                    &nbsp;
                                                </td>
                                                <td className={styles.colTechSkillRating}>
                                                    &nbsp;
                                                </td>
                                                {this.state.HideAddEditTechnicalSkillSection == false &&
                                                    <td className={styles.colOperations}>
                                                        &nbsp;
                                                    </td>
                                                }
                                            </tr>
                                        }
                                        {this.state.IsEditMode == false &&
                                            <React.Fragment>
                                                {this.state.TechnicalSkillRows.map((element, index) => {
                                                    const deleteIcon: IIconProps = { iconName: 'Delete' };
                                                    return <tr>
                                                        <td className={styles.colskill}>
                                                            <Label className={styles.normalLabel}>{element.SkillName}</Label>
                                                        </td>
                                                        <td className={styles.colrating}>
                                                            <Label className={styles.normalLabel}>{element.Rating}</Label>
                                                        </td>
                                                        {this.state.HideAddEditTechnicalSkillSection == false &&
                                                            <td className={styles.colOperations}>
                                                                <IconButton
                                                                    iconProps={deleteIcon}
                                                                    title="Delete"
                                                                    ariaLabel="Delete"
                                                                    disabled={this.state.HideAddEditTechnicalSkillSection ? true : false}
                                                                    onClick={this.onClickDeleteTechnicalSkillRatings.bind(this, element.UniqueNumber)} />
                                                            </td>
                                                        }
                                                    </tr>;
                                                })
                                                }
                                            </React.Fragment>
                                        }
                                        {this.state.IsEditMode == true &&
                                            <React.Fragment>
                                                {this.state.ModifiedTechnicalSkillRows.map((editRow, index) => {
                                                    return <tr key={index}>
                                                        <td className={styles.colskillEdit}>
                                                            <div className={styles.row}>
                                                                <div className={styles.col75left}>
                                                                    <Dropdown
                                                                        placeholder="Select Technical Skill"
                                                                        options={technicalSkillOptions}
                                                                        selectedKey={editRow.SkillName}
                                                                        onChange={(e, selectedOption) => {
                                                                            this.onChangeEditTechnicalSkillName(index, selectedOption.text);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={styles.colRatingEdit}>
                                                            <Dropdown
                                                                placeholder="Select Rating"
                                                                options={ratingOptions}
                                                                selectedKey={editRow.Rating}
                                                                disabled={this.state.DisableTechnicalSkillRatingsSelection}
                                                                onChange={(e, selectedOption) => {
                                                                    this.onChangeEditRatings(index, selectedOption.text);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>;
                                                })
                                                }
                                            </React.Fragment>
                                        }
                                        <tr>
                                            <td className={styles.colskill}>
                                                <Label className={styles.boldmargin15}>Calculated Overall Technical Skills Rating</Label>
                                            </td>
                                            <td className={styles.colrating} colSpan={2}>
                                                <Label className={styles.boldlabel}>
                                                    {this.state.ReviewDetails.SectionDDetails.TSCalculatedOverallSkillRating == null ? "-" :
                                                        this.state.ReviewDetails.SectionDDetails.TSCalculatedOverallSkillRating
                                                    }
                                                </Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.colskill}>
                                                <Label className={styles.boldmargin15} >Overall Technical Skills Rating</Label>
                                            </td>
                                            <td className={styles.colrating} colSpan={2}>
                                                <RatingsDropdown
                                                    AppContext={this.props.AppContext}
                                                    IsLoading={false}
                                                    Disabled={this.props.DisableRatings}
                                                    Value={this.state.ReviewDetails.SectionDDetails.TSOverallSkillRating}
                                                    onRatingsValueChange={this.onChangeTSOverallSkillRating}
                                                ></RatingsDropdown>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className={styles.row}
                                    hidden={
                                        this.state.ReviewDetails.Status == Config.ReviewStatus.AwaitingReviewee
                                            || (
                                                this.state.ReviewDetails.Status == Config.ReviewStatus.ReviewerCompleted
                                                && (this.props.CurrentUserRoles.some(x => (x == Enums.UserRoles.SuperAdmin)) == false)
                                                && (this.props.CurrentUserRoles.some(x => (x == Enums.UserRoles.Reviewer)) == false)
                                            )
                                            ? true : false
                                    }
                                >
                                    <div className={styles.col100}>
                                        <Label
                                            disabled={this.props.DisableOverrideRatingsComments}
                                        >
                                            Reasons for Override of Calculated Rating (<i>If the overall rating differs by more than .5 from the calculated rating, an explanation for the variance must be provided in the box below</i>):
                                        </Label>
                                        <TextField
                                            resizable={false}
                                            multiline={true}
                                            value={this.state.ReviewDetails.SectionDDetails.TSReasonOverride}
                                            onChange={this.onChangeTSReasonOverride}
                                            disabled={this.props.DisableOverrideRatingsComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.AddPageBreak}></div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Staff Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableStaffComments}
                                            value={this.state.ReviewDetails.SectionDDetails.TSStaffComments}
                                            onChange={this.onChangeTSStaffComments}
                                        ></TextField>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <TextField
                                            resizable={false}
                                            label="Reviewer Comments:"
                                            multiline={true}
                                            disabled={this.props.DisableReviewerComments}
                                            value={this.state.ReviewDetails.SectionDDetails.TSReviewerComments}
                                            onChange={this.onChangeTSReviewerComments}
                                        ></TextField>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}