import React from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";

const DeleteAgentModal = ({ isOpen, toggle, onDelete }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalBody className="text-center">
        <h5 className="mb-3 font-semibold">Are you sure you want to delete this agent?</h5>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
      </ModalBody>
      <ModalFooter className="flex justify-center gap-3">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={onDelete}>
             Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAgentModal;
