import { settingsStorage } from "settings";

export function getDefaultRoute(){
let route_name = settingsStorage.getItem("route");
  if (route_name) {
    try {
      route_name = JSON.parse(route_name);
      route_name = route_name.name;
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  return route_name;
}

export function getShowAllRoutes(){
  let show_all_routes = settingsStorage.getItem("show_expired_times");
  return (show_all_routes == 'true');
}