import { User } from './user';

export class Listing {
    id: number;
    name: string;
    title: string;
    active: number;
    approved: number;
    userId: number;
    last_minute: any;
    emergency_car: any;
    cancellation_policy: any;
    abn: string;
    progress: [string] = [null];
    progressCount: number;
    sits_dogs: number = 0;
    sits_cats: number = 0;
    sits_horses: number = 0;
    sits_misc: number = 0;
    created: string;
    sendMeJobs: number;
    sentTestimonial: number;
    availiableWeekend: number;
    minPrice: string;
    occupation: string;
    lat: string;
    lng: string;

    user: User;
}
