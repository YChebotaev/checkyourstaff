import { useEffect, type FC } from "react";

export const DEFAULT_TEXT_COLOR = "#ffffff";
export const DEFAULT_BLUE_COLOR = "#71a6e2";
export const DISABLED_GRAY_COLOR = "#939393";

export type MainButtonType = FC<{
  text: string;
  color?: string;
  textColor?: string;
  isActive?: boolean;
  isVisible?: boolean;
  progress?: boolean | null;
  onClick?(): void;
}> & {
  disabledProps(disabled?: boolean): {
    isActive: boolean;
    color: string;
  };
};

export const MainButton: MainButtonType = ({
  text,
  color = DEFAULT_BLUE_COLOR,
  textColor = DEFAULT_TEXT_COLOR,
  isActive = true,
  isVisible = true,
  progress = null,
  onClick,
}) => {
  useEffect(() => {
    Telegram.WebApp.MainButton.setParams({
      text,
      color,
      text_color: textColor,
      is_visible: isVisible,
      is_active: isActive,
    });

    if (typeof onClick === "function") {
      Telegram.WebApp.onEvent("mainButtonClicked", onClick);
    }

    if (progress != null) {
      if (progress) {
        Telegram.WebApp.MainButton.showProgress(false);
      } else {
        Telegram.WebApp.MainButton.hideProgress();
      }
    }

    return () => {
      if (progress != null) {
        Telegram.WebApp.MainButton.hideProgress();
      }

      if (typeof onClick === "function") {
        Telegram.WebApp.offEvent("mainButtonClicked", onClick);
      }
    };
  }, [text, color, textColor, isActive, isVisible, progress, onClick]);

  useEffect(() => {
    return () => {
      if (Telegram.WebApp.MainButton.isVisible) {
        Telegram.WebApp.MainButton.hide();
      }
    };
  });

  return null;
};

MainButton.disabledProps = (disabled = false) =>
  disabled
    ? {
        isActive: false,
        color: DISABLED_GRAY_COLOR,
      }
    : {
        isActive: true,
        color: DEFAULT_BLUE_COLOR,
      };
