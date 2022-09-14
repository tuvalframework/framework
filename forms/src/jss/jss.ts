import { create } from 'jss';
import jssPreset from './jssPreset';


export const jss = create(jssPreset());

const createGenerateId = () => {
    let counter = 0
    return (rule, sheet) => `pizza--${rule.key}-${counter++}`
}
jss.setup({
    createGenerateId: createGenerateId
})