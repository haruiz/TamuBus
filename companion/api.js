import Constants from "../common/constants.js"; 

export class BusesAPI{
   get_routes(route){
     let API_URI = Constants["TAMU_API_URI"]
     API_URI =  `${API_URI}/${route}/TimeTable`
     return new Promise((resolve, reject)=>{
      fetch(API_URI)
        .then(result=>{
             return result.json();
        })
       .then(json=>{
          resolve(json);
        })
        .catch(error=>{
            reject(error);
        })   
     });
    }
 }

