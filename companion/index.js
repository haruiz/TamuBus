import { me } from "companion";
import * as messaging from "messaging";
import {BusesAPI} from "./api.js"
import {parseTime} from "../common/util.js"
import {getDefaultRoute, getShowAllRoutes} from "./misc.js";
import { settingsStorage } from "settings";


function getRoutePath(route){
  var path =[]
  Object.keys(route)
    .map((k)=>{
        route[k]= parseTime(route[k].toLowerCase());
        return k;
     })
    .sort((a, b)=> route[a] - route[b])
    .forEach((k,v)=>{
        path.push([k.substring(36), route[k].toLocaleTimeString(), route[k]]);
    });
  return path;
}

function getTime(){
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();
}


function schedule_request(){
  
  if(!me.permissions.granted("access_internet")) {
    messaging.peerSocket.send({
      "status": "error",
      "message": "We're not allowed to access the internet!"
    })
    return;
  } 
  try{
      var api = new BusesAPI();
      var routeName = getDefaultRoute();
      api.get_routes(routeName).then(departures => {
        let status = messaging.peerSocket.readyState
        if (status === messaging.peerSocket.OPEN) {         
          if(departures && departures.length > 1){
            departures = departures.map(getRoutePath);
            
            
            let show_all_routes = getShowAllRoutes();
            //console.log(show_all_routes);
            //only consider the routes after the current time
            if(!show_all_routes){
                  
                  // determine what is te next route
                  var min_diff = Infinity
                  var min_index = 0
                  var now =  Date.now(); 
                  for(var i in departures){
                      let route = departures[i];
                      for(var j in route){
                        let path = route[j];
                        let time = Date.parse(path[2]);
                        var diff = Math.abs(now - time);
                        if(diff < min_diff){
                          min_diff = diff;
                          min_index = i;
                        }
                        else{
                          break;
                        }
                      }
                  }           
            
              departures = departures.slice(min_index, departures.length);
            }
            
            for(var i in departures){
                let route = departures[i];
                messaging.peerSocket.send({
                  "status": "ok",
                  "message": route,
                  "idx": i
                });
            }
          }
          else{
            messaging.peerSocket.send({
              "status": "error",
              "message": "Invalid route name or not setup yet"
            })
          }
        }
      }).catch(e => {
            messaging.peerSocket.send({
              "status": "error",
              "message": "Error fetching the data"
            })
      });
  }
  catch(ex){
    messaging.peerSocket.send({
      "status": "error","message": `Internal error ${ex}`
    })
  }
}

settingsStorage.onchange = (evt)=> {
  messaging.peerSocket.send({
      "status": "error",
      "message": "The settings has changed restart the app"
    });
}//schedule_request();
// Listen for the onopen event
messaging.peerSocket.onopen = ()=> schedule_request();
// Listen for the onmessage event
messaging.peerSocket.onmessage = (evt)=> { console.log(JSON.stringify(evt.data)) };
