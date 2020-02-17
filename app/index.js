/*
 * Entry point for the watch app
 */
import * as messaging from "messaging";
import document from "document";

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

// Listen for the onopen event
messaging.peerSocket.onopen = ()=>{
  messaging.peerSocket.send("Hi!");
}

function setErrorMessage(message){
  const mixedtext = document.getElementById("txt_status");
  let body = mixedtext.getElementById("copy");
  body.text = message;
}

function showErrorMessage(show){
  const mixedtext = document.getElementById("txt_status");
  const container = document.getElementById("container");
  mixedtext.style.display = show ? "inline" : "none";
  container.style.display = show ? "none" : "inline";
}

function showPanoramaViews(show){
  const panorama_items = document.getElementsByClassName("panorama_item");
   panorama_items.forEach(function(element) {
    element.style.visibility = show ? "visible" : "hidden";
  });                           
}

function showPanoramaView(show, index){
  const panorama_view = document.getElementById(`item${index}`);
  panorama_view.style.visibility = show ? "visible" : "hidden";
  
}


// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {  
  var status = evt.data["status"];
  showErrorMessage(false);  
  if(status === "ok"){
     let index_view = evt.data["idx"];
     let list_view = document.getElementById(`list${index_view}`);
     let data = evt.data["message"]
     let num_items = data.length;
     if(list_view){
        list_view.delegate = {
          getTileInfo: function(index) {            
           let icon= "stop.png"; 
            if(index == 0){
                icon= "start.png";
            }
            else if(index == num_items - 1){
                icon= "end.png";               
            }
            return {
                type: "my-pool",
                rname: data[index][0],
                rtime: data[index][1],
                index: index,
                icon: icon
              };            
           
          },
          configureTile: function(tile, info) {
            if (info.type == "my-pool") {
              tile.getElementById("txt_route_name").text = `${info.rname}`;
              tile.getElementById("txt_route_time").text = `${info.rtime}`;
              tile.getElementById("icon").image  = `${info.icon}`;
              let touch = tile.getElementById("touch-me");
              touch.onclick = evt => {
                console.log(`touched: ${info.index}`);
              };
            }
          }
        };
      list_view.length = num_items;
    }    
  }
  else{
    showErrorMessage(true); 
    setErrorMessage(evt.data["message"]);
  }
  
  
}





