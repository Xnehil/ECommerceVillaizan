import Cookies from "js-cookie"
import { CityCookie } from "types/global"

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export function getCityCookie() {
  const cityCookie = Cookies.get("city")
  if (!cityCookie) {
    return { id: "none", nombre: "none" }
  }
  try {
    return JSON.parse(cityCookie)
  } catch (e) {
    console.error("Failed to parse city cookie:", e)
    return { id: "none", nombre: "none" }
  }
}

export function setCityCookie(city: CityCookie) {
  Cookies.set("city", JSON.stringify(city), { expires: 7 })
}
