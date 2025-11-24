import { create } from 'zustand'

interface SettingsDialogStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useSettingsDialog = create<SettingsDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
