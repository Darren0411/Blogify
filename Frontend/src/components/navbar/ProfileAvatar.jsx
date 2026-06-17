import React from 'react';

const getInitials = (user) => {
  if (!user) return 'U';
  const name = user.fullName || user.name || '';
  if (!name) return 'U';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

const ProfileAvatar = ({ user, size = 'w-9 h-9', textSize = 'text-sm' }) => {
  return (
    <div
      className={`${size} bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-medium ${textSize}`}
    >
      {getInitials(user)}
    </div>
  );
};

export default ProfileAvatar;