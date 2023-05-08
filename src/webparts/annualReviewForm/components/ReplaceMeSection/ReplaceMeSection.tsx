import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { IReplaceMeSectionProps } from './IReplaceMeSectionProps';
import { IReplaceMeSectionState } from './IReplaceMeSectionState';
import { DefaultButton, IStackTokens, Label, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/controls/peoplepicker';
import MapResult from '../../../../domain/mappers/MapResult';
import { User } from '../../../../domain/models/types/User';
import { Enums } from '../../../../globals/Enums';
import { Config } from '../../../../globals/Config';

export default class ReplaceMeSection extends React.Component<IReplaceMeSectionProps, IReplaceMeSectionState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails,
            DisableReplaceReviewerButton: true
        };
        this.onChangeReviewer = this.onChangeReviewer.bind(this);
        this.onClickReplaceMe = this.onClickReplaceMe.bind(this);
    }

    // On change of Reviewer
    private async onChangeReviewer(items: any[]) {
        let curretState = this.state.ReviewDetails;
        if (items != null && items.length > 0) {
            curretState.ReplaceMeDetails.NewReviewer = await MapResult.map(items[0], Enums.MapperType.PnPControlResult, Enums.ItemResultType.User);
            this.setState({
                DisableReplaceReviewerButton: false
            });
        }
        else {
            curretState.ReplaceMeDetails.NewReviewer = new User();
            this.setState({
                DisableReplaceReviewerButton: true
            });
        }
        this.props.onFormFieldValueChange(curretState);
    }

    // On click of 'Replace Me'
    private async onClickReplaceMe() {
        this.props.onReplaceMeClick();
    }


    public render(): React.ReactElement<IReplaceMeSectionProps> {
        const stackTokens: IStackTokens = { childrenGap: 20 };
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>Replace Me</span>
                        </div>
                    </div>
                    <div className={styles.sectionContent}>
                        {this.state.ReviewDetails.Status != Config.ReviewStatus.ReviewerCompleted &&
                            <div className={styles.row}>
                                <div className={styles.col100}>
                                    <Stack horizontal tokens={stackTokens}>
                                        <Label>New Reviewer: </Label>
                                        <PeoplePicker
                                            context={this.props.AppContext}
                                            personSelectionLimit={1}
                                            groupName={""} // Leave this blank in case you want to filter from all users    
                                            showtooltip={true}
                                            required={true}
                                            disabled={false}
                                            ensureUser={true}
                                            peoplePickerWPclassName={styles.width250px}
                                            onChange={this.onChangeReviewer}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                            defaultSelectedUsers={[this.state.ReviewDetails.ReplaceMeDetails.NewReviewer.Email]}
                                            resolveDelay={1000} />
                                        <DefaultButton
                                            text="Replace Me"
                                            disabled={this.state.DisableReplaceReviewerButton}
                                            onClick={this.onClickReplaceMe}
                                        />
                                    </Stack>
                                </div>
                            </div>
                        }
                    </div>
                </div>
        );
    }
}