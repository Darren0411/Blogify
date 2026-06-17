import React from 'react';

const getInitials = (user) => {
  const name = user?.fullName || user?.name || '';
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ProfileAvatar = ({ user, size = 'w-8 h-8' }) => (
  <div className={`${size} rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-medium text-xs flex-shrink-0`}>
    {getInitials(user)}
  </div>
);

export default ProfileAvatar;