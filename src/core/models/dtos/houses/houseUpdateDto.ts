export interface HouseUpdateDto {
    id: string
    residentialId: string;
    name: string;
    address: {
      id: string
      street: string;
      streetDetail: string;
      number: string;
      zip: string;
      isPrincipal: boolean;
      reference: string;
      enabled: boolean;
    };
    zip: string;
    personContact: string;
    phoneContact: string;
    enabled: boolean;
}