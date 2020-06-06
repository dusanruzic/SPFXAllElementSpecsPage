import { IListItem } from './../../../services/SharePoint/IListItem';

export interface IAllElementSpecsState {
    items: IListItem[];
    users: any[];
    loading: boolean;
    visible: boolean;
}