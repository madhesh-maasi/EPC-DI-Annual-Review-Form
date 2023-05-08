import * as React from 'react';
import { IRatingsDropdownProps } from './IRatingsDropdownProps';
import { IRatingsDropdownState } from './IRatingsDropdownState';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, Stack } from '@fluentui/react';

export default class RatingsDropdown extends React.Component<IRatingsDropdownProps, IRatingsDropdownState>
{
    constructor(props: any) {
        super(props);
        this.state = {
            AppContext: props.AppContext,
            IsLoading: false,
            SelectedRatingKey: props.Value
        };
    }

    public render(): React.ReactElement<IRatingsDropdownProps> {

        const dropdownStyles: Partial<IDropdownStyles> = {
            //dropdown: { width: 100 },
        };

        const options: IDropdownOption[] = [
            { key: '', text: '' },
            { key: '5', text: '5' },
            { key: '4.5', text: '4.5' },
            { key: '4', text: '4' },
            { key: '3.5', text: '3.5' },
            { key: '3', text: '3' },
            { key: '2.5', text: '2.5' },
            { key: '2', text: '2' },
            { key: '1.5', text: '1.5' },
            { key: '1', text: '1' }
        ];

        return (
            this.props.IsLoading == true ? <React.Fragment ></React.Fragment> :
                <React.Fragment>
                    <Dropdown
                        placeholder="Select Rating"
                        options={options}
                        styles={dropdownStyles}
                        disabled={this.props.Disabled}
                        selectedKey={this.state.SelectedRatingKey}
                        onChange={(e, selectedOption) => {
                            this.setState({
                                SelectedRatingKey: selectedOption.key.toString()
                            });
                            this.props.onRatingsValueChange(selectedOption.key.toString());
                        }}
                    />
                </React.Fragment>
        );
    }
}