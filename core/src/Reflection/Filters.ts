import { Type } from './Type';
import { InvalidFilterCriteriaException } from '../Exceptions';
import { as } from '../as';
import { is } from '../is';
import { System } from '../SystemTypes';

export /* internal */ class Filters {
  public /* virtual */ filterTypeName(cls: Type, filterCriteria: any): boolean {
    // Check that the criteria object is a String object
    if (filterCriteria == null || !is.typeof<string>(filterCriteria, System.Types.Primitives.String)) throw new InvalidFilterCriteriaException('Filter error.');

    let str: string = filterCriteria.toString();
    //str = str.Trim();

    // Check to see if this is a prefix or exact match requirement
    if (str.length > 0 && str[str.length - 1] === '*') {
      str = str.substring(0, str.length - 1);
      return cls.Name.startsWith(str) as any;
    }

    return cls.Name === str;
  }

  // FilterFieldNameIgnoreCase
  // This method filter the Type based upon name, it ignores case.
  public /* virtual */ filterTypeNameIgnoreCase(cls: Type, filterCriteria: any): boolean {
    // Check that the criteria object is a String object
    if (filterCriteria == null || !is.typeof(filterCriteria, System.Types.Primitives.String)) throw new InvalidFilterCriteriaException('filter error.');

    let str: string = as<string>(filterCriteria, System.Types.Primitives.String);
    //str = str.Trim();

    // Check to see if this is a prefix or exact match requirement
    if (str.length > 0 && str[str.length - 1] === '*') {
      str = str.substring(0, str.length - 1);
      const name: string = cls.Name;
      if (name.length >= str.length) return name === str;
      else return false;
    }
    return str === cls.Name;
  }
}
