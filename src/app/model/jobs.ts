export class Jobs {
    id: string;
    user_id: string;
    service_type_id: string;
    start_date: string = null;
    end_date: string = null;
    booking_days: any = null;
    occurrences: any = null;
    active: number;
    deleted: string = null;
    created: string = null;
    postedPrice: any = null;
    jobChargeTypes: number;
    description: string = null;
    recurring_type: any = null;
    applicants?: any;
    jobDetails?: any;
    booking_status?:any;
}
