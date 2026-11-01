// Paste into the browser console on index.html (needs script.js loaded).
const ok=(c,m)=>console[c?"log":"error"]((c?"PASS ":"FAIL ")+m);
ok(searchTips("dnp3",-1,false,[]).length>0,"search finds DNP3");
ok(searchTips("zzzz",-1,false,[]).length===0,"no match returns empty");
ok(searchTips("",1,false,[]).every(r=>r.t[0]===1),"category filter");
ok(searchTips("",-1,true,[0]).length===1,"bookmark filter");
store.set([1,2]);ok(store.get().length===2,"storage roundtrip");store.set([]);
ok(crc(new TextEncoder().encode("123456789"))===0xCBF43926,"crc32 check value");
