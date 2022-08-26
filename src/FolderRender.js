import { useLocation } from "react-router";
import React, { useState, useEffect } from 'react';
import ReactLoading from "react-loading";

function FolderRender(){
    let { state } = useLocation();
    const [load, setLoad] = useState([]);
    const [names,setNames] = useState([]);
    function loadFunc(idx){
        console.log('*');
        let temp=load;
        temp[idx]=false;
        setLoad([...temp]);
    }
    let data = state.data;
    let folderName = state.folderName;
    useEffect(()=>{
        let tempArr = new Array(data.length).fill(true);
        setLoad([...tempArr]);
    },[])
    // let tempArr = new Array(data.length).fill(true);
    // setLoad([...tempArr]);
    let index=state.index;
    // console.log(data,index);
    return(<div>
        <div style={{textAlign:'center'}}><p style={{ fontSize: 'x-large', fontWeight: '900', margin: '2% 5%'}}>{folderName}</p></div>
        <div style={{display:'flex', flexFlow:'row wrap', justifyContent:'center'}}>
            {data[index].items.map((itm, idx) => {
                return (<div style={{width:'25%', textAlign:'center'}}>
                            {/* <img onLoad={() => loadFunc(idx)} style={{width:'-webkit-fill-available', margin:'3%', borderRadius:'2%'}} src={itm.url} /> */}
                            {load[idx] ? <ReactLoading type='spinningBubbles' color='black' /> : null}
                            <img onLoad={() => loadFunc(idx)} style={{width:'-webkit-fill-available', margin:'3%', borderRadius:'2%'}} src={itm.url} />
                            <p style={{fontSize: 'larger', fontWeight: '700', margin: '2% 5%'}}>{itm.name}</p>
                        </div>)
            })}
        </div>
    </div>)
}

export default FolderRender;