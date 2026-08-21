import { redirect } from "next/navigation";

/** Redirects the root URL to the operational quotation workspace. */
export default function HomePage() {
  redirect("/cotizaciones");
}
