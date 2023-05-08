import { DI_ReviewDetails } from "../../../../../domain/models/DI_ReviewDetails";
import { IBaseInterface } from "../../../../../interfaces/IBaseInterface";

export interface IRatingsDropdownProps extends IBaseInterface {
    Value: string;
    Disabled: boolean;
    onRatingsValueChange: (string) => any;   
}
