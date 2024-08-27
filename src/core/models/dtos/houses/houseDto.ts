interface Residential {
  id: string;
  name: string;
  description: string;
  homes?: string[];
}

interface Address {
  id: string;
  customerId: string;
  street: string;
  streetDetail: string;
  number: string;
  zip: string;
  reference: string;
  isPrincipal: boolean;
  enabled: boolean;
  isDeleted: boolean;
  createdDate: string;
  changedDate: string;
}

interface User {
  id: string;
  profileId: string;
  profileName: string;
  homes: string[];
  name: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  enabled: boolean;
  isDeleted: boolean;
  createdDate: string;
  changedDate: string;
  deletedDate: string;
}

export interface HouseDto {
  id: string;
  residentialId: string;
  residential?: Residential;
  address: Address;
  name: string;
  zip: string;
  personContact: string;
  phoneContact: string;
  enabled: boolean;
  isDeleted: boolean;
  createdDate: string;
  changedDate: string;
  deletedDate: string;
  users?: User[];
}
