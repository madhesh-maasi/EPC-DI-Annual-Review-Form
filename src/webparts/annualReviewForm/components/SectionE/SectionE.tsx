import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { ISectionEProps } from './ISectionEProps';
import { ISectionEState } from './ISectionEState';
import RatingsDropdown from '../Controls/RatingsDropdown/RatingsDropdown';
import { Label, TextField } from '@fluentui/react';
import { Config } from '../../../../globals/Config';
import { Enums } from '../../../../globals/Enums';
import OverallPerformanceRatingScale from '../OverallPerformanceRatingScale/OverallPerformanceRatingScale';

export default class SectionE extends React.Component<ISectionEProps, ISectionEState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails,
            EnableRatings: this.allowOverallPerformanceRating(),
            // Over Performance Row will be visible to only Super Admin or Reviewer when status is reviewer completed
            HideOverallPerformanceRow:
                (
                    (
                        props.CurrentUserRoles.some(x => (x == Enums.UserRoles.SuperAdmin)) == false &&
                        props.CurrentUserRoles.some(x => (x == Enums.UserRoles.Reviewer)) == false
                    )
                    &&
                    (
                        props.ReviewDetails.Status == Config.ReviewStatus.ReviewerCompleted
                    )
                ) ? true : false
        };
        this.onChangeOverrideReason = this.onChangeOverrideReason.bind(this);
        this.onChangeReviewerComments = this.onChangeReviewerComments.bind(this);
        this.onChangeStaffComments = this.onChangeStaffComments.bind(this);
        this.onChangeOverallRating = this.onChangeOverallRating.bind(this);
    }

    // Checking whether to enable 'Overall Performance Ratings' or not
    private allowOverallPerformanceRating(): boolean {
        let result: boolean = false;
        // For Reviewer -> Enable
        if (this.props.ReviewDetails.Status == Config.ReviewStatus.AwaitingReviewer) {
            result = true;
        }
        // For Super Admin -> Enable
        if (this.props.ReviewDetails.Status == Config.ReviewStatus.ReviewerCompleted) {
            result = this.props.CurrentUserRoles.some(x => (x == Enums.UserRoles.SuperAdmin));
        }
        return result;
    }
    // On change of "Overrride Comments"
    private onChangeOverrideReason(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionEDetails.OverrideReason = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "Staff Comments"
    private onChangeStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionEDetails.StaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "Reviewer Comments"
    private onChangeReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionEDetails.ReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On Change of "Overall Ratings"
    private onChangeOverallRating(value: string) {
        let curretState = this.state.ReviewDetails;

        // If Reviewer Completed, then assigng the rating as given by Admin
        if (curretState.Status == Config.ReviewStatus.ReviewerCompleted) {
            curretState.SectionEDetails.OverallRatingByAdmin = value;
        }
        else {
            curretState.SectionEDetails.OverallRating = value;
            curretState.SectionEDetails.OverallRatingByAdmin = value;
        }

        this.props.onFormFieldValueChange(curretState);
    }

    public render(): React.ReactElement<ISectionEProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>E. Overall Annual Review Performance Rating</span>
                        </div>
                    </div>
                    <div className={styles.sectionNotes}>
                        <p>
                            Note the overall scale descriptions vary slightly from the individual attribute descriptions.
                            <br />
                            The form will calculate an overall performance rating, but the reviewer can override the calculation. If the override rating differs from the calculated rating by more than .5, the override must be explained. The overall rating will not be visible to reviewee until after DI’s consensus and calibration meetings have been completed. All other ratings will be visible after to the reviewee after the reviewer has completed this form.
                        </p>
                    </div>
                    <div className={styles.sectionContent}>
                        {/* Performance Rating Scale */}
                        <OverallPerformanceRatingScale AppContext={this.props.AppContext} IsLoading={this.state.IsLoading}></OverallPerformanceRatingScale>

                        <div className={styles.row}>
                            <div className={styles.tablewraper}>
                                <table className={styles.technicalskilltable}>
                                    <tr>
                                        <td className={styles.colskill}>
                                            <Label className={styles.boldmargin15}>Calculated Overall Performance Rating</Label>
                                        </td>
                                        <td className={styles.colrating}>
                                            <Label className={styles.boldlabel}>
                                                {this.state.ReviewDetails.SectionEDetails.CalculatedOverallRating == null ? "-" :
                                                    this.state.ReviewDetails.SectionEDetails.CalculatedOverallRating
                                                }
                                            </Label>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className={styles.colskill}>
                                            <Label className={styles.boldmargin15} >Overall Performance Rating</Label>
                                        </td>
                                        <td className={styles.colrating}>
                                            {!this.state.HideOverallPerformanceRow &&
                                                <RatingsDropdown
                                                    AppContext={this.props.AppContext}
                                                    IsLoading={false}
                                                    Disabled={!this.state.EnableRatings}
                                                    Value={this.state.ReviewDetails.SectionEDetails.OverallRatingByAdmin}
                                                    onRatingsValueChange={this.onChangeOverallRating}
                                                ></RatingsDropdown>
                                            }
                                        </td>
                                    </tr>

                                </table>
                            </div>
                        </div>
                        <div
                            className={styles.row}
                            hidden={
                                this.state.ReviewDetails.Status == Config.ReviewStatus.AwaitingReviewee
                                    || (
                                        this.state.ReviewDetails.Status == Config.ReviewStatus.ReviewerCompleted
                                        && (this.props.CurrentUserRoles.some(x => (x == Enums.UserRoles.SuperAdmin)) == false)
                                        && (this.props.CurrentUserRoles.some(x => (x == Enums.UserRoles.Reviewer)) == false)
                                    )
                                    ? true : false
                            }>
                            <div className={styles.col100}>
                                <Label
                                    disabled={this.props.DisableOverrideRatingsComments}

                                >
                                    Reasons for override of Calculated Rating (<i>If the overall rating differs by more than .5 from the calculated rating, an explanation for the variance must be provided in the box below</i>):
                                </Label>
                                <TextField
                                    resizable={false}
                                    multiline={true}
                                    value={this.state.ReviewDetails.SectionEDetails.OverrideReason}
                                    onChange={this.onChangeOverrideReason}
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
                                    value={this.state.ReviewDetails.SectionEDetails.StaffComments}
                                    onChange={this.onChangeStaffComments}
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
                                    value={this.state.ReviewDetails.SectionEDetails.ReviewerComments}
                                    onChange={this.onChangeReviewerComments}
                                ></TextField>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}