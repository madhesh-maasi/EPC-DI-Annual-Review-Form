import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { ISectionAProps } from './ISectionAProps';
import { ISectionAState } from './ISectionAState';
import { Label, TextField, PrimaryButton, IIconProps, initializeIcons, Stack, IStackTokens } from '@fluentui/react';
import { DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { DI_ProjectReviewDetail } from '../../../../domain/models/DI_ProjectReviewDetail';
import { Guid } from '@microsoft/sp-core-library';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';

export default class SectionA extends React.Component<ISectionAProps, ISectionAState>
{
    private modifiedRows: DI_ProjectReviewDetail[] = [];
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            ReviewDetails: props.ReviewDetails,
            NewProjectReviewDetails: new DI_ProjectReviewDetail(),
            ProjectReviewRows: props.ReviewDetails.SectionADetails.ProjectReviews,
            EditMode: false
        };

        this.ResetModifiedRows(undefined);

        this.onChangeAddProjectName = this.onChangeAddProjectName.bind(this);
        this.onChangeAddProjectDescription = this.onChangeAddProjectDescription.bind(this);
        this.onChangeAddReviewerEvaluation = this.onChangeAddReviewerEvaluation.bind(this);
        this.onChangeAddReviewerName = this.onChangeAddReviewerName.bind(this);
        this.onClickAddProjectReview = this.onClickAddProjectReview.bind(this);

        this.onChangeEditProjectName = this.onChangeEditProjectName.bind(this);
        this.onChangeEditProjectDescription = this.onChangeEditProjectDescription.bind(this);
        this.onChangeEditReviewerName = this.onChangeEditReviewerName.bind(this);
        this.onChangeEditReviewerEvaluation = this.onChangeEditReviewerEvaluation.bind(this);
        this.onClickSaveChangesProjectReview = this.onClickSaveChangesProjectReview.bind(this);
        this.onClickCancelChangesProjectReview = this.onClickCancelChangesProjectReview.bind(this);

        this.onClickDeleteProjectReview = this.onClickDeleteProjectReview.bind(this);

        initializeIcons();
    }

    // Reseting modified rows object
    private ResetModifiedRows(rows: DI_ProjectReviewDetail[]) {
        this.modifiedRows = [];
        if (rows != undefined) {
            rows.forEach(item => {
                this.modifiedRows.push({ ...item });
            });
        }
        else {
            this.state.ProjectReviewRows.forEach(item => {
                this.modifiedRows.push({ ...item });
            });
        }
    }

    //#region  "ADD REVIEW DETAILS"

    // On change of "Add Project Name"
    private onChangeAddProjectName(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let projectReviewDetails = this.state.NewProjectReviewDetails;
        projectReviewDetails.ProjectName = newValue;
        this.setState({
            NewProjectReviewDetails: projectReviewDetails
        });
    }

    // On change of "Add Project Description"
    private onChangeAddProjectDescription(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let projectReviewDetails = this.state.NewProjectReviewDetails;
        projectReviewDetails.ProjectDescription = newValue;
        this.setState({
            NewProjectReviewDetails: projectReviewDetails
        });
    }

    // On change of "Add Reviewer Name"
    private onChangeAddReviewerName(items: any[]): void {
        let projectReviewDetails = this.state.NewProjectReviewDetails;
        if (items != null && items.length > 0) {
            projectReviewDetails.ReviewerName = items[0].text;
            projectReviewDetails.ReviewerEmail = items[0].secondaryText;
        }
        else {
            projectReviewDetails.ReviewerName = null;
            projectReviewDetails.ReviewerEmail = null;
        }
        this.setState({
            NewProjectReviewDetails: projectReviewDetails
        });
    }

    // On change of "Add Reviewer Evaluation"
    private onChangeAddReviewerEvaluation(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
        let projectReviewDetails = this.state.NewProjectReviewDetails;
        const exp = /^[0-9\b]+$/;
        // Allowing only number
        if (newValue === '' || exp.test(newValue)) {
            projectReviewDetails.ReviewerEvaluation = newValue;
        }
        else {
            // Reverting to old value
            if (this.state.NewProjectReviewDetails.ReviewerEvaluation == undefined) {
                projectReviewDetails.ReviewerEvaluation = "";
            }
            else {
                projectReviewDetails.ReviewerEvaluation = this.state.NewProjectReviewDetails.ReviewerEvaluation;
            }

        }
        this.setState({
            NewProjectReviewDetails: projectReviewDetails
        });
    }

    // On click of "ADD" button in Project Review section
    private onClickAddProjectReview() {
        let reviewDetails = this.state.ReviewDetails;
        let newProjectReviewDetails = this.state.NewProjectReviewDetails;

        //Assigning GUID to uniquely identify project review entry - while deleting/editing
        newProjectReviewDetails.UniqueNumber = Guid.newGuid();

        let allReviewRows: DI_ProjectReviewDetail[] = this.state.ProjectReviewRows;
        allReviewRows.push(newProjectReviewDetails);
        this.ResetModifiedRows(allReviewRows);

        //Reseting new project details
        let emptyProjectReviewDetails: DI_ProjectReviewDetail = new DI_ProjectReviewDetail();
        emptyProjectReviewDetails.ProjectName = null;
        emptyProjectReviewDetails.ProjectDescription = null;
        emptyProjectReviewDetails.ReviewerName = null;
        emptyProjectReviewDetails.ReviewerEmail = null;
        emptyProjectReviewDetails.ReviewerEvaluation = null;

        this.setState({
            NewProjectReviewDetails: emptyProjectReviewDetails,
            ProjectReviewRows: allReviewRows
        }, () => {
            reviewDetails.SectionADetails.ProjectReviews = allReviewRows;
            this.props.onFormFieldValueChange(reviewDetails);
        });
    }

    //#endregion


    //#region "EDIT REVIEW DETAILS"

    // On change of "Edit Project Name Text Box"
    private onChangeEditProjectName(index: number, newValue: string): void {
        this.modifiedRows[index].ProjectName = newValue;
    }

    // On change of "Edit Project Description Text Box"
    private onChangeEditProjectDescription(index: number, newValue: string): void {
        this.modifiedRows[index].ProjectDescription = newValue;
    }

    // On change of "Edit Reviewer Name People Picket"
    private onChangeEditReviewerName(index: number, items: any[]): void {
        if (items != null && items.length > 0) {
            this.modifiedRows[index].ReviewerName = items[0].text;
            this.modifiedRows[index].ReviewerEmail = items[0].secondaryText;
        }
        else {
            this.modifiedRows[index].ReviewerName = null;
            this.modifiedRows[index].ReviewerEmail = null;
        }
    }

    // On change of "Edit Reviewer Evaluation Textbox"
    private onChangeEditReviewerEvaluation(index: number, newValue: string): void {
        this.modifiedRows[index].ReviewerEvaluation = newValue;
    }

    // On click of "SAVE CHANGES" button in Project Review section
    private onClickSaveChangesProjectReview() {
        this.setState({
            ProjectReviewRows: this.modifiedRows,
            EditMode: false
        }, () => {
            let reviewDetails = this.state.ReviewDetails;
            reviewDetails.SectionADetails.ProjectReviews = this.modifiedRows;
            this.props.onFormFieldValueChange(reviewDetails);
        });
    }

    // On click of "Cancel Editing" button in Project Review section
    private onClickCancelChangesProjectReview() {
        this.ResetModifiedRows(undefined);
        this.setState({
            EditMode: false
        });
    }

    //#endregion

    //#region  "DELETE REVIEW DETAILS"

    // On click of "DELETE" button in Project Review section
    private onClickDeleteProjectReview(uniqueNumber: Guid) {
        const projectReviewRows = this.state.ProjectReviewRows.filter(item => item.UniqueNumber !== uniqueNumber);
        this.ResetModifiedRows(projectReviewRows);
        this.setState({
            ProjectReviewRows: projectReviewRows,
        }, () => {
            let reviewDetails = this.state.ReviewDetails;
            reviewDetails.SectionADetails.ProjectReviews = projectReviewRows;
            this.props.onFormFieldValueChange(reviewDetails);
        });
    }
    //#endregion


    public render(): React.ReactElement<ISectionAProps> {
        const stackVerticalTokens: IStackTokens = { childrenGap: 10 };
        const stackHorizontalTokens: IStackTokens = { childrenGap: 20 };

        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>A. Summary of Projects for the Year</span>
                        </div>
                    </div>
                    <div className={styles.sectionNotes}>
                        <p>
                            List significant projects you have worked on in the past year (in excess of 80 billable hours). You should include a short project description. The name of your manager on the project should be listed under Reviewer Name. If you received a project review, indicate the rating in the Reviewer Evaluation field, otherwise show n/a.
                        </p>
                    </div>
                    <div className={styles.sectionContent}>
                        {(this.state.EditMode == false && this.props.DisableSection == false) &&
                            <div className={styles.addProjectReview}>
                                <div className={styles.row}>
                                    <div className={styles.col100}>
                                        <label className={styles.boldlabel}>Add Project Details:</label>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.col75left}>
                                        <table>
                                            <tr>
                                                <td className={styles.column1}>
                                                    <TextField
                                                        placeholder="Project Name"
                                                        value={this.state.NewProjectReviewDetails.ProjectName}
                                                        onChange={this.onChangeAddProjectName}
                                                        autoComplete="off"
                                                    ></TextField>
                                                </td>
                                                <td rowSpan={2} className={styles.column2}>
                                                    <TextField
                                                        placeholder="Project Description"
                                                        value={this.state.NewProjectReviewDetails.ProjectDescription}
                                                        onChange={this.onChangeAddProjectDescription}
                                                        multiline={true}
                                                        rows={3}
                                                    ></TextField>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Stack horizontal={false} tokens={stackVerticalTokens}>
                                                        <PeoplePicker
                                                            placeholder="Reviewer Name (if applicable)"
                                                            context={this.props.AppContext}
                                                            personSelectionLimit={1}
                                                            groupName={""} // Leave this blank in case you want to filter from all users    
                                                            showtooltip={true}
                                                            ensureUser={true}
                                                            onChange={this.onChangeAddReviewerName}
                                                            showHiddenInUI={false}
                                                            principalTypes={[PrincipalType.User]}
                                                            peoplePickerCntrlclassName={styles.whiteBackground}
                                                            defaultSelectedUsers={[this.state.NewProjectReviewDetails.ReviewerEmail]}
                                                            resolveDelay={1000} />

                                                        <TextField
                                                            placeholder="Reviewer Evaluation (if applicable)"
                                                            value={this.state.NewProjectReviewDetails.ReviewerEvaluation}
                                                            onChange={this.onChangeAddReviewerEvaluation}
                                                            autoComplete="off"
                                                        ></TextField>
                                                    </Stack>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className={styles.col25left}>
                                        <Stack horizontal={true} tokens={stackHorizontalTokens}>
                                            <PrimaryButton
                                                text="Add"
                                                onClick={this.onClickAddProjectReview}
                                                disabled={
                                                    (
                                                        this.state.NewProjectReviewDetails.ProjectName == null ||
                                                        this.state.NewProjectReviewDetails.ProjectName == "" ||
                                                        this.state.NewProjectReviewDetails.ProjectDescription == null ||
                                                        this.state.NewProjectReviewDetails.ProjectDescription == ""
                                                    ) ? true : false
                                                }
                                            />
                                            {this.state.ProjectReviewRows.length > 0 &&
                                                <PrimaryButton
                                                    text="Edit Project Details"
                                                    onClick={() => {
                                                        this.setState({
                                                            EditMode: true
                                                        });
                                                    }}
                                                />
                                            }
                                        </Stack>
                                    </div>
                                </div>
                            </div>
                        }

                        {this.state.EditMode == true &&
                            <div className={styles.addProjectReview}>
                                <div className={styles.row}>
                                    <div className={styles.col50left}></div>
                                    <div className={styles.col50right}>
                                        <PrimaryButton
                                            text="Save Changes"
                                            onClick={this.onClickSaveChangesProjectReview.bind(this)}
                                        />
                                        &nbsp;
                                        <DefaultButton
                                            text="Cancel Editing"
                                            onClick={this.onClickCancelChangesProjectReview}
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        <table className={styles.projectReviewsTable}>
                            <thead>
                                <tr>
                                    <th className={styles.colProjectname}>
                                        <Label className={styles.boldlabel} >Project Name</Label>
                                    </th>
                                    <th className={styles.colProjectDescription}>
                                        <Label className={styles.boldlabel} >Project Description</Label>
                                    </th>
                                    <th className={styles.colReviewer}>
                                        <Label className={styles.boldlabel}>Reviewer Name</Label>
                                    </th>
                                    <th className={styles.colReviewerEvaluation}>
                                        <Label className={styles.boldlabel}>Reviewer Evaluation</Label>
                                    </th>
                                    {(this.state.EditMode == false && this.props.DisableSection == false) &&
                                        <th className={styles.colOperations}>
                                        </th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    //Case: When there is no data
                                    this.state.ProjectReviewRows.length == 0 &&
                                    <tr>
                                        <td className={styles.colProjectname}>
                                            &nbsp;
                                        </td>
                                        <td className={styles.colProjectDescription}>
                                            &nbsp;
                                        </td>
                                        <td className={styles.colReviewer}>
                                            &nbsp;
                                        </td>
                                        <td className={styles.colReviewerEvaluation}>
                                            &nbsp;
                                        </td>
                                        {(this.state.EditMode == false && this.props.DisableSection == false) &&
                                            <td className={styles.colOperations}>
                                                &nbsp;
                                            </td>
                                        }
                                    </tr>
                                }

                                {/* READ ONLY MODE */}
                                {this.state.EditMode == false &&
                                    <React.Fragment>
                                        {this.state.ProjectReviewRows.map((element, index) => {
                                            const deleteIcon: IIconProps = { iconName: 'Delete' };
                                            return <tr key={element.UniqueNumber.toString()}>
                                                <td className={styles.colProjectname}>
                                                    <Label className={styles.normalLabel}>{element.ProjectName}</Label>
                                                </td>
                                                <td className={styles.colProjectDescription}>
                                                    <Label className={styles.normalLabel}>{element.ProjectDescription}</Label>
                                                </td>
                                                <td className={styles.colReviewer}>
                                                    <Label className={styles.normalLabel}>{element.ReviewerName}</Label>
                                                </td>
                                                <td className={styles.colReviewerEvaluation}>
                                                    <Label className={styles.normalLabel}>{element.ReviewerEvaluation}</Label>
                                                </td>
                                                {this.props.DisableSection == false &&
                                                    <td className={styles.colOperations}>
                                                        <IconButton iconProps={deleteIcon} title="Delete" ariaLabel="Delete" onClick={this.onClickDeleteProjectReview.bind(this, element.UniqueNumber)} />
                                                    </td>
                                                }
                                            </tr>;
                                        })
                                        }
                                    </React.Fragment>
                                }


                                {/* EDIT MODE */}
                                {this.state.EditMode == true &&
                                    <React.Fragment>
                                        {this.state.ProjectReviewRows.map((editRow, index) => {
                                            return <tr key={index}>
                                                <td className={styles.colProjectname}>
                                                    <TextField
                                                        defaultValue={editRow.ProjectName}
                                                        onChange={(event, newValue) => {
                                                            this.onChangeEditProjectName(index, newValue);
                                                        }}
                                                    ></TextField>

                                                </td>
                                                <td className={styles.colProjectDescription}>
                                                    <TextField
                                                        defaultValue={editRow.ProjectDescription}
                                                        onChange={(event, newValue) => {
                                                            this.onChangeEditProjectDescription(index, newValue);
                                                        }}
                                                        multiline={true}
                                                    ></TextField>

                                                </td>
                                                <td className={styles.colReviewer}>
                                                    <PeoplePicker
                                                        placeholder="Reviewer Name (if applicable)"
                                                        context={this.props.AppContext}
                                                        personSelectionLimit={1}
                                                        groupName={""} // Leave this blank in case you want to filter from all users    
                                                        showtooltip={true}
                                                        ensureUser={true}
                                                        onChange={(items) => {
                                                            this.onChangeEditReviewerName(index, items);
                                                        }}
                                                        showHiddenInUI={false}
                                                        principalTypes={[PrincipalType.User]}
                                                        peoplePickerCntrlclassName={styles.whiteBackground}
                                                        defaultSelectedUsers={[editRow.ReviewerEmail]}
                                                        resolveDelay={1000} />
                                                </td>
                                                <td className={styles.colReviewerEvaluation}>
                                                    <TextField
                                                        placeholder="Reviewer Evaluation (if applicable)"
                                                        defaultValue={editRow.ReviewerEvaluation}
                                                        onChange={(event, newValue) => {
                                                            this.onChangeEditReviewerEvaluation(index, newValue);
                                                        }}
                                                    ></TextField>
                                                </td>
                                            </tr>;
                                        })
                                        }
                                    </React.Fragment>
                                }
                            </tbody>
                        </table>
                    </div>

                </div>
        );
    }
}