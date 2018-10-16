

class IdMap {

    constructor(){
        this._idcount = 0;
        this._map = new Map();
    }

    insert(item){
        this._map.set(this._idcount, item);
        this._idcount++;
        return this._idcount-1;
    }

    get(id){
        return this._map.get(id);
    }

    remove(id){
        var r = this._map.get(id);
        this._map.delete(id);
        return r;
    }

    nextId(){
        return this._idcount;
    }


    getValues(){
    	return Array.from( this._map.values() );
    }

    size(){
        return this._map.size;
    }

    has(id){
    	return this._map.has(id);
    }
}

function compareSets(a,b){
	if(a.size!==b.size){
		return false;
	}

	ar = Array.from(a);

	for(var i=0;i<ar.length;i++){
		if(b.has(ar[i])===false){
			return false;
		}
	}

	return true;
} 

// propertyNames: array of properties
function equalObjects(a, b, propertyNames){

	if(propertyNames.length===0){
		if(a===b){
			return true;
		} else{
			return false;
		}
	}
	

	for(let i=0;i<propertyNames.length;i++){
		let propertyName = propertyNames[i];

		if( (propertyName in a)=== false ){
			return false;
		}

		if( (propertyName in b)=== false ){
			return false;
		}

		if( a[propertyName] !== b[propertyName] ){
			return false;
		}

	}

	return true;
}

function equalArrays(a, b, properties) {
  //if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if ( equalObjects(a[i],b[i], properties )===false ) {
    	return false;
    }
  }
  return true;
}



function testEqualArrays(a,b){
	a = [1,2,3]
	b = [1,2,3]
	console.log("Equal arrays : ", equalArrays(a,b));
}


function testEqualObjects(){
	let a = {hola:6, felipe:"jijo"};
	let b = {hola:6, felipe:"jijo"};
	let c = ["hola","felipe"];
	console.log(equalObjects(a,b,c));

	a = {hola:6, felipe:"jijo"};
	b = {hola:6, felipe:"jijos"};
	c = ["hola","felipe"];
	console.log(equalObjects(a,b,c));

	a = {hola:6, felipe:"jijo"};
	b = {felipe:"jijo", hola:6 };
	c = ["hola","felipe"];
	console.log(equalObjects(a,b,c));

	a = {hola:6, felipe:"jijo"};
	b = {felipe:"jijo", hola:6, james:"jimbo" };
	c = ["hola","felipe","jimbo"];
	console.log(equalObjects(a,b,c));

	a = {hola:6, felipe:"jijo"};
	b = {felipe:"jijo", hola:6, james:"jimbo" };
	c = ["hola","felipe","jimbos"];
	console.log(equalObjects(a,b,c));

}



exports.IdMap = IdMap;
exports.compareSets = compareSets;
exports.equalObjects = equalObjects;
exports.equalArrays = equalArrays;



