import { createCustomerSchema } from '../validations/customer.validation';

describe('createCustomerSchema', () => {
  it('accepte un payload client avec champs optionnels vides', () => {
    const payload = {
      body: {
        name: 'Jean Martin',
        email: 'jean@example.com',
        phone: '',
        address: {
          street: '',
          city: '',
          zipCode: '',
          country: '',
        },
      },
    };

    expect(() => createCustomerSchema.parse(payload)).not.toThrow();
  });

  it('accepte un numéro de téléphone au format standard avec pays', () => {
    const payload = {
      body: {
        name: 'Jean Martin',
        email: 'jean@example.com',
        phone: '+33 (6) 12 34 56 78',
        address: {
          street: '10 rue de Paris',
          city: 'Paris',
          zipCode: '75000',
          country: 'France',
        },
      },
    };

    expect(() => createCustomerSchema.parse(payload)).not.toThrow();
  });
});
