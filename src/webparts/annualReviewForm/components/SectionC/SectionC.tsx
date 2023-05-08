import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import * as OfficeUI from '@fluentui/react';
import { ISectionCProps } from './ISectionCProps';
import { ISectionCState } from './ISectionCState';
import { TextField } from '@fluentui/react';

export default class SectionC extends React.Component<ISectionCProps, ISectionCState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails
        };
        this.onChangeReviewerComments = this.onChangeReviewerComments.bind(this);
        this.onChangeStaffComments = this.onChangeStaffComments.bind(this);
    }

    // On change of "Staff Comments"
    private onChangeStaffComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionCDetails.StaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "Reviewer Comments"
    private onChangeReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionCDetails.ReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    public render(): React.ReactElement<ISectionCProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>C.  Summary of Non-Chargeable Activity and Contributions</span>
                        </div>
                    </div>
                    <div className={styles.sectionNotes}>
                        <p>
                            Summarize any non-chargeable work performed in the past year, such as recruiting, business development and marketing, training and staff development, administrative projects etc.
                        </p>
                    </div>
                    <div className={styles.sectionContent}>
                        <div className={styles.row}>
                            <div className={styles.col100}>
                                <TextField
                                    resizable={false}
                                    label="Staff Comments:"
                                    multiline={true}
                                    disabled={this.props.DisableStaffComments}
                                    value={this.state.ReviewDetails.SectionCDetails.StaffComments}
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
                                    value={this.state.ReviewDetails.SectionCDetails.ReviewerComments}
                                    onChange={this.onChangeReviewerComments}
                                ></TextField>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}