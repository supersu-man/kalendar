var j=Object.defineProperty,n=Object.defineProperties;var o=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var i=(c,a,b)=>a in c?j(c,a,{enumerable:!0,configurable:!0,writable:!0,value:b}):c[a]=b,r=(c,a)=>{for(var b in a||={})p.call(a,b)&&i(c,b,a[b]);if(h)for(var b of h(a))q.call(a,b)&&i(c,b,a[b]);return c},s=(c,a)=>n(c,o(a));var t=(c,a)=>()=>(a||c((a={exports:{}}).exports,a),a.exports),u=(c,a)=>{for(var b in a)j(c,b,{get:a[b],enumerable:!0})};var v=(c,a,b)=>new Promise((k,g)=>{var l=d=>{try{e(b.next(d))}catch(f){g(f)}},m=d=>{try{e(b.throw(d))}catch(f){g(f)}},e=d=>d.done?k(d.value):Promise.resolve(d.value).then(l,m);e((b=b.apply(c,a)).next())});export{r as a,s as b,t as c,u as d,v as e};