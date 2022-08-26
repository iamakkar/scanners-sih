import {db} from './Config/Firebase';
import {getDoc, doc} from 'firebase/firestore';
import { useParams } from "react-router";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder  } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

function Documents(){
    let {id} = useParams();
    let [data, setData] = useState(-1);
    let [names,setNames] = useState([]);
    const navigate = useNavigate();
    useEffect(async() => {
        let dataDoc = await getDoc(doc(db, 'Documents', id)); 
        if(dataDoc.exists())
        {
            setData(dataDoc.data());
        }else{
            setData(0);
        }
        let tempNames=[];
        for(let x in data.data){
            tempNames.push(x.name);
        }
        setNames([...names]);
      }, []);

      function openFolderFunc(e,idx,folderName){
        // console.log(data.data);
        navigate('/main/docs/folder/', {state:{index:idx, data: data.data, folderName: folderName}});
      }

    if(data==-1){
        return (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100vh'}}>
            <ReactLoading type='cylon' color='black' />
            {/* <p style={{fontSize: 'larger', fontWeight: '700', margin: '1%'}}>Loading</p> */}
        </div>);
    }else if(data == 0){
        return (<div>
            <p style={{fontSize: 'larger', fontWeight: '700', margin: '2% 5%'}}>No Document found!!</p>
        </div>);
    }else{
        return (<div>
            <div style={{textAlign:'center'}}><p style={{ fontSize: 'x-large', fontWeight: '900', margin: '2% 5%'}}>Documents</p></div>
            <div style={{display:'flex', flexFlow:'row wrap',justifyContent:'center'}}>
                {data.data.map((folder, idx) => {
                    return(<div style={{width:'22%', margin:'1%'}}> 
                        <button style={{border:'none', backgroundColor:'white'}} onClick={e => openFolderFunc(e,idx,folder.name)}><FontAwesomeIcon style={{ fontSize: '90px', margin: 0 }} icon={faFolder} /></button>
                        {/* <input on */}
                        <p style={{fontSize: 'larger', fontWeight: '700', margin: '0.5% 1%'}}>{folder.name}</p>
                    </div>)
                })}
            </div>
        </div>)
    }

    // if(!data){
    //     return (<div>
    //         <p>No Document found!!</p>
    //     </div>);
    // }
    // else{
    //     return(<div>
    //         {data.data.map(dat => {
    //             return(<div>
    //                 <p style={{fontStyle: 'oblique', fontSize: 'larger', fontWeight: '700', margin: '2%', display:'inline-block'}}>{dat.name}</p>
    //                 <p style={{fontStyle: 'oblique', fontSize: 'larger', fontWeight: '700', margin: '2%', display:'inline-block'}}>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(dat.timestamp)}</p>
    //                 <div style={{display:'flex', flexFlow:'row wrap', justifyContent:'center'}}>
    //                 {dat.items.map(itm => {
    //                     return (<div style={{width:'25%'}}>
    //                         <img style={{width:'-webkit-fill-available', margin:'3%', borderRadius:'2%'}} src={itm.url} />
    //                         <p style={{fontStyle: 'oblique', fontSize: 'larger', fontWeight: '700', margin: '2% 5%'}}>{itm.name}</p>
    //                     </div>)
    //                 })}
    //                 </div>
    //             </div>)
    //         })}
    //     </div>)
    // }
}
export default Documents;