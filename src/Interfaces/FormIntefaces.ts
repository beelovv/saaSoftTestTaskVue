export interface Field {
  label?: {text: string}[];
  type: string;
  login: string;
  password: string;
}

export interface FormField {
  label: string;
  type: string;
  login: string;
  password: string;
  passwordVisible: boolean,
  rules: {
    label: Array<(value: string) => boolean | string>;
    type: Array<(value: string) => boolean | string>;
    login: Array<(value: string) => boolean | string>;
    password: Array<(value: string) => boolean | string>;
  };
  errors: {
    label: string[];
    type: string[];
    login: string[];
    password: string[];
  };
}