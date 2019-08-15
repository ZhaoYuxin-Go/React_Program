import store from "store";

export const saveUser = (user) => localStorage.setItem('user_key',JSON.stringify(user))
// export const saveUser = (user) => store.set('user_key',user)
export const getUser = (user) => JSON.parse(localStorage.getItem('user_key')||'{}')

export const removeUser = () =>store.remove('user_key')