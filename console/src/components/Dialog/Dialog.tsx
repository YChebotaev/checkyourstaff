import { useEffect, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "focus-trap-react";
import { Backdrop } from "./Backdrop";
import { Root } from "./styled";

type ChildrenProps = {
  handleClose(): void;
};

export const Dialog: FC<{
  children: ReactNode | ((props: ChildrenProps) => ReactNode);
}> = ({ children }) => {
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
        >
          {typeof children === "function"
            ? children({ handleClose() {} })
            : children}
        </Root>
      </FocusTrap>
    </Backdrop>,
    document.body,
  );
};
