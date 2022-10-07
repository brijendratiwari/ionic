import {User} from './user';

export class ApiResponse {
    success: Boolean = false;
    data?: any;
    error: string;
    errorNo: number;
    user?: User;
    token?: string;
    notificationToken?: string;
    message?: string;
    emailPhoneRegisted:Boolean = false;
    emailExist:Boolean = false;
    login_first_date?: string;
    login_last_date?: string;

    // SearchListings returns this
    entries?: any;
    elementCount?: number;
}
