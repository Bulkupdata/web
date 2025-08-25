import{ useState } from 'react';
import AuthModal from './AuthModal';

const Auth = () => {
  // Use local state to control the modal's open/close status
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers to open and close the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* The button that opens the authentication modal */}
      <button onClick={handleOpenModal}>Open Auth Modal</button>
      
      {/* The AuthModal component now receives two props:
        1. `isOpen`: A boolean to tell it whether to display or not.
        2. `onClose`: A function to close the modal when triggered from within.
      */}
      <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Auth;