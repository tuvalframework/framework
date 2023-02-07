import { ReactNode } from 'react';
import { ReactViewClass } from './ReactViewClass';

export function ReactView(node: ReactNode): ReactViewClass {
    return new ReactViewClass().reactNode(node);
}