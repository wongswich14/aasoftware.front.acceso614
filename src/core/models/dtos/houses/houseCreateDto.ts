export interface HouseCreateDto {
    residentialId: string;
    name: string;
    address: {
      street: string;
      streetDetail: string;
      number: string;
      zip: string;
      reference: string;
      isPrincipal: boolean;
      enabled: boolean;
    };
    zip: string;
    personContact: string;
    phoneContact: string;
    enabled: boolean;
  }