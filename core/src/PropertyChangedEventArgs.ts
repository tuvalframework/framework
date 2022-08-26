export class PropertyChangedEventArgs {
    public PropertyName: string;
    constructor(propertyName: string) {
        this.PropertyName = propertyName;
    }
}