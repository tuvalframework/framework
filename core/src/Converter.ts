export interface Converter<TInput, TOutput> {
    (input: TInput): TOutput;
}