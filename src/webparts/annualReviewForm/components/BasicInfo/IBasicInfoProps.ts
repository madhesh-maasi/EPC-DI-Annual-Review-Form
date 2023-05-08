import { IDropdownOption } from "@fluentui/react";
import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface IBasicInfoProps extends IBaseInterface {
    ReviewDetails : DI_ReviewDetails;
    ReviewItemID: number;
    ReviewStatus: string;
    IsCreateMode: boolean;
    SBUOptions: IDropdownOption[];
    onFormFieldValueChange: (DI_ReviewDetails) => any;   
}
