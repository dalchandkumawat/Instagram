import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom';
const UserProfile=()=>{
    const [userProfile,setProfile]=useState(null);
    const {state,dispatch}=useContext(UserContext);
    const {userid}=useParams();
    const [showfollow,setShowFollow]=useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/profile/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result);
        })
    },[])

    const followUser=()=>{
        fetch('/follow',{
            "method":"put",
            "headers":{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UDPATE",payload:{
                following:data.following,
                followers:data.followers
            }})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        }).catch(err=>console.log(err))
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            "method":"put",
            "headers":{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UDPATE",payload:{
                following:data.following,
                followers:data.followers
            }})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollowers=prevState.user.followers.filter(item=>item!=data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
            })
            setShowFollow(true)
        }).catch(err=>console.log(err))
    }

    return (
        <>
        {userProfile
        ?
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
                <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",borderBottom:"1px solid grey"}}>
                    <div>
                        <img style={{"width":"160px","height":"160px","borderRadius":"80px"}}
                        src={userProfile.user.pic}></img>
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>{userProfile.user.followers.length} Followers</h6>
                            <h6>{userProfile.user.following.length} Following</h6>
                            {showfollow?                            
                            <button className="btn" 
                            onClick={()=>followUser()}>Follow</button>
                            :
                            <button className="btn" 
                            onClick={()=>unfollowUser()}>Unfollow</button>                            
                            }
                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item=>{
                            return (
                                <img className="item" key={item._id} src={item.pic} alt={item.title}></img>
                            )
                        })
                    }
                </div>
            </div>      
        :<h1>Loading...</h1>}
        </>
    )
}

export default UserProfile;