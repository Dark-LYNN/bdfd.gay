import styles from '@/styles/settingsModal.module.css';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  
  const addUserToMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/add-member');
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error adding user to members');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUserInStaff = async () => {
      if (session && session.user) {
        try {
          const response = await axios.get('/api/check-member', {
            params: { userID: session.user.id },
          });
          setIsButtonDisabled(response.data.userExists);
        } catch (error) {
          console.error('Error checking membership status:', error);
        }
      }
    };
    checkUserInStaff();
  }, [session]);

  if (!isOpen) return null; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>Settings</h2>
        <div>
          <label className={styles.Lable_title}>General Settings</label>
          <div>
            <button onClick={addUserToMembers} disabled={isButtonDisabled}>
              {loading ? 'Adding...' : 'Get Added'}
            </button>
            {message && <p>{message}</p>} 
          </div>
        </div>
        <div>
          <label className={styles.Lable_title}>Language</label>
          <select className={styles.select}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
