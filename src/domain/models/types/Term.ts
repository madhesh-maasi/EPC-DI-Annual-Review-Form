import { ITerm } from "../interfaces/types/ITerm";

export class Term implements ITerm{
    public Description?: string;
    public Key: string;
    public Label: string;
    public Path?: string;
    public TermSetName?: string;
    public WssID?: number;

    // New Members
    public children : Term[];
}