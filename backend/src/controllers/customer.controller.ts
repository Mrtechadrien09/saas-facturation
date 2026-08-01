import { Request, Response, NextFunction } from 'express';
import { Customer } from '../models/Customer.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { name, email, phone, address } = req.body;

    const existingCustomer = await Customer.findOne({ companyId, email });
    if (existingCustomer) {
      return res.status(400).json({ success: false, message: "Un client avec cet email existe déjà." });
    }

    const customer = await Customer.create({
      companyId,
      name,
      email,
      phone,
      address,
    });

    return res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const getMyCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;

    const customers = await Customer.find({ companyId }).sort({ name: 1 });
    return res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;

    const customer = await Customer.findOne({ _id: id, companyId });
    if (!customer) {
      return res.status(404).json({ success: false, message: "Client introuvable." });
    }

    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;

    const deletedCustomer = await Customer.findOneAndDelete({ _id: id, companyId });
    if (!deletedCustomer) {
      return res.status(404).json({ success: false, message: "Client introuvable ou non autorisé." });
    }

    return res.status(200).json({ success: true, message: "Client supprimé avec succès." });
  } catch (error) {
    console.error('Erreur deleteCustomer:', error);
    return res.status(500).json({ success: false, message: "Erreur interne du serveur lors de la suppression." });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id, companyId },
      {
        name,
        email,
        phone,
        address,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: "Client introuvable ou non autorisé." });
    }

    return res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Erreur lors de la modification." });
  }
};
