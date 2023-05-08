export namespace Enums {

    export enum FieldTypes {
        TaxonomyMulti = "TaxonomyFieldTypeMulti",
        TaxonomySingle = "TaxonomyFieldType",
        PersonMulti = "UserMulti",
        PersonSingle = "User",
        Link = "URL",
        Lookup = "",
        LookupMulti = ""
    }

    export enum MapperType {
        PNPResult,
        PnPControlResult,
        CAMLResult,
        SearchResult,
        None
    }

    export enum ItemResultType{
        
        //Common Result Types
        None,
        User,
        UserProfile,
        Users,
        Document,
        Item,
        Task,

        //Solution Specific Result Types
        DI_ReviewStatus,
        DI_ReviewDetails,
        DI_Categories
    }

    export enum DataPayloadTypes{
        PnPCreateUpdate,
        PnPValidateUpdate
    }

    export enum ReviewStatusOptions{
        "Review Not Started",
        "Awaiting Reviewee",
        "Awaiting Reviewer",
        "Reviewer Completed",
        "Awaiting Acknowledgement",
        "Acknowledged"
    }

    export enum ButtonTypes {
        Save,
        Submit,
        Revert,
        ReplaceMe
    }

    export enum UserRoles {
        Reviewee,
        Reviewer,
        SuperAdmin
    }

    export enum SaveType {
        Submit,
        Save,
        Revert,
        StartReview,
        ReplaceMe
    }
}