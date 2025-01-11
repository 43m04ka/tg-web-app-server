let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //массив, можно использовать массив объектов
let size = 3; //размер подмассива
let subarray = []; //массив в который будет выведен результат.
for (let i = 0; i <Math.ceil(array.length/size); i++){
    subarray[i] = array.slice((i*size), (i*size) + size);
}
console.log(subarray);