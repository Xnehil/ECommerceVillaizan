import Cookies from "js-cookie"

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export function getCityCookie() {
  let cityId = Cookies.get("cityId")
  if (!cityId) {
    cityId = "none"
  }
  return cityId
}

export function setCityCookie(city: string) {
  Cookies.set("cityId", city, { expires: 2 })
}
