import { render, screen } from "@testing-library/react";
import { SidebarNav } from "./SidebarNav";

let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

test("displays the navigation links", () => {
  render(<SidebarNav />);

  expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Users" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Orders" })).toBeInTheDocument();
});

test("marks Dashboard as active on dashboard route", () => {
  render(<SidebarNav />);

  expect(screen.getByRole("link", { name: "Dashboard" })).toHaveClass(
    "bg-slate-700",
    "text-white",
  );
});

test("marks Users as active on users route", () => {
  mockPathname = "/users";

  render(<SidebarNav />);

  expect(screen.getByRole("link", { name: "Users" })).toHaveClass(
    "bg-slate-700",
    "text-white",
  );
});

test("marks Orders as active on order detail route", () => {
  mockPathname = "/orders/1";

  render(<SidebarNav />);

  expect(screen.getByRole("link", { name: "Orders" })).toHaveClass(
    "bg-slate-700",
    "text-white",
  );
});