import { Bell, ChartAlt, PieChart } from "../icons";
import { type NavMenuItemProps } from "../components/NavMenu";

export const appMenu: NavMenuItemProps[] = [
  {
    key: "stats",
    title: "Общие данные",
    href: "/stats",
    icon: <PieChart />,
  },
  {
    key: "charts",
    title: "Графики",
    href: "/charts",
    icon: <ChartAlt />,
  },
  {
    key: "feedback",
    title: "Фидбек",
    href: "/feedback",
    icon: <Bell />,
  },
];
