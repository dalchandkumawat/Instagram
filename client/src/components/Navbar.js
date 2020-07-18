import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css'
const Navbar = () => {
    const searchModal = useRef(null)
    const { state, dispatch } = useContext(UserContext);
    const [userDetails,setUserDetails]=useState([])
    const [search, setSearch] = useState("");
    const history = useHistory();
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if (state) {
            return [
                <li key="1"><i className="large material-icons modal-trigger" data-target="searchmodal" style={{ color: "black" }}>search</i> </li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to='/myfollowingpost'>My Following Posts</Link></li>,
                <li key="5">
                    <button className="btn #c62828 red darken-3"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            history.push('/signin');
                        }}
                    >Logout</button>
                </li>
            ]
        }
        else {
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchusers=(query)=>{
        setSearch(query);
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user)
        })
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="searchmodal" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input type="text"
                        placeholder="Searce User"
                        value={search}
                        onChange={(e) => fetchusers(e.target.value)}
                    >
                    </input>
                    <ul class="collection">
                        {userDetails.map(item=>{
                            return <Link key={item._id} to={item._id!==state._id?"/profile/"+item._id:'/profile'} onClick={()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                                setUserDetails([])
                            }}><li className="collection-item">{item.name}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{
                        setSearch("")
                        setUserDetails([])
                    }}>Close</button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;