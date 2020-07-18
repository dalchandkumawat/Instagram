import React,{useState} from 'react';
import {useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';
const Newpassword = () => {
    const history=useHistory();
    const [password,setPassword]=useState("");
    const {token}=useParams()

    const PostData=()=>{
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                newpassword:password,
                token
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#c62727 red darken-3"});
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/signin');
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="password" placeholder="Enter new Password"
                value={password} onChange={(e)=>setPassword(e.target.value)}
                ></input>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>PostData()}
                >
                    Change Password
                </button>
            </div>
        </div>

    )
}
export default Newpassword;
