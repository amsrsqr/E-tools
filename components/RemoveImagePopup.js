import { React } from 'react';
import { Modal, ModalBody, Button, ModalHeader, ModalFooter } from 'reactstrap';
import { OK } from '../constant/MessageConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const RemoveImage = ({
  showErrorPopup,
  fieldArray = [],
  errorMessage,
  header,
  handleErrorClose,
}) => {
  const toggleShow = (flag) => {
    handleErrorClose(flag);
  };

  return (
    <Modal
      isOpen={showErrorPopup}
      centered
      toggle={() => {
        toggleShow(false);
      }}
    >
      <ModalHeader
        style={{ borderBottom: '0 none' }}
        toggle={() => {
          toggleShow(false);
        }}
      ></ModalHeader>
      <ModalBody>
        <div className="text-center">
          <p>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ fontSize: '60px', color: 'red' }}
            />
          </p>
          <div className="fw-bold" style={{ fontSize: '16px' }}>
            {header}
          </div>
          <p className="mt-3" style={{ fontSize: '14px' }}>
            {errorMessage}
          </p>
        </div>
        <div className="offset-4 col-sm-12">
          <ul className="list-group-horizontal-md">
            {fieldArray.map((field) => {
              return <li style={{ fontSize: '14px' }}>{field.name}</li>;
            })}
          </ul>
        </div>
      </ModalBody>
      <ModalFooter>
        <div
          className="d-flex justify-content-center"
          style={{ width: '100%', margin:"20px !important" }}
        >
          <Button
            onClick={() => {
              toggleShow(true);
            }}
            className="fw-bold btn btn-secondary btn-primary"
            style={{
              fontSize: '16px',
              backgroundColor: '#3c8dbc',
              border:"1px solid lightgray",              
            }}
          >
            {'Yes, remove'}
          </Button>
          <Button
            onClick={() => {
              toggleShow(false);
            }}
            className="fw-bold btn btn-secondary"
            style={{ 
              fontSize: '16px',
              backgroundColor: '#F5F5F5',
              color: 'black',
              marginLeft: '7px',
              border:"1px solid lightgray",
            }}
          >
            {'No, cancel'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default RemoveImage;
