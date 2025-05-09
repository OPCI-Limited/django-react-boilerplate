import { Button, Modal } from 'react-bootstrap';

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}

export function DeleteConfirmationModal({
  show,
  onHide,
  onConfirm,
  itemName = 'item',
  loading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete {itemName}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        Are you sure you want to delete {itemName}?
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}