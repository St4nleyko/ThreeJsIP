//eval takes javascript script and executes it


function helloWorld(){
    console.log("hello david");
}

let fStr = helloWorld.toString();
console.log(fStr);

eval (fStr + " helloWorld();");