import { SettingsIcon, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

export const FIELD_NAMES = {
  name: "Name",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  name: "text",
  email: "email",
  password: "password",
};

export const FIELD_PLACEHOLDER = {
  name: "John Wick",
  email: "user@example.com",
  password: "******",
};

export const SIDEBAR_MENU_ITEM = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];
