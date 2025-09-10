import React, { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../utils/api';
import { User } from '../../types';

interface UserFormProps {
  user: User | null;
  onSave: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  companyName: string;
  city: string;
  zipcode: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  companyName?: string;
  city?: string;
  zipcode?: string;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    companyName: '',
    city: '',
    zipcode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        companyName: user.company.name,
        city: user.address.city,
        zipcode: user.address.zipcode,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.zipcode.trim()) {
      newErrors.zipcode = 'Zipcode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        company: {
          name: formData.companyName,
        },
        address: {
          city: formData.city,
          zipcode: formData.zipcode,
        },
      };

      if (user) {
        await api.updateUser(user.id, userData);
      } else {
        await api.createUser(userData as Omit<User, 'id'>);
      }

      onSave();
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Failed to ${user ? 'update' : 'create'} user`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          placeholder="Enter full name"
        />

        <Input
          label="Username"
          value={formData.username}
          onChange={handleInputChange('username')}
          error={errors.username}
          placeholder="Enter username"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="Enter email address"
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          error={errors.phone}
          placeholder="Enter phone number"
        />

        <Input
          label="Website"
          value={formData.website}
          onChange={handleInputChange('website')}
          error={errors.website}
          placeholder="Enter website URL"
        />

        <Input
          label="Company Name"
          value={formData.companyName}
          onChange={handleInputChange('companyName')}
          error={errors.companyName}
          placeholder="Enter company name"
        />

        <Input
          label="City"
          value={formData.city}
          onChange={handleInputChange('city')}
          error={errors.city}
          placeholder="Enter city"
        />

        <Input
          label="Zipcode"
          value={formData.zipcode}
          onChange={handleInputChange('zipcode')}
          error={errors.zipcode}
          placeholder="Enter zipcode"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};