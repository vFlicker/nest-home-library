import { ValidateIf } from 'class-validator';

export const IsNotNull = () => ValidateIf((_, value) => value !== null);
