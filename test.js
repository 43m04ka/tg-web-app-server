let a = [{id:0}, {id:1}, {id:2}, {id:3}, {id:5}, {id:6}];
let b  = [{id:3}]

console.log(a.filter(person_A => !b.some(person_B => person_A.id === person_B.id)))