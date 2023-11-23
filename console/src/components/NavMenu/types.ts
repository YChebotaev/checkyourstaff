import { type ReactNode } from "react"

export type NavMenuProps = {
  items: NavMenuItemProps[]
  activeKey: string
}

export type NavMenuItemProps = {
  key: string
  title: string
  href: string
  icon: ReactNode | ((props: { active: boolean }) => ReactNode)
}
