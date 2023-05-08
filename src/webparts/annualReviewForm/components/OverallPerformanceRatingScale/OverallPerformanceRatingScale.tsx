import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { IOverallPerformanceRatingScaleProps } from './IOverallPerformanceRatingScaleProps';
import { IOverallPerformanceRatingScaleState } from './IOverallPerformanceRatingScaleState';

export default class OverallPerformanceRatingScale extends React.Component<IOverallPerformanceRatingScaleProps, IOverallPerformanceRatingScaleState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false
        };
    }

    public render(): React.ReactElement<IOverallPerformanceRatingScaleProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>Overall Performance Rating Scale</span>
                        </div>
                    </div>
                    <div className={styles.sectionContent}>
                        <table className={styles.ratingtable}>
                            <tbody>
                                <tr>
                                    <td className={styles.colsrno}>5</td>
                                    <td className={styles.colRatingName}>Exceptional</td>
                                    <td className={styles.colRatingDescription}>
                                        Consistently exceeds expectations; sought out by clients and/or colleagues for counsel and assistance; widely recognized as a role model and teaches others.  Reserved for truly outstanding performers.
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>4</td>
                                    <td className={styles.colRatingName}>Exceeds Expectation</td>
                                    <td className={styles.colRatingDescription}>
                                        Consistently meets and frequently exceeds expectations; demonstrates strong performance that adds value beyond the scope of the current role.
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>3</td>
                                    <td className={styles.colRatingName}>Performs Well</td>
                                    <td className={styles.colRatingDescription}>
                                        Consistently meets expectations; demonstrates capable performance and is dependable, competent, and knowledgeable; requires only modest performance adjustment to enhance contribution
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>2</td>
                                    <td className={styles.colRatingName}>Needs Improvement</td>
                                    <td className={styles.colRatingDescription}>
                                        Inconsistently meets expectations; improvement is needed in one or more significant aspects that are critical to the position.
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>1</td>
                                    <td className={styles.colRatingName}>Unsatisfactory</td>
                                    <td className={styles.colRatingDescription}>
                                        Seldomly meets expectations; significant improvement is needed in multiple job expectations.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

        );
    }
}