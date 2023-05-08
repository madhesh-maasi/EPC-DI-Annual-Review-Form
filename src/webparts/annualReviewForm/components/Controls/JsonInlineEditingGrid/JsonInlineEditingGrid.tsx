import * as React from 'react';
import styles from '../../AnnualReviewForm.module.scss';
import * as OfficeUI from '@fluentui/react';
import { IJsonInlineEditingGridProps } from './IJsonInlineEditingGridProps';
import { IJsonInlineEditingGridState } from './IJsonInlineEditingGridState';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, Stack } from '@fluentui/react';

export default class JsonInlineEditingGrid extends React.Component<IJsonInlineEditingGridProps, IJsonInlineEditingGridState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            value: this.props.value
        };
    }

    public render(): React.ReactElement<IJsonInlineEditingGridProps> {
        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <React.Fragment>
                </React.Fragment>
        );
    }
}