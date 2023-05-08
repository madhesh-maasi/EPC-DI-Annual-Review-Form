import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { ISectionGProps } from './ISectionGProps';
import { ISectionGState } from './ISectionGState';
import { TextField } from '@fluentui/react';

export default class SectionG extends React.Component<ISectionGProps, ISectionGState>
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
        curretState.SectionGDetails.StaffComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "Reviewer Comments"
    private onChangeReviewerComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.SectionGDetails.ReviewerComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    public render(): React.ReactElement<ISectionGProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>G.  Goals, Training and Development</span>
                        </div>
                    </div>
                    <div className={styles.sectionNotes}>
                        <p>
                            Staff and reviewer should discuss and provide goals for the upcoming year and any training or development needs or requests.
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
                                    value={this.state.ReviewDetails.SectionGDetails.StaffComments}
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
                                    value={this.state.ReviewDetails.SectionGDetails.ReviewerComments}
                                    onChange={this.onChangeReviewerComments}
                                ></TextField>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}