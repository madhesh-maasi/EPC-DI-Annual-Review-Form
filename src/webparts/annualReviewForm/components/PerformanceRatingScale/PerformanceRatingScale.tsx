import * as React from 'react';
import styles from '../AnnualReviewForm.module.scss';
import { IPerformanceRatingScaleProps } from './IPerformanceRatingScaleProps';
import { IPerformanceRatingScaleState } from './IPerformanceRatingScaleState';
import { Label } from '@fluentui/react';

export default class PerformanceRatingScale extends React.Component<IPerformanceRatingScaleProps, IPerformanceRatingScaleState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false
        };
    }

    public render(): React.ReactElement<IPerformanceRatingScaleProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.colHeader100}>
                            <span className={styles.subTitle}>Competency Attribute Rating Scale (Apply same scale for all attributes)</span>
                        </div>
                    </div>
                    <div className={styles.sectionContent}>
                        <table className={styles.ratingtable}>
                            <tbody>
                                <tr>
                                    <td className={styles.colsrno}>5</td>
                                    <td className={styles.colDescription}>Exceptional</td>
                                    <td className={styles.colDetailedDescription}>Consistently demonstrates this attribute all the time, in all situations, is sought out by clients and/or colleagues for counsel and assistance; widely recognized as a role model and teaches others.</td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>4</td>
                                    <td className={styles.colDescription}>Exceeds Expectation</td>
                                    <td className={styles.colDetailedDescription}>Consistently demonstrates this attribute all the time, in all situations, and is sought out by clients and/or colleagues for assistance.</td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>3</td>
                                    <td className={styles.colDescription}>Performs Well</td>
                                    <td className={styles.colDetailedDescription}>Consistently demonstrates this attribute all the time, in most situations.</td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>2</td>
                                    <td className={styles.colDescription}>Needs Improvement</td>
                                    <td className={styles.colDetailedDescription}>Inconsistently demonstrates this attribute.</td>
                                </tr>
                                <tr>
                                    <td className={styles.colsrno}>1</td>
                                    <td className={styles.colDescription}>Unsatisfactory</td>
                                    <td className={styles.colDetailedDescription}>Seldomly demonstrates this attribute.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

        );
    }
}