
var object = {
    c: "cool",
    k: "kool",
    f: "fresh",
    t: function(){
        return this;
    }
};

var arr = [1,2,3,4,5];

function add(a,b) {
    return a + b;
}

function human(name, age){
    this.name = name;
    this.age = age;
}

function a (a,b){
    this.a = a;
    this.b = b;
};
function prototypeExampe (){
    var hello = new a(1,2);
    var world = new a(4,5);
    console.log(hello.a);
    console.log(world.a);
    //hello.c = 10;
    a.prototype.c = 10;
    console.log(hello.c);
    console.log(world.c);
    
};

window.onload = function() {
    console.log("Hello");
    console.log(object);
    arr.forEach(function(i){console.log(i);});
    
    for(var e in object){
        console.log(e + ': ' + object[e]);
    }
    for(var a in arr){
        console.log(a + ': ' + arr[a]);
    }
    var str = 'aslkfjslkajfklsdaj';
    console.log(/lk/.test(str));
    console.log(/as/.test(str));
    console.log(str.match(/as/g));
    console.log(/es/.test(str));
    
    arr.map(function(i){
        console.log(i*5);
    });
    console.log("-----------");
    arr.reduce(function(a,b){ //a is the current value returned from the last iteration, 
                                //b is the next value
        console.log(a+ " " + b);
        return b;
    }); 
    console.log("---------");
    var temp = arr.filter(function(c){
        return c > 3;
    });
    console.log(temp);
    console.log("***********");
    var bob = new human('bob',45);
    human.prototype.run = function(){
        console.log(this.name + " is running");
    } 
    bob.run();
    console.log(bob);
    var number = 1 < 3 ? 123 : 321;
    console.log("...........");
    prototypeExampe();
};