import { useParams } from "react-router-dom";

export const RouterHelpers = {
    router: (paramName: string) => {
       
        const params = useParams();
        alert(params)
        return params[paramName];
    }
}