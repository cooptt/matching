

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



class CircularQueue {
	constructor(size, cmp){
		this._ar = [];
		for(let i=0;i<size;i++){
			this._ar.push(0);
		}
		this._ini = 0;
		this._fin = 0;
		this.n = 0;
		this.cmp = cmp;
	}

	size(){
		return this.n;
	}


	get(vindex){
		return this._ar[this.real(vindex)];
	}

	inc(rindex){
		return (rindex+1)%this._ar.length;
	}

	dec(rindex){
		return (rindex-1+this._ar.length) % this._ar.length;
	}

	add(val){
		this._ar[this._fin] = val;
		this._fin = this.inc(this._fin);

		if(this.n<this._ar.length ){
			this.n++;
		}else{
			this._ini = this.inc(this._ini);
		}
	}

	real(ind){
		return (ind+this._ini)%this._ar.length;
	}

	getValues() {
		let ans = [];
		for(let i=0;i<this.n;i++){
			ans.push(this.get(i));
		}
		return ans;
	}

	delete(value){
		let vindex = -1;
		for(let i=0;i<this.n;i++){
			let item = this.get(i);
			if(this.cmp(value,item)){
				vindex = i;
				break;
			}
		}

		if(vindex===-1){
			return;
		}

		while( vindex<this.n-1 ){
			this.swap(vindex,vindex+1);
			vindex++;
		}

		this._fin = this.dec(this._fin)
		this.n--;
	}

	// virtual index a, virtual index b
	swap(vinda, vindb){
		let ra = this.real(vinda);
		let rb = this.real(vindb);
		let tmp = this._ar[ra];
		this._ar[ra] = this._ar[rb];
		this._ar[rb] = tmp;
	}
}


function testCircularQueue(){
	let n = 10;
	let queue = new CircularQueue(n, (a,b) => a===b );

	queue.add(1)
	queue.add(2)
	queue.add(3)
	queue.add(4)

	let vals = queue.getValues();

	console.log(vals)


	queue = new CircularQueue(5, (a,b) => a===b );

	for(let i=0;i<20;i++){
		queue.add(i+1);
	}

	vals = queue.getValues();
	console.log(vals);

	queue.delete(18)
	queue.delete(17)
	vals = queue.getValues();
	console.log(vals);

	for(let i=0;i<4;i++){
		queue.add(i+1);
	}

	vals = queue.getValues();
	console.log(vals);

	queue = new CircularQueue(5, (a,b) =>{
		return a.offerIdA===b.offerIdA && a.offerIdB===b.offerIdB ;
	} );


	queue.add( {offerIdA:3, offerIdB:4} )
	queue.add( {offerIdA:4, offerIdB:5} )

	console.log(queue.getValues());
	queue.delete( {offerIdA:3, offerIdB:4} )
	console.log(queue.getValues());

}

//testCircularQueue();

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
exports.CircularQueue = CircularQueue;



