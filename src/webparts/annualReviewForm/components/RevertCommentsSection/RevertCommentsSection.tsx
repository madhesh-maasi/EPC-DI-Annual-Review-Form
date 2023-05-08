import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { IRevertCommentsSectionProps } from './IRevertCommentsSectionProps';
import { IRevertCommentsSectionState } from './IRevertCommentsSectionState';
import { DatePicker, Label, TextField } from '@fluentui/react';
import { Config } from '../../../../globals/Config';

export default class RevertCommentsSection extends React.Component<IRevertCommentsSectionProps, IRevertCommentsSectionState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails
        };
        this.onChangeReviewerRevertComments = this.onChangeReviewerRevertComments.bind(this);
    }

    // On change of "Revert Reviewer Comments"
    private onChangeReviewerRevertComments(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.RevertCommentsDetails.ReviewerRevertComments = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    public render(): React.ReactElement<IRevertCommentsSectionProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>Revert Comments</span>
                        </div>
                    </div>
                    <div className={styles.sectionContent}>
                        {this.state.ReviewDetails.Status != Config.ReviewStatus.ReviewerCompleted &&
                            <div className={styles.row}>
                                <div className={styles.col100}>
                                    <Label>
                                        Revert Reviewer Comments (<i>Comments must be included in revert box before reverting. Comments in box will be included in an email to reviewee.</i>):
                                    </Label>
                                    <TextField
                                        resizable={false}
                                        multiline={true}
                                        value={this.state.ReviewDetails.RevertCommentsDetails.ReviewerRevertComments}
                                        onChange={this.onChangeReviewerRevertComments}
                                    ></TextField>
                                </div>
                            </div>
                        }
                    </div>
                </div>
        );
    }
}