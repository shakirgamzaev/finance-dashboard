type Route = {
  label: string;
  href: string;
};

export const NAV_ROUTES: Route[] = [
  { label: "Overview", href: "/dashboard/overview" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Accounts", href: "/dashboard/accounts" },
  { label: "Categories", href: "/dashboard/categories" },
  //{ label: "Settings", href: "/dashboard/settings" },
];
