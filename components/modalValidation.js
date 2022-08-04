import { React } from 'react';
import { Modal, ModalBody, Button, ModalHeader } from 'reactstrap';
import { OK } from '../constant/MessageConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ModalValidation = ({
  showErrorPopup,
  fieldArray,
  errorMessage,
  handleErrorClose,
}) => {
  const toggleShow = () => {
    handleErrorClose();
  };

  return (
    <Modal isOpen={showErrorPopup} centered toggle={toggleShow}>
      <ModalHeader
        style={{ 'border-bottom': '0 none' }}
        toggle={toggleShow}
      ></ModalHeader>
      <ModalBody>
        <div className="text-center">
          <p>
            {/* <i
              class="fa fa-exclamation-triangle fa-cog"
              aria-hidden="true"
              // style={{ fontSize: "20px" }}
            ></i> */}
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ fontSize: '60px', color: 'red' }}
            />
          </p>
          <div className="fw-bold" style={{ fontSize: '16px' }}>
            Error
          </div>
          <p className="mt-3" style={{ fontSize: '14px' }}>
            {errorMessage}
          </p>
        </div>
      </ModalBody>
      <Button
        onClick={toggleShow}
        className="fw-bold"
        style={{
          fontSize: '16px',
          backgroundColor: '#F5F5F5',
          color: 'black',
          borderColor: 'white',
        }}
      >
        {OK}
      </Button>
    </Modal>
  );
};

export default ModalValidation;
