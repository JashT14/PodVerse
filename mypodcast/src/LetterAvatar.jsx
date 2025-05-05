// LetterAvatar.jsx
import 'react';

const generateLetterAvatar = (email) => {
  if (!email) return null;
  
  // Extract first letter and capitalize it
  const firstLetter = email.charAt(0).toUpperCase();
  
  // Generate a consistent color based on the letter
  const colors = [
    '#4285F4', // Google blue
    '#EA4335', // Google red
    '#FBBC05', // Google yellow
    '#34A853', // Google green
    '#8667C5', // Purple
    '#00ACC1', // Cyan
    '#AB47BC', // Purple
    '#FF7043', // Deep Orange
    '#EC407A', // Pink
    '#5C6BC0'  // Indigo
  ];
  
  // Use the character code to pick a color
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return {
    letter: firstLetter,
    backgroundColor: backgroundColor,
    color: '#FFFFFF' // White text
  };
};

const LetterAvatar = ({ email, size = '100%', className = '' }) => {
  const avatarInfo = generateLetterAvatar(email);
  
  if (!avatarInfo) return null;
  
  return (
    <div 
      className={`letter-avatar ${className}`}
      style={{ 
        backgroundColor: avatarInfo.backgroundColor,
        color: avatarInfo.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        fontSize: size === '100%' ? '3rem' : `calc(${size} * 0.6)`,
        fontWeight: 'bold'
      }}
    >
      {avatarInfo.letter}
    </div>
  );
};

export default LetterAvatar;
export { generateLetterAvatar };