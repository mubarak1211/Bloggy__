import './App.css';
import { Route, Routes } from "react-router-dom";
import Header from './components/Header';
import React, { useEffect } from 'react';
import Login from './components/Login';
import Blogs from './components/Blogs';
import UserBlogs from './components/UserBlogs'
import AddBlogs from './components/AddBlogs'
import BlogDetail from './components/BlogDetail'
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store';
import api from './api';



function App() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDarkmode);

  useEffect(()=>{
    const token = localStorage.getItem("authToken");
    if(token){
      dispatch(authActions.login());
      api.get("/api/users/me")
        .then((response) => dispatch(authActions.updateUser(response.data.data.user)))
        .catch(() => dispatch(authActions.logout()));
    }
  },[dispatch]);
  
  return <div className={`app-shell ${isDark ? "theme-dark" : "theme-light"}`}>
    <header>
      <Header/>
    </header>
    <main>
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/blogs" element={<Blogs/>}></Route>
      <Route path="/myBlogs" element={<UserBlogs/>}></Route>
      <Route path="/myBlogs/:id" element={<BlogDetail/>}></Route>
      <Route path="/blogs/add" element={<AddBlogs />} />
    </Routes>
    </main>

  </div>;
}

export default App;
