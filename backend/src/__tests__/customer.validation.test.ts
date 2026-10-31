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
});
