import { createContext, useContext } from "react";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export const MobileNavContext = createContext<Ctx>({
  open: false,
  setOpen: () => {},
});

export const useMobileNav = () => useContext(MobileNavContext);
