export class ServiceType {
    id: number;
    serviceChargeType: number;
    multipleDays: number;
    backgroundCheckReq: Boolean;
    userId: number;
    displayOrder: number;
    image: string;
    enabled: Boolean;
    isPrimaryService: Boolean;
    allow_reoccurring: number;
    avgPrice: string //"{\"1\":32,\"2\":26,\"3\":37,\"4\":25,\"price\":20}",;
    serviceName: string;
    requirements: string;
    perPet: number;
    label?: any;
}
