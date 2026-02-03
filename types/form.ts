export type Fields = {
    id?:string;
    name?:string;
    label?:string;
    placeholder?:string;
    type?:string;
    options?:string[];
    required?:boolean;
}
export type Content = { 
    formTitle:string;
    formDescription?:string;
    formFields:Fields[]
}
export type Form = {
    id:number;
    uuid:string;
    ownerId:string;
    published:boolean;
    content:Content;
    description?:string;
    submissions:number;
    shareUrl:string;
}