import {db} from './Config/Firebase';
import {getDoc, doc} from 'firebase/firestore';
import { useParams } from "react-router";
import { useEffect, useState } from 'react';

function Documents(){
    let {id} = useParams();
    let [data, setData] = useState();
    useEffect(async() => {
        let dataDoc = await getDoc(doc(db, 'Documents', id)); 
        if(dataDoc.exists())
        setData(dataDoc.data());
      }, []);

    // let dataDoc = await getDoc(doc(db, 'Documents', id)); 
    // let data = dataDoc.data();
    // console.log(dataDoc.exists());
    if(!data){
        return (<div>
            <p>No Document found!!</p>
        </div>);
    }
    else{
        return(<div>
            {data.data.map(dat => {
                return(<div>
                    <p style={{fontStyle: 'oblique', fontSize: 'larger', fontWeight: '700', margin: '2%', display:'inline-block'}}>{dat.name}</p>
                    <p style={{fontStyle: 'oblique', fontSize: 'larger', fontWeight: '700', margin: '2%', display:'inline-block'}}>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(dat.timestamp)}</p>
                    <div style={{display:'flex', flexFlow:'row wrap', justifyContent:'center'}}>
                    {dat.items.map(itm => {
                        return (<div style={{width:'25%'}}>
                            <img style={{width:'-webkit-fill-available', margin:'3%', borderRadius:'2%'}} src={itm.url} />
                            <p style={{fontStyle: 'oblique', fontSize: 'larger', fontWeight: '700', margin: '2% 5%'}}>{itm.name}</p>
                        </div>)
                    })}
                    </div>
                </div>)
            })}
        </div>)
    }
}
export default Documents;