import { IEnumerator } from './IEnumerator';

export interface IEnumerable<T> {
  GetEnumerator(): IEnumerator<T>;
  IsEndless?: boolean;
}
