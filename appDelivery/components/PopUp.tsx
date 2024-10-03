import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface PopUpProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  buttons?: { text: string; onPress: () => void }[];
  size?: 'small' | 'medium' | 'large';
}

const PopUp: React.FC<PopUpProps> = ({ visible, onClose, title, children, buttons = [], size = 'medium' }) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, getSizeStyle()]}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.content}>{children}</View>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity key={index} style={styles.button} onPress={button.onPress}>
                <Text style={styles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  small: {
    width: Dimensions.get('window').width * 0.6,
  },
  medium: {
    width: Dimensions.get('window').width * 0.8,
  },
  large: {
    width: Dimensions.get('window').width * 0.9,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default PopUp;