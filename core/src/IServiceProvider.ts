import { Type } from "./Reflection/Type";

export interface IServiceProvider {
    GetService(serviceType: Type): any;
}