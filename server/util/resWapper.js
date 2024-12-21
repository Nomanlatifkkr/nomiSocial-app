const successful=(statuscode,result)=>{
    return {
        status:"ok",
        statuscode,
        result
    }
}
const error=(statuscode,error)=>{
    return {
        status:"error",
        statuscode,
        error
    }
}
module.exports={
    error,
    successful
}
