export interface ShunnPluginSettings {
    title: string;
    author: string;
    font: string;
    showAddress: boolean;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
    email: string;
    underlineItalics: boolean;
    abbreviateTitle: boolean;
    headerAbbreviation: string;
    anonymous: boolean;
  }
  
  export const DEFAULT_SETTINGS: ShunnPluginSettings = {
    title: "",
    author: "",
    font: "Courier New",
    showAddress: false,
    addressLine1: "123 Fictional Lane",
    addressLine2: "London, UK",
    phoneNumber: "07309477721",
    email: "email@example.com",
    underlineItalics: false,
    abbreviateTitle: false,
    headerAbbreviation: "",
    anonymous: false,
  };
  