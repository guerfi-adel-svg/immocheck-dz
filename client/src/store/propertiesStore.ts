import { create } from 'zustand';
import { propertiesAPI } from '../lib/api';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  beds: number;
  baths: number;
  area: number;
  type: string;
  owner: string;
  createdAt: string;
}

interface PropertiesStore {
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  filters: any;

  fetchProperties: (params?: any) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  createProperty: (data: any) => Promise<void>;
  updateProperty: (id: string, data: any) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  setFilters: (filters: any) => void;
}

export const usePropertiesStore = create<PropertiesStore>((set) => ({
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchProperties: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await propertiesAPI.getAll(params);
      set({ properties: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch properties', isLoading: false });
    }
  },

  fetchPropertyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await propertiesAPI.getById(id);
      set({ currentProperty: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch property', isLoading: false });
    }
  },

  createProperty: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesAPI.create(data);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create property', isLoading: false });
      throw error;
    }
  },

  updateProperty: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesAPI.update(id, data);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update property', isLoading: false });
      throw error;
    }
  },

  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesAPI.delete(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete property', isLoading: false });
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },
}));
