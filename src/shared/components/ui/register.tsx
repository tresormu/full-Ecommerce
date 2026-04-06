import LoginModal from "./login";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onLoginSuccess }: RegisterModalProps) {
  return <LoginModal isOpen={isOpen} onClose={onClose} onLoginSuccess={onLoginSuccess} />;
}
