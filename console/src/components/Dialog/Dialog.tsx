import { useEffect, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "focus-trap-react";
import { Backdrop } from "./Backdrop";
import { Root } from "./styled";
import { useInsideDialog } from "../../hooks/useInsideDialog";

export const Dialog: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { handleClose } = useInsideDialog();
  useEffect(() => {
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.body.style.removeProperty("overflow");
    };
  }, []);

  return createPortal(
    <Backdrop>
      <FocusTrap>
        <Root
          open
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleClose();
            }
          }}
        >
          {children}
        </Root>
      </FocusTrap>
    </Backdrop>,
    document.body,
  );
};
