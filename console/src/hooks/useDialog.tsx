import { useState, createContext, type ReactNode } from "react";

export type UseDialogContextProps = {
  handleClose(): void;
};

export const context = createContext<UseDialogContextProps | null>(null);

export const useDialog = (element: ReactNode) => {
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };

  return {
    element: visible ? (
      <useDialog.Provider handleClose={handleClose}>
        {element}
      </useDialog.Provider>
    ) : null,
    toggle(nextState?: boolean) {
      if (nextState == null) {
        setVisible(!visible);
      } else {
        setVisible(nextState);
      }
    },
  };
};

useDialog.Provider = ({
  handleClose,
  children,
}: {
  handleClose: UseDialogContextProps["handleClose"];
  children: ReactNode;
}) => <context.Provider value={{ handleClose }}>{children}</context.Provider>;
