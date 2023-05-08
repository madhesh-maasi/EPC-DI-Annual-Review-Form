import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { IAcknowledgementSectionProps } from './IAcknowledgementSectionProps';
import { IAcknowledgementSectionState } from './IAcknowledgementSectionState';
import { DatePicker, Label, TextField } from '@fluentui/react';

export default class SectionG extends React.Component<IAcknowledgementSectionProps, IAcknowledgementSectionState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails
        };
    }

    // On change of Review Discussion Date
    private onChangeReviewDiscussionDate(newDate: Date): void {
        let curretState = this.state.ReviewDetails;
        curretState.AcknowledgementDetails.ReviewDiscussionDate = newDate;
        this.props.onFormFieldValueChange(curretState);
    }

    public render(): React.ReactElement<IAcknowledgementSectionProps> {
        const maxDate = new Date(Date.now());
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionContent}>
                        <div className={styles.row}>
                            <div className={styles.col25left}>
                                <Label>Date of Review Discussion:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <DatePicker
                                    disabled={this.props.DisableReviewDiscussionDate}
                                    placeholder="Select a date..."
                                    onSelectDate={(newDate: Date) => {
                                        this.onChangeReviewDiscussionDate(newDate);
                                    }}
                                    maxDate={maxDate}
                                    value={this.state.ReviewDetails.AcknowledgementDetails.ReviewDiscussionDate}
                                    ariaLabel="Select a date" />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col50left}>
                                <Label>Reviewer must indicate the date a performance discussion was held with Reviewee</Label>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col50left}>
                                <Label className={styles.boldlabel}>Acknowledgements: </Label>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col100}>
                                <Label>
                                    Reviewee acknowledges discussion with reviewer and the opportunity to document comments regarding reviewer ratings in the form.
                                    <br />
                                    Reviewee is not acknowledging agreement with Reviewer ratings by signing this form.
                                </Label>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col100}>
                                <TextField
                                    resizable={false}
                                    label="Acknowledgement History:"
                                    multiline={true}
                                    value={this.state.ReviewDetails.AcknowledgementDetails.AcknowledgementHistory}
                                    disabled={true}
                                ></TextField>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}