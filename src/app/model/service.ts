import {ServiceType} from './service-type';

export class Service {
    userId: number;
    active: number;
    deleted: string;
    id: number;
    serviceTypeId: number;
    isPrimaryService: Boolean;
    pricingRules: any; // "{\"1\":\"20\",\"2\":\"20\",\"3\":\"\",\"4\":\"15\"}",;
    serviceType: ServiceType;
    minPrice: number;
    petPrice?: any;
}
