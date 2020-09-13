export interface IFUserEntity {
    user: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        countryCode: string,
        cusPhone?: string 
        unique_key: string,
        userRole: string
    };
    userEntities: {
        userEntity: string,
        level: string,
        levelId: any
    };
}
