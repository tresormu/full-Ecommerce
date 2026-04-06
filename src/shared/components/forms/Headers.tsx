import FirstNavBar from "../layouts/NavabarFirst";
import SecondNavBar from "../layouts/NavbarSecond";
import StickyNavBar from "../layouts/FourthNavbar";
export default function Header() {
  return (
    <div>
      <FirstNavBar />
      <SecondNavBar />
      <StickyNavBar />
    </div>
  );
}
