export function parseTime( t ) {
   var d = new Date();
   var time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
  //console.log(time); 
  d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
   d.setMinutes( parseInt( time[2]) || 0 );
   return d;
}

