export class Pet {
    id: number = 0;
    userid: number = 0;
    imagename: string;
    gender: string;
    petType: number;
    dob: string;
    beed: string;
    desexed: string;
    name: string;
    weight: string;
    habbits: [string] = [null];
    dangerous: Boolean = false;
    care_routine:any;
    //Identity Data;
    microchip: string;
    rspcaTag: Boolean;
    petRego: Boolean;
    councilTag: Boolean | number;
    petCouncil: string;
    personalTag: Boolean | number;



    //Routines & Habits Data;
    children_stay: string;
    friendlyPet: Boolean;
    lovesMen: Boolean;
    lovesWomen: Boolean;
    petSpendHome: string;
    petSpendOut: string;
    petSleepNight: string;
    petAloneHour: string;
    petReact: string;
    petWalk: string;
    petBehave: string;
    additionalCare: string;

    // Pet Health;
    pet_fleas: string;
    healthIssue: string;
    onMedications: Boolean;
    medicationInstruction: string;
    usualVet: string;
    emergencyContact: string;
    emergencyCharge: string;

    references?: any;
    parasite_controlled?: any;
    vaccinations_up_to_date?: any;
    obediance_trained?: any;
    toilet_trained?: any;
    pet_rego?: any;
    pet_insured?: any;
    about_breed?: any;
    emergency_charge?: any;
    emergency_contacts?: any;
    vaccination_alert?: any;
    last_vaccine_date?: any;
    booster_vaccine_uptodate?: any;
    core_vaccine_complete?: any;
    petalone_hour?: any;
    pet_react?: any;
    love_women?: any;
    love_men?: any;
    pet_behave?: any;
    pet_council?: any;
    rspcaTAG?: any
}
