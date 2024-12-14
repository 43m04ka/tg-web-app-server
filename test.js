const a = [{id:0}, {id:1}, {id:2}, {id:3}, {id:5}, {id:6}];
let b  = [{id:4}]
console.log(([...a, ...b]).sort((a, b) => a.id-b.id))