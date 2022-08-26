import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Main(props){
    let {id} = useParams();
    console.log(id);
    const navigate = useNavigate();

    return(
    <div style={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
        <div className="d-grid gap-2" style={{width: '100vw'}} >
            <Button variant="primary" style={{width:'70%', margin:'2% auto'}} onClick={() => navigate("/main/upload/"+id)}>
              Upload Document
            </Button>
        </div>
        <div className="d-grid gap-2" style={{width: '100vw'}} >
            <Button variant="primary" style={{width:'70%', margin:'2% auto'}} onClick={() => navigate("/main/docs/"+id)}>
                Documents
            </Button>
        </div>
        {/* <button onClick={() => navigate("/main/upload/"+id)}>Upload Document</button>
        <button onClick={() => navigate("/main/docs/"+id)}>Documents</button> */}
    </div>)
}

export default Main;