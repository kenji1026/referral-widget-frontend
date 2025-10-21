import { useState } from 'react';

export function useDialog(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  return { open, openDialog, closeDialog };
}
