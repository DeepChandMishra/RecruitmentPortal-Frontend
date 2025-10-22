import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProfileMen from "../assets/images/profileellipse.png"
import LocationIcon from "../assets/images/locationicon.png"


const OppModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  return (
    <div className='opport_model'>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> 
      <Modal show={show} onHide={handleClose} animation={false}   centered>
        <div className='p-3 '>
        <Modal.Header closeButton style={{alignItems:"start"}}> 
          <Modal.Title style={{position:'relative'}}> 
            <img src={ProfileMen} alt="profilemen" />
            <div style={{backgroundColor:"white",height:"25px",width:"25px",borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',bottom:'0px',right:'10px', cursor:'pointer'}}>
            <svg width="12" height="11" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.00001 12.3332H13M1.00003 12.3332H2.11639C2.44251 12.3332 2.60557 12.3332 2.75902 12.2963C2.89507 12.2637 3.02513 12.2098 3.14443 12.1367C3.27898 12.0542 3.39428 11.9389 3.62489 11.7083L12 3.33316C12.5523 2.78087 12.5523 1.88544 12 1.33316C11.4478 0.780874 10.5523 0.780875 10 1.33316L1.62487 9.70832C1.39427 9.93892 1.27897 10.0542 1.19651 10.1888C1.12341 10.3081 1.06953 10.4381 1.03687 10.5742C1.00003 10.7276 1.00003 10.8907 1.00003 11.2168V12.3332Z" stroke="#4B5563" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div class="input-search saved-input-items mb-3">
          <label for="exampleFormControlInput1" class="form-label">First Name</label>
          <input type="search" placeholder="John" style={{paddingLeft:'12px',color:'#808080'}} aria-label="Search" aria-describedby="basic-addon2"/>
          </div>
          <div class="input-search saved-input-items mb-3">
          <label for="exampleFormControlInput1" class="form-label">Second Name</label>
          <input type="search" placeholder="Doe" style={{paddingLeft:'12px',color:'#808080'}} aria-label="Search" aria-describedby="basic-addon2"/>
          </div>
          <div className='position-relative'>
         <label for="exampleFormControlInput1" class="form-label">Location</label>
          <select name="sort-by" id="sort-by" placeholder="Sort by" class="select-employer-dashboard w-100 mb-3" style={{outline:'none',color:'#808080',background:'none'}}>
            <option value="recent">UK</option>
            <option value="a-z">USA</option>
            <option value="z-a">Thailand</option>
            </select>
            <img className='position-absolute' style={{right:'15px',bottom:"28px"}} src={LocationIcon} alt="location" />
            </div>
          <label for="exampleFormControlInput1" class="form-label">Language</label>
          <select name="sort-by" id="sort-by" placeholder="Sort by" class="select-employer-dashboard w-100 mb-3" style={{outline:'none',color:'#808080'}}>
            <option value="recent">English</option>
            <option value="a-z">Html</option>
            <option value="z-a">Javascript</option>
            </select>
            <label for="exampleFormControlInput1" class="form-label">Skills</label>
          <select name="sort-by" id="sort-by" placeholder="Sort by" class="select-employer-dashboard w-100 mb-3" style={{outline:'none',color:'#808080'}}>
            <option value="recent">Python</option>
            <option value="a-z">Html</option>
            <option value="z-a">Javascript</option>
            </select>
            <label for="exampleFormControlInput1" class="form-label">Type of Opportunity</label>
          <select name="sort-by" id="sort-by" placeholder="Sort by" class="select-employer-dashboard w-100" style={{outline:'none',color:'#808080'}}>
            <option value="recent">Ilets</option>
            <option value="a-z">Html</option>
            <option value="z-a">Javascript</option>
            </select>
        </Modal.Body>
        <Modal.Footer style={{borderTop:'none'}}>    
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
        </div>
      </Modal>
    
    </div>
  )
}
export default OppModal;