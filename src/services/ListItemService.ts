import { ContextService } from "./ContextService";
import { sp } from "@pnp/sp";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/content-types";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Enums } from "../globals/Enums";
import MapResult from "../domain/mappers/MapResult";
import ServiceHelper from "./ServiceHelper";
import { Config } from "../globals/Config";
import { PermissionKind } from "@pnp/sp/security";


// This class will hold the function which will interact with the SharePoint List
export default class ListItemService extends ContextService {

    protected listTitle: string;

    constructor(appContext: WebPartContext, listTitle: string) {
        super(appContext);
        this.listTitle = listTitle;
    }

    //#region "Common Methods"

    // Getting items based on provided criteria
    public async getItemsUsingCAML(selectFields: string[],orderByXML : string, camlFilterConditions: string | undefined, rowLimit: number | undefined, resultType: Enums.ItemResultType): Promise<any> {
        let viewXML = ServiceHelper.generateCAMLQueryXML(selectFields, orderByXML, camlFilterConditions, rowLimit);
        const list = await sp.web.lists.getByTitle(this.listTitle);
        let items = await list.renderListDataAsStream({
            ViewXml: viewXML
        });
        if (items.Row != null && items.Row.length > 0) {
            return await MapResult.map(items.Row, Enums.MapperType.CAMLResult, resultType);
        }
        return null;
    }

    // Getting details of provided list item id only
    public async getItemUsingCAML(listItemID: number, selectFields: string[], orderByXML : string, resultType: Enums.ItemResultType): Promise<any> {
        const camlFilterConditions = "<Where><Eq><FieldRef Name='ID'/><Value Type='Number'>" + listItemID + "</Value></Eq></Where>";
        const allResultItems: any = await this.getItemsUsingCAML(selectFields, orderByXML, camlFilterConditions, 1, resultType);
        if (allResultItems) {
            return allResultItems[0];
        }
    }

    // Updating the list item with provided id
    public async updateItem(itemId: number, item: any): Promise<IItemUpdateResult> {
        const list = await sp.web.lists.getByTitle(this.listTitle);
        const result: IItemUpdateResult = await list.items.getById(itemId).update(item);
        return result;
    }

    // Creating the list item with provided details
    public async createItem(item: any): Promise<IItemAddResult> {
        const list = await sp.web.lists.getByTitle(this.listTitle);
        const result: IItemAddResult = await list.items.add(item);
        return result;
    }

     // Checking whether user has edit permission or not for the list item
    public async CheckCurrentUserCanEditItem(listItemID: number) : Promise<boolean> {
        let canEdit: boolean = await sp.web.lists.getByTitle(this.listTitle).items.getById(listItemID).currentUserHasPermissions(PermissionKind.EditListItems);
        return canEdit;
    }

    //#endregion

    //#region "Solution Specific Methods"

    public async getReviewStatus(listItemID: number): Promise<any> {
        const camlFilterConditions = "<Where><Eq><FieldRef Name='ID'/><Value Type='Number'>" + listItemID + "</Value></Eq></Where>";
        const allResultItems: any = await this.getItemsUsingCAML([Config.ReviewsColumns.Status], undefined, camlFilterConditions, 1, Enums.ItemResultType.DI_ReviewStatus);
        if (allResultItems) {
            return allResultItems[0];
        }
    }

    // Getting master values for the provided category
    public async getDICategoryValues(category: string): Promise<string[]>{
        const camlFilterCondition = "<Where><Eq><FieldRef Name='Category' /><Value Type='Choice'>" + category+ "</Value></Eq></Where>";
        const orderByXML = "<OrderBy><FieldRef Name='Title' Ascending='TRUE'/></OrderBy>";
        const allResultItems: string[] = await this.getItemsUsingCAML([Config.BaseColumns.Title], orderByXML, camlFilterCondition, undefined, Enums.ItemResultType.DI_Categories);
        return allResultItems;
    }
    //#endregion

}