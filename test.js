let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let randomArray = []

count = 0
while(count<10) {
    let randomItem = array[Math.floor(Math.random() * array.length)];
    let add = true
    randomArray.map(el=>{
        if(el === randomItem){
            add = false
        }
    })
    if(add){
        randomArray= [...randomArray, randomItem]
        count++
    }
}

console.log(randomArray);