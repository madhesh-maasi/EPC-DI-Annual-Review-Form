import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { IBasicInfoProps } from './IBasicInfoProps';
import { IBasicInfoState } from './IBasicInfoState';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Checkbox, Dropdown, IDropdownOption, Label, TextField } from '@fluentui/react';
import MapResult from '../../../../domain/mappers/MapResult';
import { Enums } from '../../../../globals/Enums';
import { User } from '../../../../domain/models/types/User';
import { Config } from '../../../../globals/Config';
import UserService from '../../../../services/UserService';

export default class BasicInfo extends React.Component<IBasicInfoProps, IBasicInfoState>
{
    private userService: UserService;

    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails
        };
        this.onChangeStaffName = this.onChangeStaffName.bind(this);
        this.onChangeReviewer = this.onChangeReviewer.bind(this);
        this.onChangeStaffJobTitle = this.onChangeStaffJobTitle.bind(this);
        this.onChangeSBU = this.onChangeSBU.bind(this);
        this.onChangeReviewerJobTitle = this.onChangeReviewerJobTitle.bind(this);
        this.onChangeTimeAtLevel = this.onChangeTimeAtLevel.bind(this);
        this.onChangeYTDUtilization = this.onChangeYTDUtilization.bind(this);
        this.onChangeDaysOutOfTown = this.onChangeDaysOutOfTown.bind(this);
        this.onChangeIsStaffCommentsMandatory = this.onChangeIsStaffCommentsMandatory.bind(this);
    }


    // On Component Mount
    public async componentDidMount() {
        this.userService = new UserService(this.props.AppContext);
        // Deciding Staff value
        if (this.props.IsCreateMode == true) {
            let reviewDetails = this.state.ReviewDetails;
            reviewDetails.BasicDetails.Staff = await this.userService.GetCurrentUser();
            this.setState({
                ReviewDetails: reviewDetails
            });
        }
    }

    // On change of Staff Name
    private async onChangeStaffName(items: any[]) {
        let curretState = this.state.ReviewDetails;
        if (items != null && items.length > 0) {
            curretState.BasicDetails.Staff = await MapResult.map(items[0], Enums.MapperType.PnPControlResult, Enums.ItemResultType.User);
        }
        else {
            curretState.BasicDetails.Staff = new User();
        }
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of Reviewer
    private async onChangeReviewer(items: any[]) {
        let curretState = this.state.ReviewDetails;
        if (items != null && items.length > 0) {
            curretState.BasicDetails.Reviewer = await MapResult.map(items[0], Enums.MapperType.PnPControlResult, Enums.ItemResultType.User);
        }
        else {
            curretState.BasicDetails.Reviewer = new User();
        }
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of Staff Job Title
    private onChangeStaffJobTitle(newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.BasicDetails.StaffJobTitle = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of SBU
    private onChangeSBU(newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.BasicDetails.SBU = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "Time at Level (Years, Months):"
    private onChangeTimeAtLevel(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.BasicDetails.TimeAtLevel = newValue;
        this.props.onFormFieldValueChange(curretState);
    }


    // On change of "YTD Utilization (%):"
    private onChangeYTDUtilization(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        const exp = /^[0-9\b]+$/;
        // Allowing only number
        if (newValue != "" && exp.test(newValue)) {
            curretState.BasicDetails.YTDUtilization = parseFloat(newValue);
        }
        else if (newValue == "") {
            curretState.BasicDetails.YTDUtilization = null;
        }
        else {
            // Reverting to old value
            if (curretState.BasicDetails.YTDUtilization == undefined || curretState.BasicDetails.YTDUtilization == null) {
                curretState.BasicDetails.YTDUtilization = null;
            }
            else {
                curretState.BasicDetails.YTDUtilization = this.state.ReviewDetails.BasicDetails.YTDUtilization;
            }
        }
        this.props.onFormFieldValueChange(curretState);
    }


    // On change of "Days Out of Town"
    private onChangeDaysOutOfTown(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let curretState = this.state.ReviewDetails;
        const exp = /^[0-9\b]+$/;
        // Allowing only number
        if (newValue != "" && exp.test(newValue)) {
            curretState.BasicDetails.DaysOutOfTown = parseFloat(newValue);
        }
        else if (newValue == "") {
            curretState.BasicDetails.DaysOutOfTown = null;
        }
        else {
            // Reverting to old value
            if (curretState.BasicDetails.DaysOutOfTown == undefined || curretState.BasicDetails.DaysOutOfTown == null) {
                curretState.BasicDetails.DaysOutOfTown = null;
            }
            else {
                curretState.BasicDetails.DaysOutOfTown = this.state.ReviewDetails.BasicDetails.DaysOutOfTown;
            }
        }
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of Reviewer Job Title
    private onChangeReviewerJobTitle(newValue: string): void {
        let curretState = this.state.ReviewDetails;
        curretState.BasicDetails.ReviewerJobTitle = newValue;
        this.props.onFormFieldValueChange(curretState);
    }

    // On change of "Is Staff Comments Mandatory"
    private onChangeIsStaffCommentsMandatory(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
        let curretState = this.state.ReviewDetails;
        curretState.BasicDetails.IsStaffCommentsMandatory = isChecked;
        this.props.onFormFieldValueChange(curretState);
    }

    public render(): React.ReactElement<IBasicInfoProps> {

        const jobTitleOptions: IDropdownOption[] = [
            { key: 'Managing Director', text: 'Managing Director' },
            { key: 'Senior Director', text: 'Senior Director' },
            { key: 'Director', text: 'Director' },
            { key: 'Senior Manager', text: 'Senior Manager' },
            { key: 'Manager', text: 'Manager' },
            { key: 'Senior Associate', text: 'Senior Associate' },
            { key: 'Associate', text: 'Associate' },
            { key: 'Analyst', text: 'Analyst' },
            { key: 'Other', text: 'Other' },
        ];

        // const sbuOptions: IDropdownOption[] = [
        //     { key: '570-Houston', text: '570-Houston' },
        //     { key: '571/57J-FTS', text: '571/57J-FTS' },
        //     { key: '572-Chicago', text: '572-Chicago' },
        //     { key: '573-NewYork', text: '573-NewYork' },
        //     { key: '574-RealEstate&EnvironmentalEconomics', text: '574-RealEstate&EnvironmentalEconomics' },
        //     { key: '575-NationalPractice', text: '575-NationalPractice' },
        //     { key: '577-Washington,DC', text: '577-Washington,DC' },
        //     { key: '578-Phoenix', text: '578-Phoenix' },
        //     { key: '579-Dallas', text: '579-Dallas' },
        //     { key: '57A-Boston', text: '57A-Boston' },
        //     { key: '57B-DC Investigations', text: '57B-DC Investigations' },
        //     { key: '57C-Denver', text: '57C-Denver' },
        //     { key: '57D-SanFrancisco', text: '57D-SanFrancisco' },
        //     { key: '57E-Detroit', text: '57E-Detroit' },
        //     { key: '57F-FinancialCrimes', text: '57F-FinancialCrimes' },
        //     { key: '57K-Cyber', text: '57K-Cyber' },
        //     { key: '470-Calgary', text: '470-Calgary' },
        //     { key: 'other', text: 'other' }
        // ];

        return (
            this.props.IsLoading == true ?
                <React.Fragment ></React.Fragment>
                :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>Disputes and Investigations - Annual Review Form</span>
                        </div>
                    </div>
                    <div className={styles.sectionContent}>
                        <div className={styles.row}>
                            <div className={styles.col25Right}>
                                <Label>Staff Name:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <PeoplePicker
                                    context={this.props.AppContext}
                                    personSelectionLimit={1}
                                    groupName={""} // Leave this blank in case you want to filter from all users    
                                    showtooltip={true}
                                    required={true}
                                    disabled={true}
                                    ensureUser={true}
                                    onChange={this.onChangeStaffName}
                                    showHiddenInUI={false}
                                    principalTypes={[PrincipalType.User]}
                                    defaultSelectedUsers={[this.state.ReviewDetails.BasicDetails.Staff.Email]}
                                    resolveDelay={1000} />

                            </div>
                            <div className={styles.col25Right}>
                                <Label>Staff  Job Title:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <Dropdown
                                    placeholder="Select Job Title"
                                    options={jobTitleOptions}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                    selectedKey={this.state.ReviewDetails.BasicDetails.StaffJobTitle}
                                    onChange={(e, selectedOption) => {
                                        this.onChangeStaffJobTitle(selectedOption.text);
                                    }} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col25Right}>
                                <Label>SBU:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <Dropdown
                                    placeholder="Select SBU"
                                    options={this.props.SBUOptions}
                                    selectedKey={this.state.ReviewDetails.BasicDetails.SBU}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                    onChange={(e, selectedOption) => {
                                        this.onChangeSBU(selectedOption.text);
                                    }} />
                            </div>
                            <div className={styles.col25Right}>
                                <Label>Time at Level (Years, Months):</Label>
                            </div>
                            <div className={styles.col25left}>
                                <TextField
                                    value={this.state.ReviewDetails.BasicDetails.TimeAtLevel}
                                    onChange={this.onChangeTimeAtLevel}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                ></TextField>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col25Right}>
                                <Label>YTD Utilization (%):</Label>
                            </div>
                            <div className={styles.col25left}>
                                <TextField
                                    value={this.state.ReviewDetails.BasicDetails.YTDUtilization == null ? "" : this.state.ReviewDetails.BasicDetails.YTDUtilization.toString()}
                                    onChange={this.onChangeYTDUtilization}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                ></TextField>
                            </div>
                            <div className={styles.col25Right}>
                                <Label>Days Out of Town:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <TextField
                                    value={this.state.ReviewDetails.BasicDetails.DaysOutOfTown == null ? "" : this.state.ReviewDetails.BasicDetails.DaysOutOfTown.toString()}
                                    onChange={this.onChangeDaysOutOfTown}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                ></TextField>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col25Right}>
                                <Label>Reviewer Name:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <PeoplePicker
                                    context={this.props.AppContext}
                                    personSelectionLimit={1}
                                    groupName={""} // Leave this blank in case you want to filter from all users    
                                    showtooltip={true}
                                    required={true}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                    ensureUser={true}
                                    onChange={this.onChangeReviewer}
                                    showHiddenInUI={false}
                                    principalTypes={[PrincipalType.User]}
                                    defaultSelectedUsers={[this.state.ReviewDetails.BasicDetails.Reviewer.Email]}
                                    resolveDelay={1000} />
                            </div>
                            <div className={styles.col25Right}>
                                <Label>Reviewer Job Title:</Label>
                            </div>
                            <div className={styles.col25left}>
                                <Dropdown
                                    placeholder="Select Job Title"
                                    options={jobTitleOptions}
                                    selectedKey={this.state.ReviewDetails.BasicDetails.ReviewerJobTitle}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                    onChange={(e, selectedOption) => {
                                        this.onChangeReviewerJobTitle(selectedOption.text);
                                    }} />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col25Right} hidden={true}>
                                <Label>Is Staff Comments Mandatory?</Label>
                            </div>
                            <div className={styles.col25left} hidden={true}>
                                <Checkbox
                                    label={this.state.ReviewDetails.BasicDetails.IsStaffCommentsMandatory ? "Yes" : "No"}
                                    disabled={this.state.ReviewDetails.Status == Config.ReviewStatus.NotStarted ? false : true}
                                    checked={this.state.ReviewDetails.BasicDetails.IsStaffCommentsMandatory}
                                    onChange={this.onChangeIsStaffCommentsMandatory} />
                            </div>
                            <div className={styles.col100right}>
                                {this.props.ReviewStatus != "" &&
                                    <Label className={styles.reviewStatus}>Review Status: {this.props.ReviewStatus}</Label>
                                }
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}