
import { SystemException } from "../Exceptions/SystemException";

const NAME: string = 'KeyNotFoundException ';


export class KeyNotFoundException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}