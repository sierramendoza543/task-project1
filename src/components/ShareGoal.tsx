'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { SharedUser } from '@/types/goals';

interface ShareGoalProps {
  sharedWith: SharedUser[];
  onShareUpdate: (users: SharedUser[]) => void;
}

type UserRole = 'viewer' | 'editor';

export default function ShareGoal({ sharedWith, onShareUpdate }: ShareGoalProps) {
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<UserRole>('viewer');
  const [error, setError] = useState<string>('');

  const handleShare = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return;

    // Check if already shared with this email
    if (sharedWith.some(user => user.email === email.trim())) {
      setError('Already shared with this user');
      return;
    }

    const newUser: SharedUser = {
      email: email.trim(),
      role,
    };

    onShareUpdate([...sharedWith, newUser]);
    setEmail('');
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setRole(e.target.value as UserRole);
  };

  const removeShare = (email: string): void => {
    onShareUpdate(sharedWith.filter(user => user.email !== email));
  };

  const updateRole = (email: string, newRole: UserRole): void => {
    onShareUpdate(
      sharedWith.map(user => 
        user.email === email ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleShare} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email to share with"
            className="flex-1 px-3 py-2 border rounded-md"
            required
          />
          <select
            value={role}
            onChange={handleRoleChange}
            className="px-3 py-2 border rounded-md"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Share
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>

      {sharedWith.length > 0 && (
        <div className="border rounded-md divide-y">
          {sharedWith.map(user => (
            <div key={user.email} className="flex items-center justify-between p-3">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.email, e.target.value as UserRole)}
                  className="px-2 py-1 text-sm border rounded"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeShare(user.email)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 