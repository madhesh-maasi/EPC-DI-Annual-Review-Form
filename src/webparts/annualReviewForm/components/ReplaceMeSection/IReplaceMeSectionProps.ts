import { DI_ReviewDetails } from "../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";

export interface IReplaceMeSectionProps extends IBaseInterface {
    ReviewDetails: DI_ReviewDetails;
    onFormFieldValueChange: (DI_ReviewDetails) => any;
    onReplaceMeClick: () => any;
}
