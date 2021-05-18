const JSDN = {
  parse: function(str){
    let json;
    let map;
    if(str.indexOf("[") === -1 || str.indexOf("{") < str.indexOf("[")){
      let arr = str.split("{");
      let pos = parseInt(arr.shift());
      json = JSON.parse("{" + arr.join("{").substr(0, pos - 1));
      map = JSON.parse("{" + arr.join("{").substr(pos));
    } else if(str.indexOf("{") === -1 || str.indexOf("[") < str.indexOf("{")){
      let arr = str.split("[");
      let pos = parseInt(arr.shift());
      json = JSON.parse("[" + arr.join("[").substr(0, pos - 1));
      map = JSON.parse("[" + arr.join("[").substr(pos));
    } else {
      throw new Error("Not a valid JSDN string");
    }
    for(let key in map){
      eval("json" + key + "=json" + map[key]);
    }
    return json;
  },
  stringify: function(obj){
    if(typeof window !== "undefined"){
      obj = JSDN.structuredClone(obj);
    }
    let storage = {"": obj};
    let map = {};
    const dig = function(location){
      let object = eval("obj" + location);
      for(let key in object){
        if(object[key] instanceof Object && Object.values(storage).indexOf(object[key]) !== -1){
          map[location + "[\"" + key + "\"]"] = Object.keys(storage)[Object.values(storage).indexOf(object[key])];
          delete object[key];
        } else if(object[key] instanceof Object) {
          storage[location + "[\"" + key + "\"]"] = object[key];
          dig(location + "[\"" + key + "\"]");
        }
      }
    }
    dig("");
    let returnVal = JSON.stringify(obj).length.toString() + JSON.stringify(obj) + JSON.stringify(map);
    return returnVal;
  },
  structuredClone: function(obj){
    if(typeof window !== "undefined"){
      const n = new Notification('', {data: obj, silent: true});
      n.onshow = n.close.bind(n);
      return n.data;
    }
  }
}
