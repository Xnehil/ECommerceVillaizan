import Link from "next/link";

function LogoBackHome() {
  return (
    <Link href={"/"}>
      {/*<img src="VillaizanLogo2png.png" className="w-[185px]" />*/}
      <img
                src="/images/logo.png"
                alt="Helados Villaizan"
                className="h-12"
              />
    </Link>
  );
}
export default LogoBackHome;