
const Access_token = "Access";


const getitem = (key) => {
  return localStorage.getItem(key);  
}


const setitem = (key, value) => {
  localStorage.setItem(key, value);

}


const removeitem = (key) => {
  localStorage.removeItem(key);  
}


export { Access_token, getitem, setitem, removeitem };
