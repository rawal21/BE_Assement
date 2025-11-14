interface IRespone {
    success : boolean ;
    message ? : string;
    data : object | null | any 
}


export type errorResponse = IRespone & {
    error_code : number
}

export const createResponse = (
    data : IRespone['data'],
    message?  : string ,
) :IRespone=>{
return {data , message , success : true}
}