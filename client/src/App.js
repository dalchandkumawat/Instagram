import React, { useEffect, createContext, useReducer,useContext } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import { reducer, initialState } from './reducers/userReducer';
import SubScribedUserPosts from './components/screens/SubScribedUserPosts';
import Reset from './components/screens/Reset';
import Newpassword from './components/screens/Newpassword';
export const UserContext = createContext()

const Routing = () => {
  const history = useHistory();
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user})
      //history.push('/');
    }
    else{
      if(!history.location.pathname.startsWith('/reset'))
        history.push('/signin');
    }
  },[])
  return (
    <Switch>
      <Route exact path='/'><Home></Home></Route>
      <Route path='/signin'><Signin></Signin></Route>
      <Route path='/signup'><Signup></Signup></Route>
      <Route exact path='/profile'><Profile></Profile></Route>
      <Route path='/create'><CreatePost></CreatePost></Route>
      <Route path='/profile/:userid'><UserProfile></UserProfile></Route>
      <Route path='/myfollowingpost'><SubScribedUserPosts></SubScribedUserPosts></Route>
      <Route exact path='/reset'><Reset></Reset></Route>
      <Route path='/reset/:token'><Newpassword></Newpassword></Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routing></Routing>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
export default App;
